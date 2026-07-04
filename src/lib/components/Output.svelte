<script lang="ts">
    import { fpLint, type Violation } from "$lib/fpLint";
    import type { TestResult } from "$lib/levels";
    import CodeBlock from "./CodeBlock.svelte";

    interface Props {
        userCode: string;
        test: (userCode: string) => TestResult;
    }

    let { userCode, test }: Props = $props();

    function triggerRun() {
        viols = fpLint(userCode);
        testRes = test(userCode);
    }

    function backtickToCode(md: string) {
        return md.replace(/`([^`\n]+)`/g, "<code>$1</code>");
    }

    let viols: Violation[] | undefined = $state();

    let testRes: TestResult | undefined = $state();
</script>

<button onclick={triggerRun}>Run</button>

<div class="grid">
    <div class="test">
        <p class="label">Test results</p>
        <div class="content">
            {#if typeof testRes !== "undefined"}
                <ul>
                    {#if testRes.passed}
                        <li class="pass">
                            <span class="name">Test passed!</span>
                        </li>
                    {:else}
                        <li class="fail">
                            <span class="name">Test failed!</span>
                            <span class="msg">{testRes.msg}</span>
                        </li>
                    {/if}
                </ul>
            {/if}
        </div>
    </div>
    <div class="lint">
        <p class="label">Lint results</p>
        <div class="content">
            {#if typeof viols !== "undefined"}
                {#if viols.length > 0}
                    <ul>
                        {#each viols as viol}
                            <li class="fail">
                                <span class="line" title="Line {viol.lineNum}"
                                    >L{viol.lineNum}:</span
                                >
                                <span class="name"
                                    >{@html backtickToCode(viol.name)}</span
                                >
                                <span class="msg">
                                    {@html backtickToCode(viol.message)}
                                </span>
                            </li>
                        {/each}
                    </ul>
                {:else}
                    <ul>
                        <li class="pass">
                            <span class="name">Linting passed!</span>
                            <span class="msg"
                                >No disallowed constructs detected. LGTM!</span
                            >
                        </li>
                    </ul>
                {/if}
            {/if}
        </div>
    </div>
</div>

<style lang="scss">
    .grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;

        div {
            overflow-x: scroll;
        }

        .label {
            margin: 0;
        }
    }
    .content {
        p,
        ul {
            margin: 0;
        }
    }
    ul {
        li {
            .name {
                font-weight: bold;
            }
            .msg {
                font-size: 0.85em;
            }

            &.fail::marker {
                /* Red X looks kinda bad so I'm using red circle instead. */
                content: "⭕";
            }
            &.pass::marker {
                content: "✅";
            }
            :first-child {
                margin-left: 5px;
            }
        }
    }
</style>
