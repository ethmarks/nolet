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

  public descriptionHTML: string = `
<p>Now you'll have to do some actual logic.</p>
<p>You'll need to remove the <code>for</code> loop in the <code>sum</code> function in order to pass the linter tests. But if you remove the <code>for</code> loop, the function will break and the logic test will fail.</p>
<p>To pass both tests at the same time, you'll have to get clever. There are quite a few ways to go about this, but I recommend either using recursion or <code>.reduce()</code>.</p>
<p>Good luck!</p>
`;

  public solution: string = `
// This is the best solution I could think of. It's terse,
// simple, and performant. It's a bit boring though.
function sum(numbers) {
  return numbers.reduce((acc, num) => acc + num, 0);
}

// This solution is worse than the .reduce() one in
// almost every way, but it's more interesting.
function sum(numbers, index = 0) {
  const num = numbers[index];

  if (index === numbers.length - 1) return num;

  const total = sum(numbers, index + 1);
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
