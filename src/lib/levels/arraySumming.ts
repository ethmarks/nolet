import { runSnippet } from "$lib/runSnippet";
import type { Level, TestResult } from ".";

type InputType = number[];

export class ArraySummingLevel implements Level {
  public name: string = "Array Summing";

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

sum(input);
`;

  private getAnswer(inpt: InputType): number {
    return inpt.reduce((acc, num) => acc + num, 0);
  }

  public test(userCode: string): TestResult {
    const res = runSnippet(userCode, this.inputString);

    if (typeof res !== "number") {
      return {
        passed: false,
        msg: `Expected answer to have type "number", but it had type "${typeof res}" instead.`,
      };
    }

    const answer = this.getAnswer(this.input);
    if (res !== answer) {
      return {
        passed: false,
        msg: `Expected answer to be "${answer}", but it was "${res}" instead.`,
      };
    }

    return {
      passed: true,
      msg: "Test passed!",
    };
  }
}
