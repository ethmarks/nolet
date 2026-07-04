<script lang="ts">
    import { updated } from "$app/state";
    import { fpLint, type Violation } from "$lib/fpLint";
    import type { TestResult } from "$lib/puzzles";

    export type OutputStatus = "not started" | "waiting" | "failed" | "passed";

    interface Props {
        userCode: string;
        test: (userCode: string) => TestResult;
        updateStatus: (s: OutputStatus) => void;
    }

    let { userCode, test, updateStatus }: Props = $props();

    async function triggerRun() {
        testRes = undefined;
        viols = undefined;

        status = "waiting";

        testRes = test(userCode);

        viols = fpLint(userCode);

        status = lintPassed && logicPassed ? "passed" : "failed";
    }

    function backtickToCode(md: string) {
        return md.replace(/`([^`\n]+)`/g, "<code>$1</code>");
    }

    let viols: Violation[] | undefined = $state();

    let testRes: TestResult | undefined = $state();

    let lintPassed: boolean = $derived(viols?.length === 0);
    let logicPassed: boolean = $derived(testRes?.passed ?? false);

    let status: OutputStatus = $state("not started");

    let outputMsg: string = $derived.by(() => {
        if (status === "not started") {
            return 'Press "Run" to start tests and check your code.';
        } else if (status === "waiting") {
            if (viols === undefined && testRes === undefined) {
                return "Waiting on logic tests and linter...";
            } else if (viols === undefined) {
                return "Waiting on linter...";
            } else {
                return "Waiting on logic tests...";
            }
        } else {
            if (lintPassed && logicPassed) {
                return "Your code outputs the correct answer and follows pure functional programming! Great job!";
            } else if (lintPassed) {
                return "Your code follows pure functional programming, but the logic is incorrect and it outputs the wrong answer.";
            } else {
                return "Your code's logic is correct, but it contains disallowed constructs and does not follow pure functional programming.";
            }
        }
    });

    $effect(() => {
        updateStatus(status);
    });
</script>

<button onclick={triggerRun}>Run</button>

<div class="results">
    {#if status !== "not started"}
        <ul>
            {#if typeof testRes === "undefined"}
                <li>Waiting on logic tests...</li>
            {:else}
                {#if logicPassed}
                    <li class="pass">
                        <span class="name">Logic test passed!</span>
                        <span class="msg"
                            >{@html backtickToCode(testRes.msg)}</span
                        >
                    </li>
                {:else}
                    <li class="fail">
                        <span class="name">Logic test failed!</span>
                        <span class="msg"
                            >{@html backtickToCode(testRes.msg)}</span
                        >
                    </li>
                {/if}
            {/if}
            {#if typeof viols == "undefined"}
                <li>Waiting on linter...</li>
            {:else}
                {#if lintPassed}
                    <li class="pass">
                        <span class="name">Linting passed!</span>
                        <span class="msg"
                            >No disallowed constructs detected. LGTM!</span
                        >
                    </li>
                {:else}
                    {#each viols as viol}
                        <li class="fail">
                            <span class="name"
                                >{@html backtickToCode(viol.name)}</span
                            >
                            <span class="msg">
                                {@html backtickToCode(viol.message)}
                            </span>
                            <span class="line" title="Line {viol.lineNum}"
                                >(L{viol.lineNum})</span
                            >
                        </li>
                    {/each}
                {/if}
            {/if}
        </ul>
    {/if}
    <p>{outputMsg}</p>
</div>

<style lang="scss">
    ul {
        margin: 0;
        li {
            .name {
                font-weight: bold;
            }
            .msg,
            .line {
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
