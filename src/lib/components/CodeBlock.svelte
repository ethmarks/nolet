<script lang="ts">
    import type { PrismEditor } from "prism-code-editor";
    import { readonlyEditor } from "prism-code-editor/setups";
    import "prism-code-editor/prism/languages/javascript";

    import { onMount } from "svelte";

    interface Props {
        value: string;
    }

    let { value }: Props = $props();

    let editorElement: HTMLDivElement;
    let editor: PrismEditor;

    onMount(() => {
        editor = readonlyEditor(editorElement, {
            theme: "atom-one-dark",
            language: "js",
            value,
            readOnly: true,
        });
    });
</script>

<div bind:this={editorElement} class="editor-container"></div>
