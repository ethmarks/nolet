import { getQuickJS } from "quickjs-emscripten";

const QuickJS = await getQuickJS();

export class QuickJSError {
  constructor(public message: string) {}
}

export function runSnippet(
  userCode: string,
  inputString: string,
  iife: boolean = true,
): unknown {
  const vm = QuickJS.newContext();

  // Remove non-deterministic functions from the global object.
  vm.evalCode("delete Math.random;");
  vm.evalCode("delete Date;");
  vm.evalCode("delete performance;");

  const snippet = iife ? `(() => {\n${userCode}\n})();` : userCode;

  const code = `
${inputString}

${snippet}
`;

  const result = vm.evalCode(code);

  const output = (() => {
    if (result.error) {
      const error = vm.dump(result.error);
      result.error.dispose();

      console.error(error);

      if (typeof error.name === "string" && typeof error.message === "string") {
        const errName = error.name as string;
        const errMsg = error.message as string;

        if (
          (errName === "TypeError" && errMsg.includes("not a function")) ||
          (errName === "ReferenceError" && errMsg.includes("is not defined"))
        ) {
          // The user might have tried to use one of the built-in functions that
          // we removed.
          if (code.includes("Math.random")) {
            return new QuickJSError(
              "It looks like you tried to use `Math.random()`. `Math.random()` is unavailable because it produces non-deterministic outputs, which are disallowed in pure functional programming. Find another way to approach the problem.",
            );
          }
          if (code.includes("Date")) {
            return new QuickJSError(
              "It looks like you tried to use `Date`. `Date` is unavailable because it can produce non-deterministic outputs, which are disallowed in pure functional programming. Find another way to approach the problem.",
            );
          }
          if (code.includes("performance")) {
            return new QuickJSError(
              "It looks like you tried to use `performance`. `performance` is unavailable because it produces non-deterministic outputs, which are disallowed in pure functional programming. Find another way to approach the problem.",
            );
          }

          if (code.includes("console")) {
            return new QuickJSError(
              "It looks like you tried to use `console`. `console` is unavailable in QuickJS. Try doing an early return instead and reading the error output.",
            );
          }
        }

        return new QuickJSError(`${errName}: ${errMsg}`);
      }

      return new QuickJSError("Unknown error occured.");
    } else {
      const value = vm.dump(result.value);
      result.value.dispose();

      return value;
    }
  })();

  vm.dispose();

  return output;
}

function demo() {
  /**
   * Array.from({length: 100}).map((_) => Math.ceil(Math.random() * 100))
   */
  const inputString = `const input = [37,22,52,32,82,70,12,23,14,23,85,65,15,94,17,45,75,24,44,85,80,12,2,16,79,88,79,39,21,97,34,5,34,81,4,46,36,46,25,36,73,52,12,10,22,62,12,59,88,19,32,49,20,88,5,22,76,71,66,89,78,43,17,77,50,70,30,32,59,85,22,77,87,13,25,21,23,94,52,12,11,70,91,82,59,81,37,71,86,65,50,69,62,15,72,47,46,74,87,59];`;

  const userCode = `return input.sort((a, b) => a-b);`;

  const output = runSnippet(userCode, inputString);

  console.log(output);
}

// demo();
