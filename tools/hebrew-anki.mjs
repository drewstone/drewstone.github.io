import { createHash } from 'node:crypto'
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { DatabaseSync } from 'node:sqlite'
import { crc32 } from 'node:zlib'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const DECK_ID = 8123456700001
const MODEL_ID = 8123456700002
const SENTENCE_MODEL_ID = 8123456700003
const CLOZE_MODEL_ID = 8123456700004
const DECK_NAME = 'Hebrew (Drew)'
const SEP = '\x1f'

const FIELDS = [
  'Hebrew',
  'HebrewNiqqud',
  'Transliteration',
  'English',
  'Example',
  'ExampleNiqqud',
  'ExampleEnglish',
  'Notes',
  'DateLearned',
]

const CSS = `
.card { font-family: Arial, sans-serif; text-align: center; color: #111; background: #fff; }
.nightMode.card { color: #eee; background: #1b1b1b; }
.he { font-family: "Frank Ruhl Libre", "Noto Serif Hebrew", "David Libre", David, Arial, serif; direction: rtl; unicode-bidi: isolate; font-size: 42px; line-height: 1.5; }
.en { font-size: 22px; line-height: 1.35; margin-top: 0.6rem; }
.tr { font-family: ui-monospace, monospace; font-size: 16px; color: #555; margin-top: 0.35rem; }
.nightMode .tr { color: #aaa; }
.ex { font-size: 22px; line-height: 1.5; margin-top: 0.8rem; }
.notes { font-size: 14px; color: #666; margin-top: 0.8rem; }
`.trim()

const HE = '{{#HebrewNiqqud}}{{HebrewNiqqud}}{{/HebrewNiqqud}}{{^HebrewNiqqud}}{{Hebrew}}{{/HebrewNiqqud}}'
const EX = '{{#ExampleNiqqud}}{{ExampleNiqqud}}{{/ExampleNiqqud}}{{^ExampleNiqqud}}{{Example}}{{/ExampleNiqqud}}'
const EXTRA = `<div class="tr">{{Transliteration}}</div>
<div class="he ex">${EX}</div>
<div class="en ex">{{ExampleEnglish}}</div>
{{#Notes}}<div class="notes">{{Notes}}</div>{{/Notes}}`

function guidFor(word) {
  const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  const buf = createHash('sha256').update(`hebrew-guid:${word}`).digest()
  let n = 0n
  for (const byte of buf) n = (n << 8n) | BigInt(byte)
  let out = ''
  for (let i = 0; i < 10; i++) {
    out += alphabet[Number(n % 62n)]
    n /= 62n
  }
  return out
}

function stableId(key) {
  const buf = createHash('sha256').update(`hebrew-id:${key}`).digest()
  let n = 0n
  for (let i = 0; i < 6; i++) n = (n << 8n) | BigInt(buf[i])
  return Number(n)
}

function checksum(field) {
  return Number.parseInt(createHash('sha1').update(field).digest('hex').slice(0, 8), 16)
}

