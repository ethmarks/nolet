<script lang="ts">
    import Editor from "$lib/components/Editor.svelte";

    import { LEVELS } from "$lib/levels";

    let levelNum: number = $state(0);

    let level = $derived(LEVELS[levelNum]);

    const stripNewlinePrefix = (str: string) =>
        str[0] === "\n" ? str.substring(1) : str;

    const initialValue = $derived(stripNewlinePrefix(level.initialCode));

    let userCode: string = $state("");
</script>

<Editor {initialValue} onUpdate={(val: string) => (userCode = val)} />
