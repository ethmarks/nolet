<script lang="ts">
    import { createEditor } from "prism-code-editor";
    import { editorCommands, defaultKeymap } from "prism-code-editor/commands";
    import "prism-code-editor/prism/languages/javascript";
    import type { PrismEditor } from "prism-code-editor";

    import "prism-code-editor/themes/atom-one-dark.css";
    import "prism-code-editor/layout.css";
    import "prism-code-editor/scrollbar.css";
    import "prism-code-editor/autocomplete.css";
    import "prism-code-editor/autocomplete-icons.css";

    interface Props {
        initialValue: string;
        onUpdate: (val: string) => void;
    }

    let { initialValue, onUpdate }: Props = $props();

    let editorElement: HTMLDivElement;
    let editor: PrismEditor;

    async function create(value: string) {
        // These imports throw errors when rendered in SSR, so we import them
        // lazily
        const {
            strictFilter,
            autoComplete,
            registerCompletions,
            completeFromList,
        } = await import("prism-code-editor/autocomplete");
        const { cursorPosition } = await import("prism-code-editor/cursor");
        const {
            completeKeywords,
            jsDocCompletion,
            jsSnipets,
            jsContext,
            jsCompletion,
        } = await import("prism-code-editor/autocomplete/javascript");
        const { searchWidget } = await import("prism-code-editor/search");

        registerCompletions(
            ["javascript", "js", "jsx", "tsx", "typescript", "ts"],
            {
                context: jsContext,
                sources: [
                    jsCompletion(window),
                    completeKeywords,
                    jsDocCompletion,
                    completeFromList(jsSnipets),
                ],
            },
        );

        editor?.remove();
        editor = createEditor(editorElement, {
            language: "js",
            onUpdate,
            value,
        });

        editor.addExtensions(
            editorCommands(defaultKeymap),
            cursorPosition(),
            searchWidget(),
            autoComplete({ filter: strictFilter }),
        );
    }

    $effect(() => {
        // $effect must be synchronous, but the lazy imports are necessarily asynchronous. So we move them into an async and fire-and-forget it.
        create(initialValue);
    });
</script>

<div bind:this={editorElement} class="editor-container"></div>
