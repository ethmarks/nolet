<script lang="ts">
    import favicon from "$lib/assets/favicon.svg";
    import "@intergrav/dev.css";

    let { children } = $props();
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
</svelte:head>

<header>
    <h1>No Let</h1>
    <nav>
        <a href="https://ethmarks.github.io/nolet/"
            ><img
                src="https://img.shields.io/badge/demo-live-green"
                alt="Demo"
            /></a
        >
        <a href="https://github.com/ethmarks/nolet"
            ><img
                src="https://img.shields.io/badge/github-repo-blue?logo=github"
                alt="GitHub"
            /></a
        >
    </nav>
    <p>
        Can you write JavaScript code without using <code>let</code> or any mutable
        state? Prove it.
    </p>
</header>

{@render children()}

<style>
    :global(.editor-container) {
        border-radius: 0.5rem;
        overflow: hidden;
    }
</style>
