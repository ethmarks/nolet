import { QuickJSError, runSnippet } from "$lib/runSnippet";
import type { Puzzle, TestResult } from ".";

// each string must be composed of either "#" or " ", and the length of the
// strings must be uniform
type ConwayGrid = string[];

function validateConwayGrid(value: string[]): value is ConwayGrid {
	return value.every(
		(row) =>
			typeof row === "string" &&
			row.split("").every((cell) => cell === "#" || cell === " "),
	);
}

export class ConwayPuzzle implements Puzzle {
	public name: string = "Conway's Game of Life";

	private input: ConwayGrid = [
		"       ",
		" ### # ",
		" #     ",
		"    ## ",
		"  ## # ",
		" # # # ",
		"       ",
	];
	private steps = 20;
	private secretInput: ConwayGrid = [
		"       ",
		" ### # ",
		" #     ",
		"    ## ",
		"  ## # ",
		" # # # ",
		"       ",
	];
	private secretSteps = 5;

	public inputString: string = `
const input = [
	${this.input.map((row) => JSON.stringify(row)).join(",\n  ")}
];
const steps = ${this.steps};`;
	private secretInString = `
const input = ${JSON.stringify(this.secretInput)};
const steps = ${this.secretSteps};`;

	public initialCode: string = ``;

	public descriptionHTML: string = `
<p>A friend who you do <em>not</em> want to take hang gliding just overheard you discussing your upcoming hang gliding trip. Thinking quickly, you said that you were actually talking about <a href="https://en.wikipedia.org/wiki/Glider_(Conway%27s_Game_of_Life)">glider patterns</a> in your implementation of Conway's Game of Life. To avoid getting caught in your lie, you now have to quickly make a Game of Life implementation.</p>
<p>Good luck!</p>
`;

	public solution: string = ``;

	private getAnswer(grid: ConwayGrid): ConwayGrid {
		return grid;
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

		if (!Array.isArray(res)) {
			return {
				passed: false,
				msg: `Expected an \`Array\` but got type \`${typeof res}\` instead.`,
			};
		}

		if (!validateConwayGrid(res)) {
			return {
				passed: false,
				msg: `Expected a `,
			};
		}

		const answer = this.getAnswer(this.input);
		if (res !== answer) {
			return {
				passed: false,
				msg: `Expected "${answer}" but got "${res}" instead.`,
			};
		}

		const secretRes = runSnippet(userCode, this.secretInString);
		const secretAnswer = this.getAnswer(this.secretInput);
		if (secretRes !== secretAnswer) {
			return {
				passed: false,
				msg: "Failed secret anti-hardcoding check. You need to generalize your logic.",
			};
		}

		return {
			passed: true,
			msg: `Expected "${answer}" and got "${res}".`,
		};
	}
}
