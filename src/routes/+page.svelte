<script lang="ts">
    import CodeBlock from "$lib/components/CodeBlock.svelte";
    import Editor from "$lib/components/Editor.svelte";

    import { LEVELS } from "$lib/levels";

    let levelNum: number = $state(0);

    let level = $derived(LEVELS[levelNum]);

    const stripNewlinePrefix = (str: string) =>
        str[0] === "\n" ? str.substring(1) : str;

    const initialValue = $derived(stripNewlinePrefix(level.initialCode));

    let userCode: string = $state("");
</script>

<main>
    <h2>{level.name}</h2>
    <h3>Input</h3>
    <CodeBlock value={level.inputString} />
    <h3>Your Code</h3>
    <Editor {initialValue} onUpdate={(val: string) => (userCode = val)} />
</main>
