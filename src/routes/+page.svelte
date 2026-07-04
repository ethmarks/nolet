<script lang="ts">
    import CodeBlock from "$lib/components/CodeBlock.svelte";
    import Editor from "$lib/components/Editor.svelte";
    import Output, { type OutputStatus } from "$lib/components/Output.svelte";

    import { LEVELS } from "$lib/levels";

    let levelNum: number = $state(0);

    let level = $derived(LEVELS[levelNum]);

    const stripNewlinePrefix = (str: string) =>
        str[0] === "\n" ? str.substring(1) : str;

    let initialValue = $derived(stripNewlinePrefix(level.initialCode));
    let inputString = $derived(level.inputString);

    let userCode: string = $state("");

    let outputStatus: OutputStatus = $state("not started");
</script>

<main>
    <h2>{level.name}</h2>
    <h3>Tests</h3>
    <Output
        {userCode}
        test={(code: string) => level.test(code)}
        updateStatus={(s: OutputStatus) => (outputStatus = s)}
    />
    <h3>Input</h3>
    <CodeBlock value={inputString} />
    <h3>Your Code</h3>
    <Editor {initialValue} onUpdate={(val: string) => (userCode = val)} />
</main>
