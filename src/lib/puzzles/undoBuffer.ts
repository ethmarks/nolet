import { QuickJSError, runSnippet } from "$lib/runSnippet";
import type { Puzzle, TestResult } from ".";

// The quote is from "Do Not Go Gentle into That Good Night" by Dylan Thomas
function getBuffer(): string[] {
  const replaceChars = "yhaksjdhjasug";
  let replaceCharIndex = 0;

  function getReplaceChar(): string {
    const char = replaceChars[replaceCharIndex];
    replaceCharIndex++;
    return char;
  }

  return "Do# not g#o## gentle in#to tha#t g#ood #night#"
    .split("")
    .flatMap((c) => (c === "#" ? [getReplaceChar(), "backspace"] : c));
}

export class UndoBufferPuzzle implements Puzzle {
  public name: string = "Undo Buffer";

  private input: string[] = getBuffer();

  public inputString: string = `const input = ${JSON.stringify(this.input)};`;

  public initialCode: string = `
function parseBuffer(buffer) {
  let chars = [];
  for (const keystroke of buffer) {
    if (keystroke === "backspace") {
      chars.pop();
    } else {
      chars.push(keystroke);
    }
  }
  return chars.join("");
}

return parseBuffer(input);
`;

  public descriptionHTML: string = `
<p>Microsoft decided to do a ground-up rewrite of Word in JavaScript, and they need your help with the undo buffer.</p>
<p>Good luck!</p>
`;

  public solution: string = `
function parseBuffer(buffer) {
  return buffer.reduce((acc, char) => {
    if (char === "backspace") {
      return acc.slice(0, -1);
    }

    return acc + char;
  }, "");
}
`;

  private getAnswer(buffer: string[]): string {
    return buffer.reduce(
      (acc, char) => (char === "backspace" ? acc.slice(0, -1) : acc + char),
      "",
    );
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
        msg: `Expected a string but got an Array instead.`,
      };
    }

    if (typeof res !== "string") {
      return {
        passed: false,
        msg: `Expected a string but got type "${typeof res}" instead.`,
      };
    }

    const answer = this.getAnswer(this.input);
    if (res !== answer) {
      return {
        passed: false,
        msg: `Expected "${answer}" but got "${res}" instead.`,
      };
    }

    return {
      passed: true,
      msg: `Expected "${answer}" and got "${res}".`,
    };
  }
}
