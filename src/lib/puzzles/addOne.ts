import { QuickJSError, runSnippet } from "$lib/runSnippet";
import type { Puzzle, TestResult } from ".";

export class AddOnePuzzle implements Puzzle {
  public name: string = "Add One";

  public initialCode: string = `
// Edit me!

let x = 5;

x = x + 1;

return x;
`;

  public descriptionHTML: string = `
  <blockquote><strong>Welcome to No Let!</strong></blockquote>

  <h3>What is No Let?</h3>
  <p>No Let is a series of JavaScript coding puzzles where you have to use pure functional programming, which means that you aren't allowed to use <code>let</code> or anything else with mutable state.</p>
  <p>To complete each puzzle, your code will need to pass two tests:</p>
  <ul>
  <li>A linter that analyzes your code and checks if you're using mutable state. If you try to declare a variable using <code>let</code>, the linter will flag it and you will fail the test.</li>
  <li>A logic test that ensures that your code outputs the correct answer.</li>
  </ul>

  <h3>What is pure functional programming?</h3>
  <p><a href="https://en.wikipedia.org/wiki/Functional_programming">Pure functional programming</a> is a programming paradigm where you aren't allowed to use mutable state. This means that you can't reassign variables, which means that you can't increment counters, which means that it's impossible to use <code>for</code> loops. For the same reasons, you're unable to use <code>while</code> loops, and a few other things.</p>
  <p>These extremely restrictive self-imposed limitations force you to do things the functional programming way, which involves <a href="https://en.wikipedia.org/wiki/Lambda_calculus">lambda calculus</a>, <a href="https://en.wikipedia.org/wiki/Functional_programming#Recursion">recursive functions</a>, <a href="https://en.wikipedia.org/wiki/Currying">currying</a>, and more.</p>

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
