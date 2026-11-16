# Hebrew

Resume phrase, verbatim:

```
Hebrew: resume from github.com/drewstone/drewstone.github.io/blob/main/HEBREW_LEARNING.md
```

When Drew sends that sentence, read this file and `src/data/hebrew.json`, then continue the lesson. Do not ask him to restate the style, the word list, or how to record a word.

The page is https://drewstone.github.io/hebrew/. It renders the JSON at build time. Pushing `main` publishes it through the "Deploy to GitHub Pages" workflow.

## Teaching style

- Slow. One word at a time.
- Explain the new word in simple Hebrew first, using words already learned, then give the English.
- Correct gently.
- The real-world context is highway driving.
- Reuse previously learned words in new sentences.
- Review earlier words before adding a new one.

## Learned words

`src/data/hebrew.json` is the source of truth. It is a JSON array in learning order. Read that file for the words. Do not keep a second list in this document.

The page shows, for each object: the Hebrew word, transliteration, English meaning, Hebrew example, English translation, date learned, and notes when present.

## Schema

Append one object to the array. Field order:

```json
{
  "word": "כביש",
  "translit": "k'vish",
  "meaning": "highway",
  "example": "אנחנו על הכביש",
  "exampleEn": "we are on the highway",
  "learned": "2026-11-16",
  "notes": "Added example."
}
```

- `word`: Hebrew. Leave it unpointed unless the points are the lesson.
- `translit`: Latin transliteration used in the lesson.
- `meaning`: short English gloss.
- `example`: one Hebrew sentence in the highway-driving context. Reuse words already in the file.
- `exampleEn`: English of that sentence.
- `learned`: `YYYY-MM-DD`, the day the word was learned.
- `notes`: omit the field unless it is needed. When the example was written onto the card and was not produced in the lesson, set `notes` to `Added example.`

`word`, `translit`, `meaning`, `example`, `exampleEn`, and `learned` are required. The page build rejects a missing field, a bad date, or an empty note.

## Adding a word

1. Append one object to `src/data/hebrew.json` with the schema above.
2. Commit and push to `main`.

Shorthand Drew may use:

```
Hebrew: add <word> | <translit> | <meaning> | <example> | <example English>
```

The separator is space, pipe, space. Five fields, in that order, mapped to `word`, `translit`, `meaning`, `example`, `exampleEn`. Set `learned` to the session date. Leave `notes` off when Drew supplied the example. Fields must not contain the separator.

Example:

```
Hebrew: add כביש | k'vish | highway | אנחנו על הכביש | we are on the highway
```

## Session

Started 2026-11-16. The setting is highway driving: the car, the road, traffic, a jam. Every word learned so far is in `src/data/hebrew.json` with `learned` set to that date. `מכונית` and `גם` are marked `Added example.` because those sentences were written for the card.