function html(value) {
  return String(value ?? '')
    .replaceAll('\x1f', '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('\n', '<br>')
}

const VERB_FORMS = ['נסעתי', 'נסענו', 'נוסעים', 'נוסע', 'אסע', 'ניסע', 'הייתה', 'היינו', 'הייתי', 'יהיה', 'תהיה', 'נהיה', 'היה', 'יש']

function clozeText(sentence, word) {
  const pointed = (sentence.heNiqqud || sentence.he).split(' ')
  const plain = sentence.he.split(' ')
  let target = plain.findIndex((part) => VERB_FORMS.includes(part))
  if (target < 0) target = plain.findIndex((part) => part === word || part.endsWith(word))
  if (target < 0) target = 0
  return pointed.map((part, i) => (i === target ? `{{c1::${part}}}` : part)).join(' ')
}

function loadEntries() {
  const raw = JSON.parse(readFileSync(join(root, 'src/data/hebrew.json'), 'utf8'))
  const entries = Array.isArray(raw) ? raw : raw.entries
  const verbs = Array.isArray(raw) ? [] : raw.verbs || []
  if (!Array.isArray(entries) || entries.length === 0) throw new Error('hebrew.json needs entries')
  return {
    verbs,
    entries: entries.map((entry, index) => {
    for (const key of ['word', 'translit', 'meaning', 'example', 'exampleEn', 'learned']) {
      if (typeof entry[key] !== 'string' || entry[key].trim() === '') {
        throw new Error(`hebrew.json[${index}].${key} is required`)
      }
    }
    return {
      word: entry.word,
      hebrewNiqqud: entry.hebrewNiqqud || '',
      translit: entry.translit,
      meaning: entry.meaning,
      example: entry.example,
      exampleNiqqud: entry.exampleNiqqud || '',
      exampleEn: entry.exampleEn,
      notes: entry.notes || '',
      learned: entry.learned,
      sentences: Array.isArray(entry.sentences) ? entry.sentences : [],
    }
    }),
  }
}

function model(mod) {
  const field = (name, rtl) => ({
    name,
    ord: FIELDS.indexOf(name),
    sticky: false,
    rtl,
    font: rtl ? 'Noto Serif Hebrew' : 'Arial',
    size: rtl ? 28 : 20,
    media: [],
  })
  const tmpl = (name, ord, qfmt, afmt) => ({
    name,
    ord,
    qfmt,
    afmt,
    bqfmt: '',
    bafmt: '',
    did: null,
    bfont: '',
    bsize: 0,
  })
  return {
    css: CSS,
    did: DECK_ID,
    flds: [
      field('Hebrew', true),
      field('HebrewNiqqud', true),
      field('Transliteration', false),
      field('English', false),
      field('Example', true),
      field('ExampleNiqqud', true),
      field('ExampleEnglish', false),
      field('Notes', false),
      field('DateLearned', false),
    ],
    id: MODEL_ID,
    latexPost: '\\end{document}',
    latexPre: '\\documentclass[12pt]{article}\\begin{document}',
    latexsvg: false,
    mod,
    name: DECK_NAME,
    req: [
      [0, 'any', [0, 1]],
      [1, 'any', [3]],
    ],
    sortf: 0,
    tags: [],
    tmpls: [
      tmpl('Hebrew to English', 0, `<div class="he">${HE}</div>`, `{{FrontSide}}\n<hr id="answer">\n<div class="en">{{English}}</div>\n${EXTRA}`),
      tmpl('English to Hebrew', 1, '<div class="en front">{{English}}</div>', `{{FrontSide}}\n<hr id="answer">\n<div class="he">${HE}</div>\n${EXTRA}`),
    ],
    type: 0,
    usn: -1,
    vers: [],
  }
}

function simpleModel(id, name, fields, templates, mod, type = 0) {
  return {
    css: CSS,
    did: DECK_ID,
    flds: fields.map((fieldName, ord) => ({
      name: fieldName,
      ord,
      sticky: false,
      rtl: fieldName.startsWith('Hebrew') || fieldName === 'Text',
      font: 'Noto Serif Hebrew',
      size: 24,
      media: [],
    })),
    id,
    latexPost: '\\end{document}',
    latexPre: '\\documentclass[12pt]{article}\\begin{document}',
    latexsvg: false,
    mod,
    name,
    req: type === 1 ? [[0, 'any', [0]]] : [[0, 'any', [0, 1]]],
    sortf: 0,
    tags: [],
    tmpls: templates,
    type,
    usn: -1,
    vers: [],
  }
}

function sentenceModel(mod) {
  const he = '{{#HebrewNiqqud}}{{HebrewNiqqud}}{{/HebrewNiqqud}}{{^HebrewNiqqud}}{{Hebrew}}{{/HebrewNiqqud}}'
  return simpleModel(
    SENTENCE_MODEL_ID,
    'Hebrew Sentence',
    ['Hebrew', 'HebrewNiqqud', 'Translit', 'English', 'Tense', 'Word'],
    [{
      name: 'Hebrew to English',
      ord: 0,
      qfmt: `<div class="tense">{{Tense}}</div><div class="he">${he}</div>`,
      afmt: '{{FrontSide}}\n<hr id="answer">\n<div class="en">{{English}}</div>\n<div class="tr">{{Translit}}</div>',
      bqfmt: '',
      bafmt: '',
      did: null,
      bfont: '',
      bsize: 0,
    }],
    mod,
  )
}

function clozeModel(mod) {
  return simpleModel(
    CLOZE_MODEL_ID,
    'Hebrew Cloze',
    ['Text', 'Extra'],
    [{
      name: 'Cloze',
      ord: 0,
      qfmt: '<div class="he">{{cloze:Text}}</div>',
      afmt: '<div class="he">{{cloze:Text}}</div><hr id="answer"><div class="en">{{Extra}}</div>',
      bqfmt: '',
      bafmt: '',
      did: null,
      bfont: '',
      bsize: 0,
    }],
    mod,
    1,
  )
}

function collectionConf(count) {
  return {
    activeDecks: [DECK_ID],
    addToCur: true,
    collapseTime: 1200,
    curDeck: DECK_ID,
    curModel: String(MODEL_ID),
    dueCounts: true,
    estTimes: true,
    newBury: true,
    newSpread: 0,
    nextPos: count + 1,
    sortBackwards: false,
    sortType: 'noteFld',
    timeLim: 0,
  }
}

function deck(id, name, mod) {
  return {
    id,
    name,
    collapsed: false,
    browserCollapsed: false,
    conf: 1,
    desc: id === DECK_ID ? 'https://drewstone.github.io/hebrew/' : '',
    dyn: 0,
    extendNew: 10,
    extendRev: 50,
    lrnToday: [0, 0],
    mod,
    newToday: [0, 0],
    revToday: [0, 0],
    timeToday: [0, 0],
    usn: -1,
  }
}

function dconf() {
  return {
    1: {
      autoplay: true,
      id: 1,
      lapse: { delays: [10], leechAction: 0, leechFails: 8, minInt: 1, mult: 0 },
      maxTaken: 60,
      mod: 0,
      name: 'Default',
      new: { bury: true, delays: [1, 10], initialFactor: 2500, ints: [1, 4, 7], order: 1, perDay: 20, separate: true },
      replayq: true,
      rev: { bury: true, ease4: 1.3, fuzz: 0.05, ivlFct: 1, maxIvl: 36500, minSpace: 1, perDay: 200 },
      timer: 0,
      usn: 0,
    },
  }
}

function buildDatabase(entries, verbs, mod) {
  const dir = join(tmpdir(), `hebrew-anki-${process.pid}`)
  mkdirSync(dir, { recursive: true })
  const dbPath = join(dir, 'collection.anki2')
  rmSync(dbPath, { force: true })
  const db = new DatabaseSync(dbPath)
  db.exec(`
    CREATE TABLE col (
      id integer primary key,
      crt integer not null,
      mod integer not null,
      scm integer not null,
      ver integer not null,
      dty integer not null,
      usn integer not null,
      ls integer not null,
      conf text not null,
      models text not null,
      decks text not null,
      dconf text not null,
      tags text not null
    );
    CREATE TABLE notes (
      id integer primary key,
      guid text not null,
      mid integer not null,
      mod integer not null,
      usn integer not null,
      tags text not null,
      flds text not null,
      sfld integer not null,
      csum integer not null,
      flags integer not null,
      data text not null
    );
    CREATE TABLE cards (
      id integer primary key,
      nid integer not null,
      did integer not null,
      ord integer not null,
      mod integer not null,
      usn integer not null,
      type integer not null,
      queue integer not null,
      due integer not null,
      ivl integer not null,
      factor integer not null,
      reps integer not null,
      lapses integer not null,
      left integer not null,
      odue integer not null,
      odid integer not null,
      flags integer not null,
      data text not null
    );
    CREATE TABLE revlog (
      id integer primary key,
      cid integer not null,
      usn integer not null,
      ease integer not null,
      ivl integer not null,
      lastIvl integer not null,
      factor integer not null,
      time integer not null,
      type integer not null
    );
    CREATE TABLE graves (
      usn integer not null,
      oid integer not null,
      type integer not null
    );
    CREATE INDEX ix_notes_usn on notes (usn);
    CREATE INDEX ix_cards_usn on cards (usn);
    CREATE INDEX ix_revlog_usn on revlog (usn);
    CREATE INDEX ix_cards_nid on cards (nid);
    CREATE INDEX ix_cards_sched on cards (did, queue, due);
    CREATE INDEX ix_revlog_cid on revlog (cid);
    CREATE INDEX ix_notes_csum on notes (csum);
  `)
  const models = {
    [String(MODEL_ID)]: model(mod),
    [String(SENTENCE_MODEL_ID)]: sentenceModel(mod),
    [String(CLOZE_MODEL_ID)]: clozeModel(mod),
  }
  const decks = {
    1: deck(1, 'Default', mod),
    [String(DECK_ID)]: deck(DECK_ID, DECK_NAME, mod),
  }
  db.prepare('INSERT INTO col VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)').run(
    1,
    mod,
    mod * 1000,
    mod * 1000,
    11,
    0,
    0,
    0,
    JSON.stringify(collectionConf(entries.length)),
    JSON.stringify(models),
    JSON.stringify(decks),
    JSON.stringify(dconf()),
    '{}',
  )
  const insertNote = db.prepare('INSERT INTO notes VALUES (?,?,?,?,?,?,?,?,?,?,?)')
  const insertCard = db.prepare('INSERT INTO cards VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)')
  const seen = new Set()
  const guids = []
  entries.forEach((entry, index) => {
    const guid = guidFor(entry.word)
    const nid = stableId(`note:${entry.word}`)
    if (seen.has(guid) || seen.has(nid)) throw new Error(`id collision for ${entry.word}`)
    seen.add(guid)
    seen.add(nid)
    const values = [
      entry.word,
      entry.hebrewNiqqud,
      entry.translit,
      entry.meaning,
      entry.example,
      entry.exampleNiqqud,
      entry.exampleEn,
      entry.notes,
      entry.learned,
    ].map(html)
    const flds = values.join(SEP)
    const tag = String(entry.learned).replaceAll(' ', '')
    insertNote.run(nid, guid, MODEL_ID, mod, -1, ` ${tag} `, flds, values[0], checksum(values[0]), 0, '')
    for (let ord = 0; ord < 2; ord++) {
      const cid = stableId(`card:${ord}:${entry.word}`)
      if (seen.has(cid)) throw new Error(`card id collision for ${entry.word}`)
      seen.add(cid)
      insertCard.run(cid, nid, DECK_ID, ord, mod, -1, 0, 0, index * 2 + ord + 1, 0, 0, 0, 0, 0, 0, 0, 0, '')
    }
    guids.push(guid)
  })
  const sentenceNotes = []
  for (const entry of entries) {
    for (const sentence of entry.sentences || []) {
      sentenceNotes.push({ ...sentence, word: entry.word, learned: entry.learned })
    }
  }
  for (const verb of verbs) {
    sentenceNotes.push({
      he: verb.infinitive,
      heNiqqud: verb.infinitiveNiqqud || verb.infinitive,
      translit: verb.translit,
      en: verb.meaning,
      tense: 'infinitive',
      word: verb.infinitive,
      learned: '',
    })
    for (const form of verb.forms || []) {
      sentenceNotes.push({
        he: form.he,
        heNiqqud: form.heNiqqud || form.he,
        translit: form.translit,
        en: form.en,
        tense: form.tense,
        word: verb.infinitive,
        learned: '',
      })
    }
  }
  let due = entries.length * 2
  for (const sentence of sentenceNotes) {
    const guid = guidFor(sentence.he)
    const nid = stableId(`sentence:${sentence.he}`)
    if (seen.has(guid) || seen.has(nid)) throw new Error(`sentence id collision for ${sentence.he}`)
    seen.add(guid)
    seen.add(nid)
    const values = [sentence.he, sentence.heNiqqud || '', sentence.translit || '', sentence.en, sentence.tense, sentence.word].map(html)
    const tag = sentence.learned ? ` ${sentence.learned} ${sentence.tense} ` : ` ${sentence.tense} `
    insertNote.run(nid, guid, SENTENCE_MODEL_ID, mod, -1, tag, values.join(SEP), values[0], checksum(values[0]), 0, '')
    const cid = stableId(`sentence-card:${sentence.he}`)
    seen.add(cid)
    insertCard.run(cid, nid, DECK_ID, 0, mod, -1, 0, 0, ++due, 0, 0, 0, 0, 0, 0, 0, 0, '')
    guids.push(guid)
    if (sentence.tense === 'infinitive') continue
    const clozeGuid = guidFor(`cloze:${sentence.he}`)
    const clozeId = stableId(`cloze:${sentence.he}`)
    if (seen.has(clozeGuid) || seen.has(clozeId)) throw new Error(`cloze id collision for ${sentence.he}`)
    seen.add(clozeGuid)
    seen.add(clozeId)
    const text = clozeText(sentence, sentence.word)
    const extra = html(`${sentence.en} (${sentence.tense})`)
    insertNote.run(clozeId, clozeGuid, CLOZE_MODEL_ID, mod, -1, tag, [text, extra].join(SEP), text, checksum(text), 0, '')
    const clozeCard = stableId(`cloze-card:${sentence.he}`)
    seen.add(clozeCard)
    insertCard.run(clozeCard, clozeId, DECK_ID, 0, mod, -1, 0, 0, ++due, 0, 0, 0, 0, 0, 0, 0, 0, '')
    guids.push(clozeGuid)
  }
  const count = db.prepare('SELECT count(*) AS n FROM notes').get().n
  const wordCount = db.prepare('SELECT count(*) AS n FROM notes WHERE mid = ?').get(MODEL_ID).n
  if (wordCount !== entries.length) throw new Error(`expected ${entries.length} word notes, wrote ${wordCount}`)
  db.close()
  const bytes = readFileSync(dbPath)
  rmSync(dir, { recursive: true, force: true })
  return { bytes, guids }
}

function zipStore(files) {
  const locals = []
  const centrals = []
  let offset = 0
  const now = new Date()
  const time = (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1)
  const date = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate()
  for (const file of files) {
    const name = Buffer.from(file.name)
    const data = file.data
    const crc = crc32(data) >>> 0
    const local = Buffer.alloc(30 + name.length)
    local.writeUInt32LE(0x04034b50, 0)
    local.writeUInt16LE(20, 4)
    local.writeUInt16LE(0, 6)
    local.writeUInt16LE(0, 8)
    local.writeUInt16LE(time, 10)
    local.writeUInt16LE(date, 12)
    local.writeUInt32LE(crc, 14)
    local.writeUInt32LE(data.length, 18)
    local.writeUInt32LE(data.length, 22)
    local.writeUInt16LE(name.length, 26)
    local.writeUInt16LE(0, 28)
    name.copy(local, 30)
    const central = Buffer.alloc(46 + name.length)
    central.writeUInt32LE(0x02014b50, 0)
    central.writeUInt16LE(20, 4)
    central.writeUInt16LE(20, 6)
    central.writeUInt16LE(0, 8)
    central.writeUInt16LE(0, 10)
    central.writeUInt16LE(time, 12)
    central.writeUInt16LE(date, 14)
    central.writeUInt32LE(crc, 16)
    central.writeUInt32LE(data.length, 20)
    central.writeUInt32LE(data.length, 24)
    central.writeUInt16LE(name.length, 28)
    central.writeUInt16LE(0, 30)
    central.writeUInt16LE(0, 32)
    central.writeUInt16LE(0, 34)
    central.writeUInt16LE(0, 36)
    central.writeUInt32LE(0, 38)
    central.writeUInt32LE(offset, 42)
    name.copy(central, 46)
    locals.push(local, data)
    centrals.push(central)
    offset += local.length + data.length
  }
  const centralBuf = Buffer.concat(centrals)
  const end = Buffer.alloc(22)
  end.writeUInt32LE(0x06054b50, 0)
  end.writeUInt16LE(files.length, 8)
  end.writeUInt16LE(files.length, 10)
  end.writeUInt32LE(centralBuf.length, 12)
  end.writeUInt32LE(offset, 16)
  return Buffer.concat([...locals, centralBuf, end])
}

function tsvCell(value) {
  return String(value ?? '').replaceAll('\t', ' ').replaceAll('\r', ' ').replaceAll('\n', ' ')
}

function buildTsv(entries) {
  const header = [
    '#separator:tab',
    '#html:true',
    '#notetype:Hebrew (Drew)',
    '#deck:Hebrew (Drew)',
    '#guid column:1',
    '#tags column:11',
    ['guid', ...FIELDS, 'Tags'].join('\t'),
  ]
  const rows = entries.map((entry) => [
    guidFor(entry.word),
    entry.word,
    entry.hebrewNiqqud,
    entry.translit,
    entry.meaning,
    entry.example,
    entry.exampleNiqqud,
    entry.exampleEn,
    entry.notes,
    entry.learned,
    entry.learned,
  ].map(tsvCell).join('\t'))
  return `${header.concat(rows).join('\n')}\n`
}

const catalog = loadEntries()
const entries = catalog.entries
const mod = Math.floor(Date.now() / 1000)
const { bytes, guids } = buildDatabase(entries, catalog.verbs, mod)
const apkg = zipStore([
  { name: 'collection.anki2', data: bytes },
  { name: 'media', data: Buffer.from('{}') },
])
const outDir = join(root, 'dist/hebrew')
mkdirSync(outDir, { recursive: true })
writeFileSync(join(outDir, 'hebrew.apkg'), apkg)
writeFileSync(join(outDir, 'hebrew.tsv'), buildTsv(entries))
const sentences = entries.reduce((sum, entry) => sum + (entry.sentences?.length || 0), 0)
console.log(`hebrew deck: ${entries.length} words, ${sentences} sentences, ${guids.length} notes -> dist/hebrew/hebrew.apkg`)
