import { QuickJSError, runSnippet } from "$lib/runSnippet";
import type { Puzzle, TestResult } from ".";

/** Doesn't do anything, just makes my IDE do syntax highlighting */
const js = (strings: TemplateStringsArray): string => strings[0];

type Cell = { x: number; y: number };

function isCellArray(value: unknown): value is Cell[] {
	return (
		Array.isArray(value) &&
		(value as Cell[]).every(
			(p) =>
				typeof p === "object" &&
				p !== null &&
				typeof p.x === "number" &&
				typeof p.y === "number",
		)
	);
}

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

	// https://commons.wikimedia.org/wiki/File:Game_of_life_infinite2.svg
	private input = `
###.#
#....
...##
.##.#
#.#.#
`;
	private steps = 50;

	// I-heptomino
	private secretInput = `
..##
.##.
.#..
##..
`;
	private secretSteps = 20;

	public inputString: string = `
// The input is an array of coordinates for all of the
// living cells on the grid.
const input = ${JSON.stringify(stringToCells(this.input))};
/**
This is what the initial grid looks like visually:
${cellsToString(stringToCells(this.input))}
**/

const steps = ${this.steps};`;

	private secretInString = `
const input = ${JSON.stringify(stringToCells(this.secretInput))};
const steps = ${this.secretSteps};`;

	public initialCode: string = js`
const MOORE_NEIGHBORHOOD = [
	[-1, -1], [0, -1], [1, -1],
	[-1,  0],          [1,  0],
	[-1,  1], [0,  1], [1,  1],
];

function simulate(cells, steps) {
	for (let i = 0; i < steps; i++) {
		const neighborCounts = {};

		for (const { x, y } of cells) {
			for (const [offsetX, offsetY] of MOORE_NEIGHBORHOOD) {
				const nx = x + offsetX;
				const ny = y + offsetY;
				// to avoid the weirdness of passing by reference
				const key = nx + "," + ny;

				neighborCounts[key] = (neighborCounts[key] ?? 0) + 1;
			}
		}

		const nextCells = [];

		for (const [key, count] of Object.entries(neighborCounts)) {
			const [x, y] = key.split(",").map(Number);
			const alive = cells.some((c) => c.x === x && c.y === y);

			if (count === 3 || (alive && count === 2)) {
				nextCells.push({ x, y });
			}
		}

		cells = nextCells;
	}

	return cells;
}

return simulate(input, steps);
`;

	public descriptionHTML: string = `
<p>A friend who you do <em>not</em> want to take hang gliding just overheard you discussing your upcoming hang gliding trip. Thinking quickly, you said that you were actually talking about <a href="https://en.wikipedia.org/wiki/Glider_(Conway%27s_Game_of_Life)">glider patterns</a> in your implementation of Conway's Game of Life. To avoid getting caught in your lie, you now have to quickly make a Game of Life implementation.</p>
<p>Good luck!</p>
`;

	public solution: string = js`
const MOORE_NEIGHBORHOOD = [
	[-1, -1], [0, -1], [1, -1],
	[-1,  0],          [1,  0],
	[-1,  1], [0,  1], [1,  1],
];

function getNeighbors(cells, index = 0) {
	const { x, y } = cells[index];

	const thisNeighbors = MOORE_NEIGHBORHOOD.map(
		([offsetX, offsetY]) => {
			const nx = x + offsetX;
			const ny = y + offsetY;
			// to avoid the weirdness of passing by reference
			const key = nx + "," + ny;

			return key;
		},
	);

	if (index === cells.length - 1) return thisNeighbors;

	const otherNeighbors = getNeighbors(cells, index + 1);
	return [...thisNeighbors, ...otherNeighbors];
}

function simulate(cells, steps, iteration = 1) {
	const neighbors = getNeighbors(cells);

	const neighborCounts = neighbors.reduce((acc, key) => (
		{ ...acc, [key]: (acc[key] ?? 0) + 1 }
	), {});

	const nextCells = Object.entries(neighborCounts).reduce(
		(acc, [key, count]) => {
			const [x, y] = key.split(",").map(Number);
			const alive = cells.some((c) => c.x === x && c.y === y);

			if (count === 3 || (alive && count === 2)) {
				return [...acc, { x, y }];
			}

			return acc;
		},
		[],
	);

	if (iteration === steps) return nextCells;

	return simulate(nextCells, steps, iteration + 1);
}

return simulate(input, steps);
`;

	private getAnswer(cells: Cell[], steps: number): Cell[] {
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

		return cells;
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
				msg: `Expected an Array but got type \`${typeof res}\` instead.`,
			};
		}

		if (!isCellArray(res)) {
			return {
				passed: false,
				msg: `Your array is malformed. The expected data type is \`{ x: number; y: number }[]\``,
			};
		}

		const answer = this.getAnswer(stringToCells(this.input), this.steps);

		if (res.length !== answer.length) {
			return {
				passed: false,
				msg: `Expected ${answer.length} living cells, but got ${res.length}.`,
			};
		}

		if (cellsToString(res) !== cellsToString(answer)) {
			return {
				passed: false,
				msg: `You have the correct number of living cells, but they're in the wrong positions`,
			};
		}

		const secretRes = runSnippet(userCode, this.secretInString);
		const secretAnswer = this.getAnswer(
			stringToCells(this.secretInput),
			this.secretSteps,
		);
		if (
			!isCellArray(secretRes) ||
			cellsToString(secretRes) !== cellsToString(secretAnswer)
		) {
			return {
				passed: false,
				msg: "Failed secret anti-hardcoding check. You need to generalize your logic.",
			};
		}

		return {
			passed: true,
			msg: `All cells are correct!`,
		};
	}
}
