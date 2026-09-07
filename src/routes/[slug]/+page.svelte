<script lang="ts">
	import { PUZZLES, slugify, type Puzzle } from "$lib/puzzles";
	import Editor from "$lib/components/Editor.svelte";
	import Output, { type OutputStatus } from "$lib/components/Output.svelte";
	import PageNav from "$lib/components/PageNav.svelte";
	import { afterNavigate } from "$app/navigation";
	import striptags from "striptags";
	import confetti from "canvas-confetti";

	interface Props {
		data: {
			puzzle: Puzzle;
		};
	}

	let { data }: Props = $props();

	const AUTO_RUN_LINT = false;

	let puzzle = $derived(data.puzzle);
	let puzzleIndex = $derived(PUZZLES.indexOf(puzzle));

	const stripNewlinePrefix = <T extends string | undefined>(str: T): T => {
		if (typeof str === "undefined") return undefined as T;

		return (str[0] === "\n" ? str.substring(1) : str) as T;
	};

	let initialValue = $derived(stripNewlinePrefix(puzzle.initialCode));
	let inputString = $derived(stripNewlinePrefix(puzzle.inputString));
	let description = $derived(puzzle.descriptionHTML);
	let solution = $derived(stripNewlinePrefix(puzzle.solution));

	// svelte-ignore state_referenced_locally
	let userCode: string = $state(initialValue);

	let outputStatus: OutputStatus = $state("not started");

	let runLogic: (() => void) | undefined = $state(undefined);
	let runLint: (() => void) | undefined = $state(undefined);

	let solutionOpen: boolean = $state(false);

	let previous = $derived(
		puzzleIndex === 0
			? {
					name: "Welcome",
					slug: "/",
				}
			: {
					name: PUZZLES[puzzleIndex - 1].name,
					slug: "/" + slugify(PUZZLES[puzzleIndex - 1].name),
				},
	);
	let next = $derived(
		puzzleIndex === PUZZLES.length - 1
			? {
					name: "Congrats!",
					slug: "/congrats",
				}
			: {
					name: PUZZLES[puzzleIndex + 1].name,
					slug: "/" + slugify(PUZZLES[puzzleIndex + 1].name),
				},
	);

	afterNavigate(() => {
		solutionOpen = false;
		userCode = initialValue;
		runLogic?.();
		runLint?.();
	});

	$effect(() => {
		if (outputStatus === "passed") {
			confetti({
				particleCount: 150,
				startVelocity: 55,
				spread: 50,
				origin: { y: 1 },
			});
		}
	});
</script>

<svelte:head>
	<title>{puzzle.name} | No Let</title>
	<meta name="description" content={striptags(description)} />
</svelte:head>

<main>
	<h2>
		{puzzle.name} -
		<span
			class="difficulty"
			data-difficulty={puzzle.difficulty.toLowerCase()}
			>{puzzle.difficulty}</span
		>
	</h2>

	<div class="description">
		{@html description}
	</div>

	<hr />

	{#if inputString}
		<Editor initialValue={inputString} readOnly={true} />
	{/if}

	<Editor
		{initialValue}
		onUpdate={(val: string) => {
			userCode = val;
			if (AUTO_RUN_LINT) {
				setTimeout(() => runLint?.(), 300);
			}
		}}
		readOnly={false}
	/>

	<Output
		{userCode}
		test={(code: string) => puzzle.test(code)}
		updateStatus={(s: OutputStatus) => (outputStatus = s)}
		registerRunLogic={(func: () => void) => (runLogic = func)}
		registerRunLint={(func: () => void) => (runLint = func)}
	/>

	<button
		class={outputStatus === "passed" ? "pass" : ""}
		onclick={() => {
			runLogic?.();
			runLint?.();
		}}>Run</button
	>

	{#if solution}
		<details bind:open={solutionOpen}>
			<summary>Click to show solution</summary>
			<Editor initialValue={solution} readOnly={true} />
		</details>
	{/if}

	<PageNav {previous} {next} />
</main>

<style lang="scss">
	:global(:root) {
		--dc-width: 90ch;
	}

	button {
		width: 100%;
		transition: background 0.3s cubic-bezier(0.4, 0, 0.2, 1);

		&.pass {
			&,
			&:focus,
			&:enabled:hover {
				background: #19b57b !important;
			}
		}
	}

	details {
		padding: 0 1rem;

		summary {
			margin-block: 0.7rem;
		}

		&[open] :global(:last-child) {
			margin-bottom: 0.7rem;
		}
	}

	.difficulty {
		// Colors sourced from https://masters-dco.fandom.com/wiki/Colors
		// which was one of the first search results for "easy medium hard
		// color", because I'm lazy.

		&[data-difficulty="easy"] {
			color: #49a35e;
		}
		&[data-difficulty="medium"] {
			color: #fcb272;
		}
		&[data-difficulty="hard"] {
			color: #b04f4f;
		}
	}
</style>
