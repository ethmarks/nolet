<script lang="ts">
    import { basicEditor } from "prism-code-editor/setups";
    import "prism-code-editor/prism/languages/javascript";
    import type { PrismEditor } from "prism-code-editor";

    import { onMount } from "svelte";

    interface Props {
        initialValue: string;
        onUpdate: (val: string) => void;
    }

    let { initialValue, onUpdate }: Props = $props();

    let editorElement: HTMLDivElement;
    let editor: PrismEditor;

    onMount(() => {
        editor = basicEditor(editorElement, {
            language: "js",
            theme: "atom-one-dark",
            onUpdate,
            value: initialValue,
        });
    });
</script>

<div bind:this={editorElement} class="editor-container"></div>
