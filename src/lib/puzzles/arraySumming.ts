import { QuickJSError, runSnippet } from "$lib/runSnippet";
import type { Puzzle, TestResult } from ".";

type InputType = number[];

export class ArraySummingPuzzle implements Puzzle {
  public name: string = "Array Summing";
  public slug = "sum";

  private input: InputType = [1, 2, 3, 4, 5];

  public inputString: string = `const input = ${JSON.stringify(this.input)};`;

  public initialCode: string = `
function sum(numbers) {
  let total = 0;
  for (const num of numbers) {
    total += num;
  }
  return total;
}

return sum(input);
`;

  public descriptionHTML: string = `<p></p>`;

  public solution: string = `
// This is the best solution I could think of. It's terse,
// simple, and performant. It's a bit boring though.
function reduceSum(numbers) {
  return numbers.reduce((acc, num) => acc + num, 0);
}

// This solution is worse than the .reduce() one in
// every way, except it's way more interesting.
function recursiveSum(numbers, index = 0) {
  const num = numbers[index];

  if (index === numbers.length - 1) return num;

  const total = recursiveSum(numbers, index + 1);
  return num + total;
}
`;

  private getAnswer(inpt: InputType): number {
    return inpt.reduce((acc, num) => acc + num, 0);
  }

  public test(userCode: string): TestResult {
    const res = runSnippet(userCode, this.inputString);

    if (typeof res === "undefined") {
      return {
        passed: false,
        msg: `Expected a value, but you didn't return anything. Remember to use \`return\` at the top level.`,
      };
    }

    if (res instanceof QuickJSError) {
      return {
        passed: false,
        msg: res.message,
      };
    }

    if (Array.isArray(res)) {
      return {
        passed: false,
        msg: `Expected a number but got an Array instead.`,
      };
    }

    if (typeof res !== "number") {
      return {
        passed: false,
        msg: `Expected a number but got type "${typeof res}" instead.`,
      };
    }

    const answer = this.getAnswer(this.input);
    if (res !== answer) {
      return {
        passed: false,
        msg: `Expected \`${answer}\` but got \`${res}\` instead.`,
      };
    }

    return {
      passed: true,
      msg: `Expected \`${answer}\` and got \`${res}\`.`,
    };
  }
}
