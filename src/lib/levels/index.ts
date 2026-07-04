export interface TestResult {
  passed: boolean;
  msg: string;
}

export interface Level {
  /**
   * The name of the level.
   *
   * @example "Array Summing"
   */
  name: string;

  /**
   * The string of JS to inject in the VM that provides the inputs for the
   * player to process.
   *
   * IMPORTANT: Remember to include `const input = ` and **end every statement
   * with a semicolon**.
   *
   * @example
   * ```js
   * const input = [1, 2, 3, 4, 5];
   * ```
   */
  inputString: string;

  /**
   * The string of JS to use as the initial value. It should pass the `test`
   * function, but it should fail FP linting in as many ways as possible.
   *
   * @example
   * ```js
   * return input.reduce((acc, num) => acc + num, 0);
   * ````
   */
  initialCode: string;

  /**
   * A function that inputs the user's code and runs it against a suite of
   * tests to ensure that it works. Make sure to generalize the input to ensure
   * that the user didn't just hardcode the answer.
   */
  test: (userCode: string) => TestResult;
}

export { ArraySummingLevel } from "./arraySumming";
