<script lang="ts">
    import { base } from "$app/paths";

    interface Props {
        previous?: { name: string; slug: string };
        next?: { name: string; slug: string };
    }

    let { previous, next }: Props = $props();
</script>

<nav>
    {#if previous}
        <div class="previous">
            <p>Previous</p>
            <a href="{base}{previous.slug}">{previous.name}</a>
        </div>
    {/if}
    {#if next}
        <div class="next">
            <p>Next</p>
            <a href="{base}{next.slug}">{next.name}</a>
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
