<script lang="ts">
    import type { PrismEditor } from "prism-code-editor";
    import { readonlyEditor } from "prism-code-editor/setups";
    import "prism-code-editor/prism/languages/javascript";

    interface Props {
        value: string;
    }

    let { value }: Props = $props();

    let editorElement: HTMLDivElement;
    let editor: PrismEditor;

    $effect(() => {
        editor?.remove();
        editor = readonlyEditor(editorElement, {
            theme: "atom-one-dark",
            language: "js",
            value,
            readOnly: true,
        });
    });
</script>

<div bind:this={editorElement} class="editor-container">
    <p>Loading code...</p>
</div>
