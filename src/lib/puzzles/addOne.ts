import { QuickJSError, runSnippet } from "$lib/runSnippet";
import type { Puzzle, TestResult } from ".";

export class AddOnePuzzle implements Puzzle {
  public name: string = "Add One";
  public slug = "add1";

  public initialCode: string = `
// Edit me!

let x = 5;

x = x + 1;

return x;
`;

  public descriptionHTML: string = `
  <p>Because this puzzle is basically the tutorial, I'll walk you through how to edit the code to make the linter pass. </p>
  <p>In the editor below, edit the code like so:</p>
  <ul>
  <li><code>let x = 5;</code> -> <code>const x = 5;</code></li>
  <li><code>x = x + 1;</code> -> <code>const y = x + 1;</code></li>
  <li><code>return x;</code> -> <code>return y;</code></li>
  </ul>

  <p>You can also use your own solution if you want.</p>

  <p>After you've updated the code, press "Rerun Tests", check if your solution passes all the tests, and then move onto the next puzzle.</p>
  `;

  private getAnswer(): number {
    return 6;
  }

  public test(userCode: string): TestResult {
    const res = runSnippet(userCode, "");

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

    const answer = this.getAnswer();
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
