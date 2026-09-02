import { QuickJSError, runSnippet } from "$lib/runSnippet";
import type { Puzzle, TestResult } from ".";

type Cell = { x: number; y: number };

// prettier-ignore
const MOORE_NEIGHBORHOOD = [
	[-1, -1], [0, -1], [1, -1],
	[-1, 0],           [1, 0],
	[-1, 1],  [0, 1],  [1, 1],
];

function cellsToString(cells: Cell[]): string {
	if (cells.length === 0) return "";

	// pad each dimension by 1 because the spacing looks nice
	const minY = Math.min(...cells.map(({ y }) => y)) - 1;
	const maxY = Math.max(...cells.map(({ y }) => y)) + 1;
	const minX = Math.min(...cells.map(({ x }) => x)) - 1;
	const maxX = Math.max(...cells.map(({ x }) => x)) + 1;

	const grid = Array.from({ length: maxY - minY + 1 }).map((_, y) =>
		Array.from({ length: maxX - minX + 1 }).map((_, x) =>
			cells.some((cell) => cell.x === x + minX && cell.y === y + minY),
		),
	);

	return grid
		.map((row) =>
			row.reduce<string>((acc, cell) => (acc += (cell ? "#" : ".") + " "), ""),
		)
		.join("\n");
}

function stringToCells(input: string): Cell[] {
	return input
		.split("\n")
		.filter((row) => row.trim() !== "")
		.flatMap((row, y) =>
			row
				.split("")
				.filter((char) => char === "#" || char === ".")
				.map((cell, x) => (cell === "#" ? { x, y } : undefined))
				.filter((cell) => cell !== undefined),
		);
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
..##.#.
.#.#.#.
.......
`;
	private secretSteps = 5;

	public inputString: string = `
const input = \`\n${cellsToString(stringToCells(this.input))}\n\`;
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
		let cells = stringToCells(input);

		for (let i = 0; i < steps; i++) {
			const neighborCounts = new Map<string, number>();

			cells.forEach(({ x, y }) => {
				MOORE_NEIGHBORHOOD.forEach(([offsetX, offsetY]) => {
					const nx = x + offsetX;
					const ny = y + offsetY;
					// to avoid the weirdness of passing by reference
					const key = `${nx},${ny}`;

					neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
				});
			});

			const nextCells: Cell[] = [];

			for (const [key, count] of neighborCounts) {
				const [x, y] = key.split(",").map(Number);
				const alive = cells.some((c) => c.x === x && c.y === y);

				if (count === 3 || (alive && count === 2)) {
					nextCells.push({ x, y });
				}
			}

			cells = nextCells;
		}

		return cellsToString(cells);
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
