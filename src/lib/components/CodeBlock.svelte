<script lang="ts">
    import { createEditor } from "prism-code-editor";
    import type { PrismEditor } from "prism-code-editor";
    import "prism-code-editor/prism/languages/javascript";

    import "prism-code-editor/themes/atom-one-dark.css";
    import "prism-code-editor/layout.css";
    import "prism-code-editor/scrollbar.css";

    interface Props {
        value: string;
    }

    let { value }: Props = $props();

    let editorElement: HTMLDivElement;
    let editor: PrismEditor;

    $effect(() => {
        editorElement.innerHTML = "";
        editor?.remove();
        editor = createEditor(editorElement, {
            language: "js",
            value,
            readOnly: true,
        });
    });
</script>

<div bind:this={editorElement} class="editor-container">
    <p>Loading code...</p>
</div>
