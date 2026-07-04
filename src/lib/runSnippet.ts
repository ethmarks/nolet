import { getQuickJS } from "quickjs-emscripten";

const QuickJS = await getQuickJS();

export function runSnippet(
  userCode: string,
  inputString: string,
  iife: boolean = true,
): unknown {
  const vm = QuickJS.newContext();

  const world = vm.newString("world");
  vm.setProp(vm.global, "NAME", world);
  world.dispose();

  const snippet = iife ? `(() => {\n${userCode}\n})();` : userCode;

  const code = `
${inputString}

${snippet}
`;

  const result = vm.evalCode(code);

  let output;

  if (result.error) {
    output = vm.dump(result.error);
    result.error.dispose();
  } else {
    output = vm.dump(result.value);
    result.value.dispose();
  }

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
