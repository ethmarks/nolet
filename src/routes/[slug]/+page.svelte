<script lang="ts">
    import { PUZZLES, slugify, type Puzzle } from "$lib/puzzles";
    import Editor from "$lib/components/Editor.svelte";
    import Output, { type OutputStatus } from "$lib/components/Output.svelte";
    import PageNav from "$lib/components/PageNav.svelte";
    import { afterNavigate } from "$app/navigation";
    import striptags from "striptags";

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
                  slug: slugify(PUZZLES[puzzleIndex - 1].name),
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
</script>

<svelte:head>
    <title>{puzzle.name} | No Let</title>
    <meta name="description" content={striptags(description)} />
</svelte:head>

<main>
    <h2>{puzzle.name}</h2>

    <div class="description">
        {@html description}
    </div>

    <hr />

    <Output
        {userCode}
        test={(code: string) => puzzle.test(code)}
        updateStatus={(s: OutputStatus) => (outputStatus = s)}
        registerRunLogic={(func: () => void) => (runLogic = func)}
        registerRunLint={(func: () => void) => (runLint = func)}
    />

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

    <button
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
</style>
