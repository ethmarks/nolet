import { QuickJSError, runSnippet } from "$lib/runSnippet";
import type { Puzzle, TestResult } from ".";

type Cell = "alive" | "dead";
type Grid = Cell[][];

// prettier-ignore
const MOORE_NEIGHBORHOOD = [
	[-1, -1], [0, -1], [1, -1],
	[-1, 0],           [1, 0],
	[-1, 1],  [0, 1],  [1, 1],
];

function gridToString(input: Grid): string {
	return input
		.map((row) =>
			row.reduce<string>(
				(acc, cell) => (acc += (cell === "alive" ? "#" : ".") + " "),
				"",
			),
		)
		.join("\n");
}

function stringToGrid(input: string): Grid {
	return input
		.split("\n")
		.map((row: string) =>
			row
				.split("")
				.filter((char) => char === "#" || char === ".")
				.map((cell) => (cell === "#" ? "alive" : "dead")),
		)
		.filter((row) => row.length > 0);
}

export class ConwayPuzzle implements Puzzle {
	public name: string = "Conway's Game of Life";

	private input = `
.......
.###.#.
.#.....
....##.
..##.#.
.#.#.#.
.......
`;
	private steps = 20;
	private secretInput = `
.......
.###.#.
.#.....
....##.
..## #.
.#.#.#.
.......
`;
	private secretSteps = 5;

	public inputString: string = `
const input = \`\n${gridToString(stringToGrid(this.input))}\n\`;
const steps = ${this.steps};`;
	private secretInString = `
const input = \`${this.secretInput}\`;
const steps = ${this.secretSteps};`;

	public initialCode: string = ``;

	public descriptionHTML: string = `
<p>A friend who you do <em>not</em> want to take hang gliding just overheard you discussing your upcoming hang gliding trip. Thinking quickly, you said that you were actually talking about <a href="https://en.wikipedia.org/wiki/Glider_(Conway%27s_Game_of_Life)">glider patterns</a> in your implementation of Conway's Game of Life. To avoid getting caught in your lie, you now have to quickly make a Game of Life implementation.</p>
<p>Good luck!</p>
`;

	public solution: string = ``;

	private getAnswer(input: string, steps: number): string {
		let grid = stringToGrid(input);

		for (let i = 0; i < steps; i++) {
			const pastGrid = structuredClone(grid);

			pastGrid.forEach((row, cellY) => {
				row.forEach((cell, cellX) => {
					let liveNeighbors = 0;

					MOORE_NEIGHBORHOOD.forEach(([offsetX, offsetY]) => {
						const neighborRow = pastGrid[cellY + offsetY];
						if (neighborRow === undefined) return;

						const neighborCell = neighborRow[cellX + offsetX];

						if (neighborCell === "alive") liveNeighbors++;
					});

					if (cell === "dead") {
						if (liveNeighbors === 3) {
							grid[cellY][cellX] = "alive";
						}
					} else {
						if (liveNeighbors < 2 || liveNeighbors > 3) {
							grid[cellY][cellX] = "dead";
						}
					}
				});
			});
		}

		return gridToString(grid);
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

		if (typeof res !== "string") {
			return {
				passed: false,
				msg: `Expected a string but got type \`${typeof res}\` instead.`,
			};
		}

		const answer = this.getAnswer(this.input, this.steps);
		if (res !== answer) {
			return {
				passed: false,
				msg: `Expected "${answer}" but got "${res}" instead.`,
			};
		}

		const secretRes = runSnippet(userCode, this.secretInString);
		const secretAnswer = this.getAnswer(this.secretInput, this.secretSteps);
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
