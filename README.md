# No Let

[![Demo](https://img.shields.io/badge/demo-live-green)](https://ethmarks.github.io/nolet/)
[![GitHub](https://img.shields.io/badge/github-repo-blue?logo=github)](https://github.com/ethmarks/nolet)

No Let is a JavaScript puzzle site where you have to use pure functional programming, which means that you aren't allowed to use `let` or anything else with mutable state.

[![No Let homepage](./.github/nolet_screenshot.png)](https://ethmarks.github.io/nolet/)

## Quickstart

Just visit <https://ethmarks.github.io/nolet/>.

## Features

- **Custom Linter**: Uses [Acorn](https://github.com/acornjs/acorn) to parse the user's code into an AST and lint it for pure functional programming conformity. 21 unique error messages, each representing different violation types.
- **Sandboxed JS Execution**: Uses [QuickJS](https://github.com/justjake/quickjs-emscripten) to execute the user's code in a WASM VM context and read the result.
- **5 Puzzles**: Has 5 complete puzzles. Each puzzle has starter code, input data, robust logic tests, and suggested solutions.
- **High-performance Code Editor**: Uses [Prism code editor](https://prism-code-editor.netlify.app/) to provide code autocomplete and syntax highlighting with only 3.49kb (gzipped) of added bundle size.
- **Error Handling**: Has robust error handling to ensure that the page doesn't crash from infinite loops or unchecked recursion while providing helpful error messages. Also removes non-deterministic builtins from the QuickJS VM like `Math.random` to enforce determinism.
- **100% Client-Side**: All processing happens completely in the browser with zero server calls, for near-instant feedback.

## How it Works 

When the user presses "Run" after typing out their code in the editor, the following steps are executed in order:

1. The puzzle status is set to "Waiting".
2. The puzzle's logic tests are run. See [Logic Tests](#logic-tests) section for more information.
3. The linter is run. See [Linter](#linter) section for more information.
4. The results of the logic test and linter are processed into human-readable list items and displayed in the UI.

### Logic Tests

The logic tests ensure that the user's code returns the correct value and that its logic is correct. Each puzzle has different logic tests depending on what return value is expected.

I could have simply checked if the user's value is equal to the expected value with a single `===` operator, but I decided that I wanted more granular error messages. 

For example, if the user forgets to return a value, the tests will detect it and output this message...

> "Expected a value, but you didn't return anything. Remember to use `return` at the top level.

...rather than a generic message like this:

> Expected `6` but got `undefined` instead.

I think that the granular error messages are more helpful, especially to users that are new to JavaScript and might not immediately recognize the difference between, for example, `6` and `"6"`.

### Linter

After the user code is parsed into an AST with Acorn, the nodes are traversed with Acorn's `acorn-walk` module. If the node is of specific types, such as `ForStatement`, a `Viol` (aka violation) is created and appended to an array. After the entire AST is traversed, the violations are returned and later displayed in the UI.

However, the linter is not infallible, and there are plenty of ways to get around it. For example, while the linter will flag this snippet which mutates an array...

```js
arr.push(item);
```

...it will ignore this one which does the exact same thing.

```js
const p = "push";
arr[p](item);
```

Some of these exploits can be fixed with just a few more rules, but a lot of them would require a completely different approach to fix, and I doubt that I could *ever* fix 100% of them. I could theoretically switch the code language to a less "expressive" (i.e. exploitable) language than JavaScript, but that would come at the cost of making No Let much less accessible by using a less common language. I decided that it was preferable to just accept a good-enough linter. And besides, most of the linter bypasses require a fairly strong grasp of JavaScript, so any users that can pull them off could probably complete the puzzle the intended way anyway.

## Running Locally

```sh
git clone https://github.com/ethmarks/nolet.git
cd nolet
pnpm install
pnpm dev
```

## Acknowledgements

- Thanks to [Fabrice Bellard](https://github.com/bellard) for making [QuickJS](https://github.com/bellard/quickjs) and to [Jake Teton-Landis](https://github.com/justjake) for [porting it to WASM](https://github.com/justjake/quickjs-emscripten).
- Thanks to [Marijn Haverbeke](https://github.com/marijnh) for making [Acorn](https://github.com/acornjs/acorn).
- Thanks to [Jonas Pytte](https://github.com/jonpyt) for making [Prism code editor](https://github.com/jonpyt/prism-code-editor).
- Thanks to [Devin](https://tangled.org/devins.page) for making [dev.css](https://tangled.org/devins.page/dev.css).

## License

This project is under an MIT License. See [LICENSE](./LICENSE) for more information.
