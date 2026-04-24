-- Reactions schema.
--
-- counts: aggregate per (slug, paragraph?, kind).
--   paragraph is nullable; NULL means whole-post reaction.
-- events: raw log for debugging / eval.

CREATE TABLE IF NOT EXISTS counts (
  slug      TEXT NOT NULL,
  paragraph TEXT,
  kind      TEXT NOT NULL,
  count     INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (slug, paragraph, kind)
);

CREATE TABLE IF NOT EXISTS events (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  slug       TEXT NOT NULL,
  paragraph  TEXT,
  kind       TEXT NOT NULL,
  ip_hash    TEXT,              -- SHA-256(ip + salt), daily salt rotation
  ts         INTEGER NOT NULL   -- unix seconds
);

CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug, ts);
CREATE INDEX IF NOT EXISTS idx_events_ip   ON events(ip_hash, slug, paragraph, kind);
