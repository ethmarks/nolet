<script lang="ts">
    import favicon from "$lib/assets/favicon.svg";
    import { PUZZLES } from "$lib/puzzles";
    import "@intergrav/dev.css";

    let { children } = $props();
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
</svelte:head>

<header>
    <h1>No Let</h1>
    <p>
        Can you write JavaScript code without using <code>let</code>?
    </p>
    <nav>
        <ul>
            <li><a href="/">Home</a></li>
            <li><a href="https://github.com/ethmarks/nolet">Source</a></li>
        </ul>
    </nav>
</header>

<aside>
    <details open>
        <summary>Puzzles</summary>
        <ol>
            {#each PUZZLES as puzzle}
                <li><a href="/{puzzle.slug}">{puzzle.name}</a></li>
            {/each}
        </ol>
    </details>
</aside>

{@render children()}

<style lang="scss">
    :global(.editor-container) {
        margin-block: 1rem;
        border-radius: 0.5rem;
        overflow: hidden;
    }

    nav li:not(:first-child)::before {
        content: "•";
        margin: 0 0.25em;
    }
</style>
