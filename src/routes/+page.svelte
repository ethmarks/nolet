<script>
    import PageNav from "$lib/components/PageNav.svelte";
</script>

<main>
    <blockquote><strong>Welcome to No Let!</strong></blockquote>

    <h3>What is No Let?</h3>
    <p>
        No Let is a series of JavaScript puzzles where you have to use pure
        functional programming, which means that you aren't allowed to use <code
            >let</code
        > or anything else with mutable state.
    </p>
    <p>To complete each puzzle, your code will need to pass two tests:</p>
    <ul>
        <li>
            A linter that analyzes your code and checks if you're using mutable
            state. If you try to declare a variable using <code>let</code>, the
            linter will flag it and you will fail the test.
        </li>
        <li>
            A logic test that ensures that your code outputs the correct answer.
        </li>
    </ul>

    <h3>What is pure functional programming?</h3>
    <p>
        <a href="https://en.wikipedia.org/wiki/Functional_programming"
            >Pure functional programming</a
        >
        is a programming paradigm where you aren't allowed to use mutable state. This
        means that you can't reassign variables, which means that you can't increment
        counters, which means that it's impossible to use
        <code>for</code>
        loops. For the same reasons, you're unable to use <code>while</code> loops,
        and a few other things.
    </p>
    <p>
        These extremely restrictive self-imposed limitations force you to do
        things the functional programming way, which involves <a
            href="https://en.wikipedia.org/wiki/Lambda_calculus"
            >lambda calculus</a
        >,
        <a href="https://en.wikipedia.org/wiki/Functional_programming#Recursion"
            >recursive functions</a
        >, <a href="https://en.wikipedia.org/wiki/Currying">currying</a>, and
        more.
    </p>

    <PageNav />
</main>
