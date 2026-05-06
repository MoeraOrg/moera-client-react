# TypeScript

1. Always use double quotes for string literals. Except in the case when
   the string contains a double quote.
2. Always use double quotes for imports when importing a module from
   the project. Use single quotes when importing a third-party module.
3. Put third-party imports at the top of the file and local imports below. Put
   a blank line between them.

# I18n

1. Do not touch files under src/i18n/locales.
2. Do not write texts verbatim, just use `t()` function with an identifier.

# Actions

1. Literal names of actions should correspond to their function names and type
   names. For example, literal: "DO_SMTH", function: `doSmth()`,
   type: DoSmthAction.
2. Action functions are for creating action objects only. Do not add any
   additional logic to these functions.
