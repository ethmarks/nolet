import * as acorn from "acorn";
import * as walk from "acorn-walk";

export interface Violation {
  name: string;
  message: string;
  lineNum: string;
}

class Viol implements Violation {
  constructor(
    public name: string,
    public message: string = "Unknown",
    public lineNum: string = "?",
  ) {}
}

/**
 * Lints a string of JS code for violations of functional programming.
 */
export function fpLint(userCode: string): Violation[] {
  let ast: acorn.Program;

  try {
    ast = acorn.parse(userCode, {
      ecmaVersion: 2022,
      sourceType: "script",
      locations: true,
    });
  } catch (err) {
    console.error(err instanceof Error ? err.message : "Unknown Syntax Error");
    return [new Viol("Syntax Error")];
  }

  let violations: Violation[] = [];

  // For terseness
  const v = (
    node: { loc?: acorn.SourceLocation | null },
    name: string,
    msg?: string,
  ) => {
    let loc: string | undefined;

    if (typeof node.loc !== "undefined" && node.loc !== null) {
      loc = node.loc.start.line.toString();
    }

    violations.push(new Viol(name, msg, loc));
  };

  walk.simple(ast, {
    // Variables
    VariableDeclaration(node) {
      if (node.kind === "let") {
        v(node, "No `let`", "Use `const` instead.");
      } else if (node.kind === "var") {
        v(node, "No `var`", "Use `const` instead.");
      }
    },

    // Loops
    ForStatement(node) {
      v(node, "No `for`", "Use recursion or Array methods instead.");
    },
    WhileStatement(node) {
      v(node, "No `while`", "Use recursion or Array methods instead.");
    },
    DoWhileStatement(node) {
      v(node, "No `do-while`", "Use recursion or Array methods instead.");
    },
    ForInStatement(node) {
      v(node, "No `for...in`", "Use recursion or Array methods instead.");
    },
    ForOfStatement(node) {
      v(node, "No `for...of`", "Use recursion or Array methods instead.");
    },

    // Mutations
    AssignmentExpression(node) {
      if (node.left.type === "Identifier") {
        v(node, "No variable reassignment", "Declare a new const instead.");
      } else if (node.left.type === "MemberExpression") {
        v(
          node,
          "No property mutation",
          "Declare a new object with the spread operator.",
        );
      } else {
        // Fallback
        v(node, "No mutation", "Use immutable methods");
      }
    },
    UpdateExpression(node) {
      v(
        node,
        "No mutating variables with assignment operators",
        "Declare a new variable instead.",
      );
    },

    // Array Mutators
    CallExpression(node) {
      if (node.callee.type !== "MemberExpression") return;

      const property = node.callee.property;
      const propName: string | undefined =
        property.type === "Identifier"
          ? property.name
          : property.type === "Literal" && typeof property.value === "string"
            ? property.value
            : undefined;

      if (!propName) return;

      if (propName === "push") {
        v(
          node,
          "No `.push()`",
          "Declare a new array with the spread operator.",
        );
      } else if (propName === "pop") {
        v(node, "No `.pop()`", "Use `.slice(0, -1)` instead.");
      } else if (propName === "shift") {
        v(node, "No `.shift()`", "Use destructuring instead.");
      } else if (propName === "unshift") {
        v(node, "No `.unshift()`", "Use the spread operator instead.");
      } else if (propName === "splice") {
        v(node, "No `.splice()`", "Use `.toSpliced()` instead.");
      } else if (propName === "sort") {
        v(node, "No `.sort()`", "Use `.toSorted()` instead.");
      } else if (propName === "reverse") {
        v(node, "No `.reverse()`", "Use `.toReversed()` instead.");
      }
    },
  });

  return violations;
}

function demo() {
  const snippet = `
let x = 10;
x = 6;
const obj = { score: 3 };
obj.score = 7;
while (false) {
  console.error("this will nevr run");
}
const differentlongarrayname = [1, 2, 3];
differentlongarrayname.push(4);
var y = 5;
  `;

  const viols = fpLint(snippet);

  console.log(
    viols.map((v) => `Line ${v.lineNum}: ${v.name}. ${v.message}`).join("\n"),
  );
}

// demo();
