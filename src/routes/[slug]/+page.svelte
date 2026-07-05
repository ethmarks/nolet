<script lang="ts">
    import type { Puzzle } from "$lib/puzzles";

    interface Props {
        data: {
            puzzle: Puzzle;
        };
    }

    let { data }: Props = $props();

    let puzzle = $derived(data.puzzle);

    import CodeBlock from "$lib/components/CodeBlock.svelte";
    import Editor from "$lib/components/Editor.svelte";
    import Output, { type OutputStatus } from "$lib/components/Output.svelte";

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
</script>

<main>
    <h2>{puzzle.name}</h2>

    <div class="description">
        {@html description}
    </div>

    <h3>Tests</h3>
    <Output
        {userCode}
        test={(code: string) => puzzle.test(code)}
        updateStatus={(s: OutputStatus) => (outputStatus = s)}
    />

    {#if inputString}
        <h3>Input</h3>
        <CodeBlock value={inputString} />
    {/if}

    <h3>Your Code</h3>
    <Editor {initialValue} onUpdate={(val: string) => (userCode = val)} />

    {#if solution}
        <details>
            <summary>Click to show solution</summary>
            <CodeBlock value={solution} />
        </details>
    {/if}
</main>

<style lang="scss">
    :global(:root) {
        --dc-width: 90ch;
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
