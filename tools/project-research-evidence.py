#!/usr/bin/env python3
"""Publish allowlisted event metadata from retained records; never modify the originals.
Usage: python3 tools/project-research-evidence.py PRIVATE_SOURCE_DIR
Runtime nodes and native sessions remain separate unless a source provides an exact join.
"""
import hashlib, json, re, sys
from pathlib import Path

root = Path(sys.argv[1])
out = Path("public/research/records")
out.mkdir(parents=True, exist_ok=True)
reviewed_findings = json.loads(
    Path("research/research-publication/reviewed-findings.json").read_text()
)
reviewed_assignments = json.loads(
    Path("research/research-publication/reviewed-assignments.json").read_text()
)


reviewed_messages = json.loads(
    Path("research/research-publication/reviewed-messages.json").read_text()
)
message_review = json.loads(
    Path("research/research-publication/reviewed-messages-receipt.json").read_text()
)
join_review = json.loads(
    Path("research/research-publication/reviewed-native-joins.json").read_text()
)
tool_review = json.loads(
    Path("research/research-publication/reviewed-tools.json").read_text()
)


def digest(data):
    return hashlib.sha256(data).hexdigest()


def validate_tool_review(source):
    """A reviewed excerpt is valid only for the cited immutable record."""
    rows_by_path = {}
    for cited in tool_review["sourceFiles"]:
        data = (source / cited["path"]).read_bytes()
        if digest(data) != cited["sha256"] or len(data) != cited["bytes"]:
            raise ValueError("Tool source changed; publication review required")
        rows_by_path[cited["path"]] = {
            ln: json.loads(line)
            for ln, line in enumerate(data.decode().splitlines(), 1)
            if line.strip()
        }
    reviewed = {}
    source_hashes = {f["path"]: f["sha256"] for f in tool_review["sourceFiles"]}
    for entry in tool_review["records"]:
        cited = entry["source"]
        key = (cited["path"], cited["line"], entry["kind"])
        message = rows_by_path[cited["path"]][cited["line"]].get("message", {})
        content = message.get("content", [])
        content = (
            content if isinstance(content, list)
            else [{"type": "text", "text": content}]
        )
        if (
            key in reviewed
            or cited["sha256"] != source_hashes[cited["path"]]
            or digest(json.dumps(content, sort_keys=True).encode()) != entry["contentSha256"]
        ):
            raise ValueError("Tool review does not match its cited source record")
        content_hash = entry["contentSha256"]
        if entry["kind"] == "input":
            actual = [
                (t.get("id"), t.get("name")) for t in content
                if t.get("type") in ["toolCall", "tool_use"]
            ]
            approved = tool_review["calls"][content_hash]
            if actual != [(t["id"], t["name"]) for t in approved]:
                raise ValueError("Reviewed tool calls differ from the source IDs or names")
        elif entry["kind"] == "result" and message.get("role") == "toolResult":
            approved = tool_review["results"][content_hash]
        else:
            raise ValueError("Invalid tool review record kind")
        reviewed[key] = approved
    return reviewed


def safe_id(value):
    return (
        value
        if isinstance(value, str) and re.fullmatch(r"[a-zA-Z0-9_./:@-]+", value)
        else None
    )


def category(name, args):
    s = (name + " " + json.dumps(args)).lower()
    if re.search(r"spawn|delegate|coordinate|send_message|wait_agent", s):
        return "coordination"
    if re.search(
        r"pip install|npm install|pnpm install|apt-get|which |docker|health|timeout|rate.limit",
        s,
    ):
        return "infrastructure"
    if re.search(r"verif|certificate|pytest|unittest|check_", s):
        return "verification"
    if re.search(r"search|arxiv|paper|web_fetch|curl https|literature", s):
        return "literature"
    if re.search(r"python|compute|entropy|matrix|optimiz|numpy", s):
        return "computation"
    return "other"


