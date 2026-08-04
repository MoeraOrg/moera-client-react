---
name: i18n
description: Maintain localized interface text and translation keys consistently across every supported language. Use when adding, changing, or removing user-facing text, calls to t(), translation identifiers, or entries under src/i18n/locales.
---

# I18n

Follow these rules for every localization change:

1. Do not write user-facing text verbatim. Use the `t()` function with a translation identifier.
2. For every new translation key, create translations for all languages under `src/i18n/locales`.
3. When a translation key becomes unused, remove it from every translation file.
4. Maintain the alphabetical order of keys and preserve the existing hierarchical structure.
5. When touching one translation, check all other language versions of the key and make them consistent.
6. After changing translations, run `npm run push-translations`.
