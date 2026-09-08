<script lang="ts">
	import favicon from "$lib/assets/favicon.png";
	import { page } from "$app/state";
	import { base } from "$app/paths";
	import { PUZZLES, slugify } from "$lib/puzzles";
	import "$lib/assets/dev.css";

	let { children } = $props();

	let path = $derived(page.url.pathname.substring(base.length + 1));
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
			<li><a href="{base}/">Home</a></li>
			<li><a href="https://github.com/ethmarks/nolet">Source</a></li>
		</ul>
	</nav>
</header>

<aside>
	<details open>
		<summary>Puzzles</summary>
		<nav>
			<ol>
				{#each PUZZLES as puzzle}
					<li
						aria-current={path === slugify(puzzle.name)
							? "page"
							: undefined}
					>
						<a href="{base}/{slugify(puzzle.name)}">{puzzle.name}</a
						>
					</li>
				{/each}
			</ol>
		</nav>
	</details>
</aside>

{@render children()}

<style lang="scss">
	:global {
		.editor-container {
			margin-block: 1rem;
			border-radius: 0.5rem;
			overflow: hidden;

			.prism-code-editor {
				font-family:
					Maple Mono,
					Fira Code,
					Fira Mono,
					Menlo,
					Consolas,
					DejaVu Sans Mono,
					monospace !important;
			}
		}
	}

	header nav li:not(:first-child)::before {
		content: "•";
		margin: 0 0.25em;
	}

	aside nav li[aria-current="page"] {
		font-weight: bold;
	}
</style>
