<script>
    import PageNav from "$lib/components/PageNav.svelte";
    import { base } from "$app/paths";
    import { PUZZLES, slugify } from "$lib/puzzles";
</script>

<svelte:head>
    <title>Congrats | No Let</title>
    <meta name="description" content="Congratulations on finishing No Let!" />
</svelte:head>

<main>
    <blockquote>
        <strong>Congratulations on finishing No Let!</strong>
    </blockquote>

    <p>
        So the answer is "yes". You <em>can</em> write JavaScript code without
        using <code>let</code>.
    </p>

    <p>
        After having completed all of the puzzles, you might be wondering what
        the point to it all was. Is pure functional programming actually useful?
    </p>

    <p>
        Well, in my personal opinion: no. Not really. It certainly has
        advantages, but I don't think that they're numerous enough to outweigh
        the fact that functional programming simply makes it more difficult to
        get things done.
    </p>

    <figure>
        <a href="https://xkcd.com/1312/">
            <img
                title="xkcd 1312"
                width="251"
                height="321"
                src="{base}/xkcd1312.png"
                alt="Code written in Haskell is guaranteed to have no side effects. ...Because no one will ever run it?"
            />
        </a>
        <figcaption>
            <a href="https://www.haskell.org/">Haskell</a> is a programming
            language where you can <em>only</em> use pure functional programming
        </figcaption>
    </figure>

    <p>
        I didn't even write the No Let codebase using pure functional
        programming. I declared dozens of <code>let</code> variables and mutated state
        hundreds of times. Functional programming may not be all that practical, but
        it's a very interesting paradigm and a lot of fun to write, as I hope you'll
        agree.
    </p>

    <p>
        I really appreciate you playing through No Let to the end. I hope you
        enjoyed it!
    </p>

    <p>~Ethan</p>

    <p class="ps">
        P.S. if you'd like to report a bug or suggest a new puzzle, feel
        absolutely free to <a
            href="https://github.com/ethmarks/nolet/issues/new">open an issue</a
        > on GitHub.
    </p>

    <PageNav
        previous={{
            name: PUZZLES[PUZZLES.length - 1].name,
            slug: slugify(PUZZLES[PUZZLES.length - 1].name),
        }}
    />
</main>

<style lang="scss">
    figure {
        display: flex;
        flex-direction: column;
        align-items: center;

        figcaption {
            text-align: center;
            width: 40ch;
            font-size: 0.8em;
        }
    }

    .ps {
        font-size: 0.9em;
    }
</style>
