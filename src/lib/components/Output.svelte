<script lang="ts">
    import { fpLint, type Violation } from "$lib/fpLint";
    import type { TestResult } from "$lib/puzzles";
    import { onMount } from "svelte";
    import { slide } from "svelte/transition";

    export type OutputStatus = "not started" | "waiting" | "failed" | "passed";

    interface Props {
        userCode: string;
        test: (userCode: string) => TestResult;
        updateStatus: (s: OutputStatus) => void;
        registerRunLogic: (func: () => void) => void;
        registerRunLint: (func: () => void) => void;
    }

    let {
        userCode,
        test,
        updateStatus,
        registerRunLogic,
        registerRunLint,
    }: Props = $props();

    function runLogic() {
        logicRes = undefined;
        status = "waiting";
        logicRes = test(userCode);
        status = lintPassed && logicPassed ? "passed" : "failed";
    }

    function runLint() {
        viols = undefined;
        status = "waiting";
        viols = fpLint(userCode);
        status = lintPassed && logicPassed ? "passed" : "failed";
    }

    function backtickToCode(md: string) {
        return md.replace(/`([^`\n]+)`/g, "<code>$1</code>");
    }

    let viols: Violation[] | undefined = $state();

    let logicRes: TestResult | undefined = $state();

    let lintPassed: boolean = $derived(viols?.length === 0);
    let logicPassed: boolean = $derived(logicRes?.passed ?? false);

    let status: OutputStatus = $state("waiting");

    let outputMsg: string = $derived.by(() => {
        if (status === "waiting") {
            if (viols === undefined && logicRes === undefined) {
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

    interface ResultElement {
        id: string;
        name: string;
        class?: "pass" | "fail";
        msg?: string;
        lineNum?: string;
    }

    let logicResEl: ResultElement = $derived.by(() => {
        if (typeof logicRes === "undefined") {
            const el: ResultElement = {
                id: "logic-wait",
                name: "Waiting on logic tests...",
            };
            return el;
        }

        const passOrFail = logicPassed ? "pass" : "fail";

        const el: ResultElement = {
            id: `logic-${passOrFail}-${logicRes.msg}`,
            name: `Logic test ${passOrFail}ed!`,
            class: passOrFail,
            msg: backtickToCode(logicRes.msg),
        };

        return el;
    });

    let lintResEls: ResultElement[] = $derived.by(() => {
        if (typeof viols === "undefined") {
            const el: ResultElement = {
                id: "lint-wait",
                name: "Waiting on linter...",
            };
            return [el];
        }

        if (lintPassed) {
            const el: ResultElement = {
                id: "lint-pass",
                name: "Linting passed!",
                class: "pass",
                msg: "No disallowed constructs detected.",
            };
            return [el];
        }

        const els: ResultElement[] = viols.map((viol, index) => {
            return {
                id: `lint-${viol.name}-${viol.message}-${viol.lineNum}-${index}`,
                name: backtickToCode(viol.name),
                class: "fail",
                msg: backtickToCode(viol.message),
                lineNum: viol.lineNum,
            };
        });

        return els;
    });

    let resEls: ResultElement[] = $derived([logicResEl, ...lintResEls]);

    $effect(() => {
        updateStatus(status);
    });

    onMount(() => {
        registerRunLogic(() => runLogic());
        registerRunLint(() => runLint());
    });
</script>

<div class="results">
    <ul>
        {#each resEls as resEl (resEl.id)}
            <li transition:slide id="res-{resEl.id}" class={resEl.class}>
                <span class="name">{@html resEl.name}</span>

                {#if resEl.msg}
                    <span class="msg">{@html resEl.msg}</span>
                {/if}

                {#if resEl.lineNum}
                    <span class="line" title="Line {resEl.lineNum}"
                        >(L{resEl.lineNum})</span
                    >
                {/if}
            </li>
        {/each}
    </ul>
    <blockquote>{outputMsg}</blockquote>
</div>

<style lang="scss">
    ul {
        margin: 0;
        padding-inline: 2em;

        li {
            list-style: none;

            .name {
                font-weight: bold;
            }
            .msg,
            .line {
                font-size: 0.85em;
            }

            &.fail::before {
                /* Red X looks kinda bad so I'm using red circle instead. */
                content: "⭕";
            }
            &.pass::before {
                content: "✅";
            }
            :first-child {
                margin-left: 5px;
            }
        }
    }
</style>
