<script lang="ts">
    import { page } from "$app/state";
    import { base } from "$app/paths";

    import { PUZZLES, slugify } from "$lib/puzzles";

    let path = $derived(page.url.pathname.substring(base.length));

    let {
        previous,
        next,
    }: {
        previous: { name: string; url: string } | undefined;
        next: { name: string; url: string } | undefined;
    } = $derived.by(() => {
        if (path === "/") {
            const firstPuzzle = PUZZLES[0];
            return {
                previous: undefined,
                next: {
                    name: firstPuzzle.name,
                    url: `/${slugify(firstPuzzle.name)}`,
                },
            };
        } else if (path === "/congrats") {
            const lastPuzzle = PUZZLES[PUZZLES.length - 1];
            return {
                previous: {
                    name: lastPuzzle.name,
                    url: `/${slugify(lastPuzzle.name)}`,
                },
                next: undefined,
            };
        } else {
            const slug = path.substring(1);

            const puzzleIndex = PUZZLES.findIndex(
                (p) => slugify(p.name) === slug,
            );
            const puzzleExists = puzzleIndex !== -1;

            if (!puzzleExists) return { previous: undefined, next: undefined };

            return {
                previous:
                    puzzleIndex === 0
                        ? { name: "Welcome", url: "/" }
                        : {
                              name: PUZZLES[puzzleIndex - 1].name,
                              url: `/${slugify(PUZZLES[puzzleIndex - 1].name)}`,
                          },
                next:
                    puzzleIndex === PUZZLES.length - 1
                        ? { name: "Congrats!", url: "/congrats" }
                        : {
                              name: PUZZLES[puzzleIndex + 1].name,
                              url: `/${slugify(PUZZLES[puzzleIndex + 1].name)}`,
                          },
            };
        }
    });
</script>

<nav>
    {#if previous}
        <div class="previous">
            <p>Previous</p>
            <a href="{base}{previous.url}">{previous.name}</a>
        </div>
    {/if}
    {#if next}
        <div class="next">
            <p>Next</p>
            <a href="{base}{next.url}">{next.name}</a>
        </div>
    {/if}
</nav>

<style lang="scss">
    div {
        margin-bottom: 1rem;
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
