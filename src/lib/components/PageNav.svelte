<script lang="ts">
    import { page } from "$app/state";
    import { PUZZLES } from "$lib/puzzles";

    let path = $derived(page.url.pathname);

    let previous: { name: string; url: string } | undefined = $state();
    let next: { name: string; url: string } | undefined = $state();

    $effect(() => {
        if (path === "/") {
            previous = undefined;
            const firstPuzzle = PUZZLES[0];
            next = { name: firstPuzzle.name, url: `/${firstPuzzle.slug}` };
        } else {
            const slug = path.substring(1);

            const puzzleIndex = PUZZLES.findIndex((p) => p.slug === slug);
            const puzzleExists = puzzleIndex !== -1;

            if (puzzleExists) {
                previous =
                    puzzleIndex === 0
                        ? { name: "Welcome", url: "/" }
                        : {
                              name: PUZZLES[puzzleIndex - 1].name,
                              url: `/${PUZZLES[puzzleIndex - 1].slug}`,
                          };
                next =
                    puzzleIndex === PUZZLES.length - 1
                        ? undefined
                        : {
                              name: PUZZLES[puzzleIndex + 1].name,
                              url: `/${PUZZLES[puzzleIndex + 1].slug}`,
                          };
            }
        }
    });
</script>

<nav>
    {#if previous}
        <div class="previous">
            <p>Previous</p>
            <a href={previous.url}>{previous.name}</a>
        </div>
    {/if}
    {#if next}
        <div class="next">
            <p>Next</p>
            <a href={next.url}>{next.name}</a>
        </div>
    {/if}
</nav>

<style lang="scss">
    div {
        p {
            margin: 0;
        }
        a {
            font-style: italic;
        }
    }
    .previous {
        float: left;
        text-align: left;
    }
    .next {
        float: right;
        text-align: right;
    }
</style>
