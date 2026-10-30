# TypeScript

1. Always use double quotes for string literals. Except in the case when
   the string contains a double quote.
2. Always use double quotes for imports when importing a module from
   the project. Use single quotes when importing a third-party module.
3. Put third-party imports at the top of the file and local imports below. Put
   a blank line between them.
4. Do not use `enum` or `namespace`. Represent string-valued enumerations as
   string literal union types, adding new values with `|`. For example:
   `type NodeSourceUriService = "telegram" | "rss" | "livejournal"`.

# React

1. Pass `ref` as a regular component prop. Do not use `forwardRef`; modern
   React supports `ref` as a prop.

# Actions

1. Literal names of actions should correspond to their function names and type
   names. For example, literal: "DO_SMTH", function: `doSmth()`,
   type: DoSmthAction.
2. Action functions are for creating action objects only. Do not add any
   additional logic to these functions.

# State

1. When adding or changing posting references in a state branch, update that branch's
   `src/state/<branch>/references.ts`. If needed, also update its collector's import and call in
   `getReferencedPostings` in `src/state/postings/cache.ts`.

## Documents

1. Keep all project documentation under `doc/`. Do not create documentation files in `docs/` or elsewhere.
2. Use directories like `doc/plans/` or `doc/specs/`. Do not use `doc/superpowers/`, because this is plugin-specific.
3. Format all documents with a maximum line length of 120 characters.