runs = [
    (
        "ftqc-zips-2026-08-05-r1",
        root / "pursuits/ftqc-zips-2026-08-05-r1",
        "Corpus verification, August 5",
    ),
    (
        "fc-audit-smoke-a",
        root / "fc-audit-smoke-a/fc-audit-smoke-a",
        "Invalid original witness, August 13",
    ),
    (
        "q-q36-lw6-unbounded-ladder",
        root / "q-q36-lw6-unbounded-ladder/q-q36-lw6-unbounded-ladder",
        "Linden–Winter ladder certification, August 16",
    ),
    (
        "q-conj-entropy-bcww-repair",
        root / "q-conj-entropy-bcww-repair/q-conj-entropy-bcww-repair",
        "BCWW repair pursuit, August 30",
    ),
    (
        "q-ca-bcww-shareable-pkg",
        root / "bcww-correction",
        "Corrected witness finding, September 3",
    ),
]
for run_id, source, title in runs:
    nodes, events, sources = {}, [], []
    tool_publications = (
        validate_tool_review(source) if run_id == tool_review["runId"] else {}
    )
    seen_tool_publications = set()

    def source_record(path):
        b = path.read_bytes()
        rel = str(path.relative_to(source))
        h = digest(b)
        sources.append({"path": rel, "sha256": h, "bytes": len(b)})
        return h, b

    journal = source / "spawn-journal.jsonl"
    b = journal.read_bytes() if journal.exists() else b""
    h = source_record(journal)[0] if journal.exists() else None
    for line_no, line in enumerate(b.decode().splitlines(), 1):
        row = json.loads(line)
        e = row.get("event", row)
        kind = e.get("kind", "unknown")
        nid = e.get("id", run_id)
        if not e.get("at"):
            continue
        node = nodes.setdefault(
            nid,
            {
                "id": nid,
                "label": e.get(
                    "label", "director" if nid == run_id else nid.split(":")[-1]
                ),
                "parent": None,
                "kind": "runtime",
                "model": None,
                "modelSource": "unavailable",
                "servedModel": None,
            },
        )
        if kind == "spawned":
            node.update(
                label=e.get("label", node["label"]),
                parent=e.get("parent"),
                start=e["at"],
            )
        if kind == "materialized":
            node["model"] = safe_id(e.get("receipt", {}).get("model", {}).get("id"))
            node["modelSource"] = "materialization declaration"
        if kind == "settled":
            node.update(end=e["at"], status=e.get("status"))
        allowed = {
            k: safe_id(e[k])
            for k in ["status", "attemptId", "assignmentId", "key"]
            if k in e
        }
        if "identity" in e:
            allowed["identity"] = {
                k: v
                for k, v in e["identity"].items()
                if k in ["profileDigest", "taskDigest"]
                and isinstance(v, str)
                and re.fullmatch(r"sha256:[0-9a-f]{64}", v)
            }
        if kind == "execution-bound":
            allowed["attemptId"] = safe_id(e.get("binding", {}).get("attemptId"))
            allowed["bindingDigests"] = {
                k: v
                for k, v in e.get("binding", {}).items()
                if k.endswith("Digest")
                and isinstance(v, str)
                and re.fullmatch(r"sha256:[0-9a-f]{64}", v)
            }
        if kind == "materialized":
            rc = e.get("receipt", {})
            allowed["receipt"] = {
                k: v
                for k, v in rc.items()
                if k.endswith("Digest")
                and isinstance(v, str)
                and re.fullmatch(r"sha256:[0-9a-f]{64}", v)
            }
            allowed["receipt"].update(
                runtime=safe_id(rc.get("runtime")),
                backend=safe_id(rc.get("backend")),
                model={
                    "status": safe_id(rc.get("model", {}).get("status")),
                    "id": safe_id(rc.get("model", {}).get("id")),
                },
                execution={
                    "kind": safe_id(rc.get("execution", {}).get("kind")),
                    "id": safe_id(rc.get("execution", {}).get("id")),
                },
            )
        if kind == "settled":
            spent = e.get("spent", {})
            allowed["tokens"] = (
                spent.get("tokens") if spent.get("tokensKnown") is True else None
            )
            allowed["usd"] = spent.get("usd") if spent.get("usdKnown") is True else None
            reason = e.get("reason", "") or ""
            allowed["failureClass"] = (
                "rate limit"
                if re.search("rate|频率|速率", reason)
                else "timeout"
                if "timeout" in reason or "524" in reason
                else "budget"
                if "budget" in reason
                else "execution aborted"
                if "abort" in reason
                else None
            )
        events.append(
            {
                "id": f"j-{line_no}",
                "node": nid,
                "at": e["at"],
                "kind": kind,
                "category": "coordination"
                if kind == "spawned"
                else "infrastructure"
                if kind in ["trace-unpropagated", "execution-bound", "materialized"]
                or (kind == "settled" and e.get("status") == "down")
                else "other",
                "label": kind.replace("-", " "),
                "source": {
                    "path": str(journal.relative_to(source)),
                    "sha256": h,
                    "line": line_no,
                },
                "detail": allowed,
            }
        )
    applicable_joins = join_review["joins"] if run_id == join_review["runId"] else []
    for proof in applicable_joins:
        for key in [
            "nativeHeaderSource",
            "nativePromptSource",
            "runtimeAssignmentSource",
        ]:
            cited = proof[key]
            if digest((source / cited["path"]).read_bytes()) != cited["sha256"]:
                raise ValueError(
                    "Native join source changed; exact identity requires review"
                )
    if run_id == message_review["runId"]:
        for cited in message_review["sourceFiles"]:
            if digest((source / cited["path"]).read_bytes()) != cited["sha256"]:
                raise ValueError(
                    "Conversation source changed; publication review required"
                )
    native_files = list(source.glob("trace/pi-sessions/**/*.jsonl"))
    for path in sorted(native_files):
        h, b = source_record(path)
        rows = [
            (ln, json.loads(l))
            for ln, l in enumerate(b.decode().splitlines(), 1)
            if l.strip()
        ]
        session = next((r for _, r in rows if r.get("type") == "session"), {})
        sid = session.get("id", path.stem)
        nid = "native:" + sid
        nodes[nid] = {
            "id": nid,
            "label": "Pi " + sid[:8],
            "parent": None,
            "kind": "native",
            "model": None,
            "start": session.get("timestamp"),
            "nativeSessionId": sid,
            "runtimeJoin": "unresolved",
            "modelSource": "unavailable",
            "servedModel": None,
        }
        joined = next(
            (j for j in applicable_joins if j["nativeSessionId"] == sid), None
        )
        if joined:
            nodes[nid].update(
                runtimeNodeId=joined["runtimeNodeId"],
                runtimeJoin=joined["joinBasis"],
                joinProof=joined,
                label=joined["displayLabel"] + " · Pi",
            )
            nodes[joined["runtimeNodeId"]]["label"] = joined["displayLabel"]
        for ln, r in rows:
            kind = r.get("type", "unknown")
            at = r.get("timestamp")
            m = r.get("message", {})
            detail = {
                "recordType": kind,
                "nativeRecordId": r.get("id"),
                "nativeParentId": r.get("parentId"),
            }
            cat = "other"
            label = kind.replace("_", " ")
            if kind == "model_change":
                nodes[nid]["model"] = safe_id(r.get("modelId"))
                nodes[nid]["modelSource"] = "session configuration"
                detail.update(
                    configuredModel=safe_id(r.get("modelId")),
                    provider=safe_id(r.get("provider")),
                )
            if kind == "message":
                role = m.get("role", "unknown")
                content = m.get("content", [])
                content = (
                    content
                    if isinstance(content, list)
                    else [{"type": "text", "text": content}]
                )
                tools = [
                    x for x in content if x.get("type") in ["toolCall", "tool_use"]
                ]
                usage = m.get("usage")
                detail.update(
                    role=role,
                    toolNames=[x.get("name") for x in tools],
                    toolCallIds=[
                        safe_id(x.get("id")) for x in tools if safe_id(x.get("id"))
                    ],
                    contentSha256=digest(json.dumps(content, sort_keys=True).encode()),
                    contentCharacters=sum(
                        len(str(x.get("text", x.get("thinking", "")))) for x in content
                    ),
                )
                approved = (
                    reviewed_messages.get(detail["contentSha256"])
                    if run_id == message_review["runId"]
                    else None
                )
                if run_id == tool_review["runId"]:
                    if tools:
                        key = (str(path.relative_to(source)), ln, "input")
                        public_calls = tool_publications[key]
                        seen_tool_publications.add(key)
                        detail["publicToolCalls"] = [
                            {
                                k: call[k] for k in ["id", "name", "input", "publicationNote"]
                                if k in call
                            }
                            for call in public_calls
                        ]
                    if role == "toolResult":
                        key = (str(path.relative_to(source)), ln, "result")
                        approved = tool_publications[key]
                        seen_tool_publications.add(key)
                if approved:
                    detail["publicText"] = approved["text"]
                    detail["publicationNote"] = approved.get("note")
                    if "mode" in approved:
                        detail["publicationMode"] = approved["mode"]
                elif any(c.get("type") == "text" and c.get("text") for c in content):
                    detail["contentOmitted"] = (
                        "This message was outside the reviewed August 5 source set; its body has not been reviewed for publication."
                    )
                if usage:
                    detail["usage"] = {
                        k: usage[k]
                        for k in [
                            "input",
                            "output",
                            "cacheRead",
                            "cacheWrite",
                            "reasoning",
                            "totalTokens",
                        ]
                        if k in usage
                    }
                if m.get("model"):
                    detail["responseReportedModel"] = safe_id(m["model"])
                    detail["responseStatus"] = safe_id(m.get("stopReason"))
                    if m.get("stopReason") != "error" and content:
                        nodes[nid]["model"] = safe_id(m["model"])
                        nodes[nid]["servedModel"] = safe_id(m["model"])
                        nodes[nid]["modelSource"] = "successful response metadata"
                    elif m.get("stopReason") == "error":
                        label = "failed assistant request"
                if m.get("stopReason") == "error":
                    detail["usage"] = None
                detail["responseId"] = safe_id(m.get("responseId"))
                label = (
                    "failed assistant request"
                    if m.get("stopReason") == "error"
                    else role
                    + (
                        " · " + ", ".join(x.get("name", "tool") for x in tools)
                        if tools
                        else ""
                    )
                )
                if m.get("stopReason") == "error":
                    cat = "infrastructure"
                if tools:
                    cat = category(
                        tools[0].get("name", ""), tools[0].get("arguments", {})
                    )
                if role == "toolResult":
                    label = "tool result · " + m.get("toolName", "unknown")
                    detail["toolCallId"] = m.get("toolCallId")
                    detail["isError"] = m.get("isError")
                    cat = "infrastructure" if m.get("isError") else "other"
            if not at:
                continue
            nodes[nid]["end"] = at
            events.append(
                {
                    "id": sid[:8] + "-" + str(ln),
                    "node": nid,
                    "at": at,
                    "kind": kind,
                    "category": cat,
                    "label": label,
                    "source": {
                        "path": str(path.relative_to(source)),
                        "sha256": h,
                        "line": ln,
                    },
                    "detail": detail,
                }
            )
    if seen_tool_publications != set(tool_publications):
        raise ValueError("A reviewed tool record was not projected")
    # Persisted findings are agent-authored outputs, not hidden reasoning or verified claims.
    # Keep their authors unresolved when the source contains only run-level attribution.
    for path in sorted(source.glob("kb/pages/**/*.md")):
        if not any(
            k in path.name
            for k in [
                "entropy-cone-bcww",
                "every-k-theorem",
                "unbounded-verdict",
                "charter-s-cited-witness",
                "ghz4-mixture",
            ]
        ):
            continue
        h, b = source_record(path)
        if h not in reviewed_findings:
            raise ValueError(
                "Finding text requires review for exact source SHA-256: " + h
            )
        raw = b.decode()
        parts = raw.split("---", 2)
        if len(parts) != 3:
            continue
        fm, body = parts[1], parts[2].strip()

        def field(k):
            match = re.search(r"^" + k + r": (.*)$", fm, re.M)
            return match.group(1) if match else None

        at = field("createdAt")
        if not at:
            continue
        nid = "finding:" + run_id
        nodes.setdefault(
            nid,
            {
                "id": nid,
                "label": "Recorded findings",
                "parent": None,
                "kind": "finding",
                "model": None,
                "start": at,
            },
        )
        assessment = reviewed_findings[h]["assessment"]
        body_start = len(raw) - len(parts[2]) + len(parts[2]) - len(parts[2].lstrip())
        events.append(
            {
                "id": "finding-" + h[:12],
                "node": nid,
                "at": at,
                "kind": "finding-record",
                "category": "verification",
                "label": field("title") or path.stem,
                "source": {
                    "path": str(path.relative_to(source)),
                    "sha256": h,
                    "line": raw[:body_start].count("\n") + 1,
                },
                "detail": {
                    "recordedClaim": body,
                    "assessment": assessment,
                    "authorAttribution": "Run-level only; individual native session unresolved",
                },
            }
        )
    events.sort(key=lambda e: (e["at"], e["id"]))
    assignment = reviewed_assignments[run_id]
    if (
        assignment.get("source")
        and digest((source / assignment["source"]["path"]).read_bytes())
        != assignment["source"]["sha256"]
    ):
        raise ValueError("Assignment source changed; review the public summary")
    input_path = source / "run-input.json"
    if input_path.exists():
        source_record(input_path)
    result_path = source / "result.json"
    terminal = None
    if result_path.exists():
        _, rb = source_record(result_path)
        rv = json.loads(rb)
        reason = rv.get("reason")
        terminal = {
            "kind": rv.get("kind"),
            "reason": reason
            if isinstance(reason, str) and re.fullmatch(r"[a-z-]+", reason)
            else None,
        }
    record = {
        "schema": "research-publication.events.v1",
        "runId": run_id,
        "title": title,
        "assignment": assignment,
        "nodes": list(nodes.values()),
        "events": events,
        "sources": sources,
        "terminal": terminal,
        "coverage": {
            "runtimeNodes": sum(n["kind"] == "runtime" for n in nodes.values()),
            "nativeFiles": len(native_files),
            "nativeRuntimeJoins": len(applicable_joins),
            "completeOriginalCapture": False,
            "publicContent": (
                "All 400 tool inputs and 399 retained tool results in the six August 5 sessions have reviewed public bodies, alongside their ordinary messages. Long outputs use marked excerpts; credentials, unrelated memory previews, and hidden thinking are excluded. The final qLTC search has no retained result. Original source hashes, call IDs, and physical line numbers are preserved."
                if run_id == tool_review["runId"] else
                "Reviewed assignments and recorded findings are published where available. Native message bodies outside the August 5 review remain unpublished. Original source hashes and physical line numbers are retained."
            ),
            "categoryMethod": "Tool-name and command keyword rules; these are annotations, not measured research value or evidence of independence.",
            "cost": "Unavailable: zero-valued legacy counters are not treated as a bill.",
        },
    }
    (out / (run_id + ".json")).write_text(json.dumps(record, indent=2) + "\n")
    print(run_id, len(events), "events", len(native_files), "native files")
