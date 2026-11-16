# Hebrew

Resume phrase, verbatim:

```
Hebrew: resume from github.com/drewstone/drewstone.github.io/blob/main/HEBREW_LEARNING.md
```

When Drew sends that sentence, read this file and `src/data/hebrew.json`, then continue the lesson. Do not ask him to restate the style, the word list, or how to record a word.

The page is https://drewstone.github.io/hebrew/. It renders the JSON at build time. Pushing `main` publishes it through the "Deploy to GitHub Pages" workflow.

## Page modes

The page opens in Drive. The choice is saved in the browser (`hebrew-mode`).

- Drive: dark full screen and large type, for a glance from the driver's seat. A Light/Dark control swaps the background (`hebrew-drive-theme`). The header fades after a few seconds and comes back on tap. It advances on its own, about 4.5 seconds each: Hebrew word and transliteration, then the Hebrew sentence, then the English meaning and sentence. Tap the middle to pause. Previous and next sit on the sides. Order prefers words that are due, then words least recently seen. A Nikud control (`hebrew-nikud`, default on) shows or hides vowels in Drive, Review, and List.
- Review: a flashcard. The front is the Hebrew word, or the English gloss if the direction is flipped. Tap or space reveals the transliteration, meaning, and example. Again, Hard, Good, and Easy are keys 1, 2, 3, and 4. Ratings use a short SM-2 schedule in the browser (`hebrew-srs`, keyed by the Hebrew word). Again is due again in 10 minutes and resets the streak. Hard is due in 1 day the first time, then the interval grows by 1.2, and ease falls. Good is due in 1 day, then 6 days, then the interval times ease. Easy is due in 4 days the first time, then the interval times ease times 1.3, and ease rises. Ease starts at 2.5 and stays at or above 1.3. The page shows how many cards are due today. If none are due, it offers "study anyway".
- List: every word in one grid. Hebrew is large, transliteration and meaning are small, and the sentence opens on hover or tap. The resume line sits at the bottom of this mode, with a link to the Anki deck.

Review ratings and which words Drive has already shown stay in the browser. They are not fields in `src/data/hebrew.json`.

## Teaching style

- Slow. One word at a time.
- Explain the new word in simple Hebrew first, using words already learned, then give the English.
- Then use the word in the present, the past, and the future.
- Correct gently.
- The real-world context is highway driving. The learner is male: masculine singular for "I", and "we".
- Reuse previously learned words in new sentences.
- Review earlier words before adding a new one.
- Building blocks: לִנְסֹעַ (נָסַעְתִּי / נָסַעְנוּ, אֲנִי נוֹסֵעַ / אֲנַחְנוּ נוֹסְעִים, אֶסַּע / נִסַּע) and existence (הָיָה / יֵשׁ / יִהְיֶה; feminine הָיְתָה / יֵשׁ / תִּהְיֶה).

## Learned words

`src/data/hebrew.json` is the source of truth. `entries` is the word list in learning order. `verbs` holds conjugations, starting with לִנְסֹעַ and לִהְיוֹת. An older file that is only an array of words is still valid. Do not keep a second list in this document.

Drive and Review read those fields from the file. List shows the word, transliteration, meaning, and sentence.

## Schema

Append one object to the array. Field order:

```json
{
  "word": "כביש",
  "hebrewNiqqud": "כְּבִישׁ",
  "translit": "k'vish",
  "meaning": "highway",
  "example": "אנחנו על הכביש",
  "exampleNiqqud": "אֲנַחְנוּ עַל הַכְּבִישׁ",
  "exampleEn": "we are on the highway",
  "learned": "2026-11-16",
  "notes": "Added example."
}
```

- `word`: Hebrew, unpointed.
- `hebrewNiqqud`: optional pointed spelling. Supply it for every new word. פקק is פְּקָק.
- `translit`: Latin transliteration used in the lesson.
- `meaning`: short English gloss.
- `example`: one Hebrew sentence in the highway-driving context, unpointed. Reuse words already in the file.
- `exampleNiqqud`: optional pointed form of that sentence. Supply it for every new word.
- `exampleEn`: English of that sentence.
- `learned`: `YYYY-MM-DD`, the day the word was learned.
- `notes`: omit the field unless it is needed. When the example was written onto the card and was not produced in the lesson, set `notes` to `Added example.`
- `grammar`: optional short note, such as `Feminine noun, ends in ה.`
- `forms`: optional `{ "gender": "m"|"f", "plural": "...", "pluralNiqqud": "..." }` when the word has a plural.
- `sentences`: optional array. For a new word, write at least one past, one present, and one future sentence. Each object is `{ "tense", "he", "heNiqqud", "translit", "en", "source" }`. `source` is `assistant-added` when the assistant wrote the sentence. Reuse words already in the file. פקק is פְּקָק. The future of לִנְסֹעַ for "I" is אֶסַּע.

`word`, `translit`, `meaning`, `example`, `exampleEn`, and `learned` are required. The page build rejects a missing field, a bad date, or an empty note.

## Adding a word

1. Append one object to `src/data/hebrew.json` with the schema above.
2. Commit and push to `main`. The deploy rebuilds the Anki deck. Import `hebrew.apkg` again in Anki. The same GUID updates the existing note.

## Anki deck

`pnpm build` writes the deck from `src/data/hebrew.json` after the site build.

- Package: https://drewstone.github.io/hebrew/hebrew.apkg
- TSV fallback: https://drewstone.github.io/hebrew/hebrew.tsv
- Deck name: `Hebrew (Drew)`
- Deck id: `8123456700001`
- Model id: `8123456700002`

The word-note GUID is a deterministic hash of the unpointed `word`. Sentence notes use note type `Hebrew Sentence` (fields Hebrew, HebrewNiqqud, Translit, English, Tense, Word) and a GUID hashed from the unpointed sentence. Cloze notes are separate, hashed from `cloze:` plus that sentence, so they do not collide. Re-importing the package updates those notes instead of adding duplicates. A word note has two cards, Hebrew to English and English to Hebrew. Vowels are shown. The note is tagged with its `learned` date. Word fields: Hebrew, HebrewNiqqud, Transliteration, English, Example, ExampleNiqqud, ExampleEnglish, Notes, DateLearned.

Shorthand Drew may use:

```
Hebrew: add <word> | <translit> | <meaning> | <example> | <example English> | <hebrewNiqqud> | <exampleNiqqud>
```

The separator is space, pipe, space. The first five fields map to `word`, `translit`, `meaning`, `example`, `exampleEn`. The last two are optional in the shorthand and map to `hebrewNiqqud` and `exampleNiqqud`. If Drew omits them, still write correct niqqud into those fields. Set `learned` to the session date. Leave `notes` off when Drew supplied the example. Fields must not contain the separator.

Example:

```
Hebrew: add כביש | k'vish | highway | אנחנו על הכביש | we are on the highway | כְּבִישׁ | אֲנַחְנוּ עַל הַכְּבִישׁ
```

## Session

Started 2026-11-16. The setting is highway driving: the car, the road, traffic, a jam. Every word learned so far is in `src/data/hebrew.json` with `learned` set to that date. `מכונית` and `גם` are marked `Added example.` because those sentences were written for the card.
