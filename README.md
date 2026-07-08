# No Let

[![Demo](https://img.shields.io/badge/demo-live-green)](https://ethmarks.github.io/nolet/)
[![GitHub](https://img.shields.io/badge/github-repo-blue?logo=github)](https://github.com/ethmarks/nolet)

No Let is a JavaScript puzzle site where you have to use pure functional programming, which means that you aren't allowed to use `let` or anything else with mutable state.

[![No Let homepage](./.github/nolet_screenshot.png)](https://ethmarks.github.io/nolet/)

## Quickstart

> Just visit <https://ethmarks.github.io/nolet/>.

## Features

- **Custom Linter**: Uses [Acorn](https://github.com/acornjs/acorn) to parse the user's code into an AST, then walks it to search for disallowed syntax like `let`. This lets the user know if their solution is valid or not.
- **Sandboxed JS Execution**: Uses [QuickJS](github.com/justjake/quickjs-emscripten) to execute the user's code in a WASM VM context and read the result.
- **5 Puzzles**: Has 5 puzzles, each with a data input, some starter code, robust logic tests, and suggested solutions.
- **High-performance Code Editor**: Uses [Prism code editor](https://prism-code-editor.netlify.app/) to provide code autocomplete and syntax highlighting.
- **Error Handling**: Has robust error handling to ensure that the page doesn't crash from infinite loops or unchecked recursion while providing helpful error messages. Also removes non-deterministic builtins from the QuickJS VM like `Math.random` to enforce determinism.
