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
// This is what the initial grid looks like visually:
${cellsToString(stringToCells(this.input))
	.split("\n")
	.map((l) => "// " + l)
	.join("\n")}

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
			for (const [dx, dy] of MOORE_NEIGHBORHOOD) {
				// string key to simplify things because using
				// pass-by-reference keys is tricky
				const key = (x + dx) + "," + (y + dy);

				neighborCounts[key] = (neighborCounts[key] ?? 0) + 1;
			}
		}

		const nextCells = [];

		for (const key in neighborCounts) {
			const count = neighborCounts[key];
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

function simulate(cells, steps) {
	// This step generates an array of every position that
	// neighbors a living cell.
	//
	// I can get away with only considering the neighbors,
	// because a cell can only ever be alive if it's a neighbor
	// of a live cell.
	//
	// And I can get away with not considering the current live
	// cells themselves, because if a live cell isn't the
	// neighbor of any cells, it'll die in the next generation
	// and I don't need to check its neighbor count.
	//
	// There can and should be duplicate entries. If a
	// position is the neighbor of two living cells, it'll
	// appear two times in the array. More about that in the
	// next step...
	const neighbors = cells.flatMap(({ x, y }) =>
		MOORE_NEIGHBORHOOD.map(([dx, dy]) =>
			(x + dx) + "," + (y + dy)
		))

	// This step converts the duplicate-having neighbor array
	// into a deduplicated Record<position, count>.
	//
	// This is the reason that in the previous step, I
	// converted the x and y positions into a string rather than
	// just doing [x+dx, y+dx] or something like that. In JS,
	// strings are passed by value, but arrays are passed by
	// reference, which means I can't really use them as keys.
	const neighborCounts = neighbors.reduce((acc, key) => (
		{ ...acc, [key]: (acc[key] ?? 0) + 1 }
	), {});

	// This step basically filters neighborCounts to only keep
	// the positions that should be alive in the next
	// generation, by applying the CGoL rules.
	//
	// I used the Object.entries().reduce() trick because I
	// couldn't use a for...in loop (because of the linter).
	const nextCells = Object.entries(neighborCounts).reduce(
		(acc, [key, count]) => {
			// This just undoes the key-constructing step that I did
			// in the first step.
			const [x, y] = key.split(",").map(Number);

			// This check is really really inefficient, and honestly
			// I should probably use a lookup table instead. But
			// performance doesn't really matter and I want to keep
			// it simple.
			const alive = cells.some((c) => c.x === x && c.y === y);

			// This is just a rephrasing of the CGoL rules.
			//
			// If count is 3, then the cell should live regardless
			// of whether it's currently alive.
			//
			// If the count is 2, the cell should only live if it's
			// currently alive.
			//
			// In all other scenarios, the cell should either die
			// or stay dead.
			if (count === 3 || (alive && count === 2)) {
				return [...acc, { x, y }];
			}

			// Returning the accumulator without adding the current
			// cell means that I'm either killing the cell or
			// making it stay dead.
			return acc;
		},
		[],
	);

	// This prevents the recursion from being infinite. (see
	// next comment).
	if (steps === 1) return nextCells;

	// This replaces the big all-encompassing for loop in the
	// starter code. Recursion is bad for performance and limits
	// how many steps we can simulate before getting a stack
	// overflow error, but these are just the kinds of things
	// you have to do in functional programming.
	return simulate(nextCells, steps - 1);
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
