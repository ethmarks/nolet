import { QuickJSError, runSnippet } from "$lib/runSnippet";
import type { Puzzle, Difficulty, TestResult } from ".";

interface InputType {
	text: string;
	shift: number;
}

const alphabet = Array.from({ length: 26 }, (_, i) =>
	String.fromCharCode(97 + i),
);

export class CaesarPuzzle implements Puzzle {
	public name: string = "Caesar Cipher";
	public difficulty: Difficulty = "Medium";

	private input: InputType = {
		text: this.getAnswer({
			text: "ahoy, world!",
			shift: alphabet.length - 10,
		}),
		shift: 10,
	};
	private secretInput: InputType = {
		text: this.getAnswer({ text: "helloworld", shift: alphabet.length - 20 }),
		shift: 20,
	};

	public inputString: string = `
const input = "${this.input.text}";
const shift = ${this.input.shift};

// in case it helps
const alphabet = [${alphabet.map((letter) => `"${letter}"`).join(", ")}];
`;
	private secretInString = `
const input = "${this.secretInput.text}";
const shift = ${this.secretInput.shift};
const alphabet = [${alphabet.map((letter) => `"${letter}"`).join(", ")}];
`;

	public initialCode: string = `
function decrypt(text, shift) {
	let decrypted = "";

	for (const char of text) {
		const index = alphabet.indexOf(char);

		if (index === -1) {
			decrypted += char;
			continue;
		}

		decrypted += alphabet[(index + shift) % 26];
	}

	return decrypted;
}

return decrypt(input, shift);
`;

	public descriptionHTML: string = `
<p>You work at a cybersecurity firm. Your boss is named Caesar, and he's mandated that the only encryption algorithm used is the <a href="https://en.wikipedia.org/wiki/Caesar_cipher">Caesar cipher</a>.</p>
<p>AES? Never heard of it.</p>
<p>Good luck!</p>
`;

	public solution: string = `
function decrypt(text, shift) {
	return text
		.split("")
		.map((char) => {
			const index = alphabet.indexOf(char);
			if (index === -1) return char;
			return alphabet[(index + shift) % 26];
		})
		.join("");
}
`;

	private getAnswer(input: InputType): string {
		return input.text
			.split("")
			.map((char) => {
				const index = alphabet.findIndex((letter) => letter === char);

				if (index === -1) return char;

				return alphabet[(index + input.shift) % 26];
			})
			.join("");
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
