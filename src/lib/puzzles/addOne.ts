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
  <h3>Instructions</h3>
  <p>Each puzzle gives you some code to start with. The starter code passes the logic test, but it fails the linting. Your job is to tweak the code to make it pass the linter without making it fail the logic test.</p>

  <p>In the editor below, edit the code like so:</p>
  <ul>
  <li><code>let x = 5;</code> -> <code>const x = 5;</code></li>
  <li><code>x = x + 1;</code> -> <code>const y = x + 1;</code></li>
  <li><code>return x;</code> -> <code>return y;</code></li>
  </ul>

  <p>Then press "Rerun Tests", ensure that your solution passes all the tests, and move onto the next puzzle.</p>
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
