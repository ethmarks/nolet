import { QuickJSError, runSnippet } from "$lib/runSnippet";
import type { Puzzle, TestResult } from ".";

type Player = { name: string; team: number; score: number };

// Currently unused but I think it's good practice to have type guards.
function isPlayers(value: unknown): value is Player[] {
  return (
    Array.isArray(value) &&
    (value as Player[]).every(
      (p) =>
        typeof p === "object" &&
        p !== null &&
        typeof p.name === "string" &&
        typeof p.team === "number" &&
        typeof p.score === "number",
    )
  );
}

export class ScoreboardPuzzle implements Puzzle {
  public name: string = "Scoreboard";
  public slug = "scoreboard";

  private players: Player[] = [
    { name: "Algernon", team: 1, score: 6 },
    { name: "Beatrice", team: 2, score: 2 },
    { name: "Cassian", team: 2, score: 1 },
    { name: "Dorothy", team: 1, score: 4 },
    { name: "Ebenezer", team: 2, score: 7 },
    { name: "Florence", team: 1, score: 4 },
  ];
  private scoringTeam: number = 1;

  public inputString: string = `const input = [
  ${this.players.map((p) => JSON.stringify(p)).join(",\n  ")}
];
const scoringTeam = ${this.scoringTeam};`;

  public initialCode: string = `
function incrementScore(players, team) {
  let scoringPlayers = [];
  for (const player of players) {
    if (player.team === team) {
      player.score++;
      scoringPlayers.push(player);
    }
  }
  return scoringPlayers;
}

return incrementScore(input, scoringTeam);
`;

  public descriptionHTML: string = `
<p>Think quick! You are in charge of the scoreboard for a sportsball event. Team 1 just scored, and everyone is expecting the scoreboard to update.</p>
<p>Note: for power efficiency's sake, the scoreboard only accepts the data from the players that changed, so make sure not to return the full array of players; only the ones that changed.</p>
<p>Good luck!</p>
`;

  public solution: string = `
function incrementScore(players, team) {
  return players
    .filter((p) => p.team === team)
    .map((p) => {
      return { name: p.name, team: p.team, score: p.score + 1 };
    });
}
`;

  private getAnswer(players: Player[], team: number): Player[] {
    return players
      .filter((p) => p.team === team)
      .map((p) => {
        return { name: p.name, team: p.team, score: p.score + 1 };
      });
  }

  public test(userCode: string): TestResult {
    const res = runSnippet(userCode, this.inputString);

    if (typeof res === "undefined") {
      return {
        passed: false,
        msg: `Expected a value, but you didn't return anything. Remember to use \`return\` at the top level.`,
      };
    }

    if (res instanceof QuickJSError) {
      return {
        passed: false,
        msg: res.message,
      };
    }

    if (!Array.isArray(res)) {
      return {
        passed: false,
        msg: `Expected an \`Array\` but got type \`${typeof res}\` instead.`,
      };
    }

    const answer = this.getAnswer(this.players, this.scoringTeam);

    if (res.length !== answer.length) {
      return {
        passed: false,
        msg: `Expected result to have length ${answer.length}, but got ${res.length}`,
      };
    }

    for (let index = 0; index < answer.length; index++) {
      const answerPlayer = answer[index];
      const resPlayer = res[index];
      if (typeof resPlayer !== "object") {
        return {
          passed: false,
          msg: `Expected player with index ${index} to be an Object, but had type \`${typeof resPlayer}\` instead.`,
        };
      }

      if (!("name" in resPlayer)) {
        return {
          passed: false,
          msg: `Expected player with index ${index} to have property \`name\`.`,
        };
      }
      if (resPlayer.name !== answerPlayer.name) {
        return {
          passed: false,
          msg: `Expected player with index ${index} to be named ${answerPlayer.name}.`,
        };
      }

      if (!("team" in resPlayer)) {
        return {
          passed: false,
          msg: `Expected ${resPlayer.name} to have property \`team\`.`,
        };
      }
      if (resPlayer.team !== answerPlayer.team) {
        return {
          passed: false,
          msg: `Expected ${resPlayer.name} to be on team ${answerPlayer.team}.`,
        };
      }

      if (!("score" in resPlayer)) {
        return {
          passed: false,
          msg: `Expected ${resPlayer.name} to have property \`score\`.`,
        };
      }
      if (resPlayer.score !== answerPlayer.score) {
        return {
          passed: false,
          msg: `Expected ${resPlayer.name} to be have score ${answerPlayer.score}.`,
        };
      }
    }

    return {
      passed: true,
      msg: `Result array matches expected array. LGTM!`,
    };
  }
}
