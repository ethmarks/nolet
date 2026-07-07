import { QuickJSError, runSnippet } from "$lib/runSnippet";
import type { Puzzle, TestResult } from ".";

type Department = {
  name: string;
  personnel: string[];
  subdepartments?: Department[];
};

/**
 * I put WAY more effort into this than I reasonably should have.
 */
function getDepartments(): Department[] {
  const MIN_PERSONNEL_PER_DEPARTMENT = 8;
  const MAX_PERSONNEL_PER_DEPARTMENT = 32;

  // Source: https://gist.github.com/ethmarks/23213373c477a3a27a8d0850c3efaac3
  //
  // I also shuffled it though.
  //
  // prettier-ignore
  const NAMES = ["Christina", "Sandra", "Kevin", "Danielle", "Gloria", "Ashley", "Ethan", "Kelly", "John", "Jesse", "Ann", "Patricia", "Virginia", "Melissa", "Jeffrey", "Anthony", "Joe", "Willie", "Samuel", "Eric", "Joyce", "Liam", "Samantha", "Christopher", "Gerald", "Luke", "Gary", "Michelle", "Jennifer", "Debra", "Deborah", "Betty", "Elizabeth", "Janice", "Andrea", "Jonathan", "Theresa", "Sharon", "Maria", "Nancy", "Scott", "David", "Martha", "Billy", "Bradley", "Mason", "Rebecca", "Katherine", "Bryan", "Ryan", "Bruce", "Adam", "Joan", "Terry", "Kyle", "Ronald", "Walter", "Susan", "Jacqueline", "Denise", "Isabella", "Randy", "Arthur", "Cheryl", "Carol", "Jean", "Diana", "Sarah", "Evelyn", "Zachary", "Joshua", "Noah", "Sean", "Raymond", "Donna", "Amanda", "Frances", "Harold", "Lisa", "Christian", "William", "Madison", "Rachel", "Lawrence", "Brian", "Roger", "Kenneth", "Emily", "Isaac", "Gregory", "Henry", "Judy", "Paul", "Ava", "Brandon", "Margaret", "Megan", "Kathleen", "Andrew", "Mark", "Austin", "Sara", "Jeremy", "Kimberly", "Carl", "Matthew", "Beverly", "Charlotte", "Lauren", "Victoria", "Carolyn", "Charles", "Ruth", "Emma", "Pamela", "Linda", "Kathryn", "Jason", "Frank", "Barbara", "Kayla", "Robert", "Stephanie", "Shirley", "Benjamin", "Tyler", "Gabriel", "Alexis", "Elijah", "Laura", "Jessica", "Alexander", "Logan", "Steven", "Tiffany", "Alan", "Diane", "Dylan", "Cameron", "Jordan", "Julie", "James", "Cynthia", "Joseph", "Natalie", "Thomas", "Mary", "Michael", "Juan", "Karen", "Donald", "Lori", "Keith", "Stephen", "Alice", "Vincent", "Teresa", "Dennis", "Daniel", "Marilyn", "Wayne", "Caleb", "Christine", "Hannah", "Nathan", "Grace", "Peter", "Brittany", "Jerry", "Richard", "Larry", "Julia", "Sophia", "Abigail", "Jacob", "Jose", "Aaron", "Brenda", "George", "Justin", "Nicole", "Albert", "Douglas", "Catherine", "Judith", "Angela", "Amy", "Anna", "Edward", "Amber", "Helen", "Heather", "Lucas", "Olivia", "Timothy", "Patrick", "Jack", "Dorothy", "Nicholas", "Janet"];

  // https://github.com/cprosche/mulberry32
  function mulberry32(seed: number) {
    return function () {
      let t = (seed += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const rng = mulberry32(1415120520);

  function getNames(): string[] {
    return Array.from({
      length:
        Math.floor(
          rng() * (MAX_PERSONNEL_PER_DEPARTMENT - MIN_PERSONNEL_PER_DEPARTMENT),
        ) + MIN_PERSONNEL_PER_DEPARTMENT,
    }).map((_) => NAMES[Math.ceil(rng() * (NAMES.length - 1))]);
  }

  // 42 instances of getNames()
  return [
    {
      name: "Executive",
      personnel: getNames(),
    },
    {
      name: "Engineering",
      personnel: getNames(),
      subdepartments: [
        {
          name: "Software",
          personnel: getNames(),
          subdepartments: [
            {
              name: "Frontend",
              personnel: getNames(),
            },
            {
              name: "Backend",
              personnel: getNames(),
            },
            {
              name: "QA",
              personnel: getNames(),
            },
          ],
        },
        {
          name: "Product & Design",
          personnel: getNames(),
          subdepartments: [
            {
              name: "UI/UX",
              personnel: getNames(),
            },
            {
              name: "Product Management",
              personnel: getNames(),
            },
            {
              name: "User Research",
              personnel: getNames(),
            },
          ],
        },
        {
          name: "IT",
          personnel: getNames(),
          subdepartments: [
            {
              name: "DevOps",
              personnel: getNames(),
            },
            {
              name: "Network Secuity",
              personnel: getNames(),
            },
            {
              name: "Internal Support",
              personnel: getNames(),
            },
          ],
        },
      ],
    },
    {
      name: "Marketing & Sales",
      personnel: getNames(),
      subdepartments: [
        {
          name: "Sales",
          personnel: getNames(),
          subdepartments: [
            {
              name: "Enterprise Sales",
              personnel: getNames(),
            },
            {
              name: "SMB Sales",
              personnel: getNames(),
            },
          ],
        },
        {
          name: "Ads",
          personnel: getNames(),
        },
        {
          name: "Communications",
          personnel: getNames(),
          subdepartments: [
            {
              name: "Public Relations",
              personnel: getNames(),
            },
            {
              name: "Internal Communications",
              personnel: getNames(),
            },
            {
              name: "Events",
              personnel: getNames(),
            },
          ],
        },
      ],
    },
    {
      name: "Operations & Supply Chain",
      personnel: getNames(),
      subdepartments: [
        {
          name: "Logistics",
          personnel: getNames(),
          subdepartments: [
            {
              name: "Procurement & Sourcing",
              personnel: getNames(),
            },
            {
              name: "Inventory Management",
              personnel: getNames(),
            },
            {
              name: "Distribution",
              personnel: getNames(),
            },
          ],
        },
        {
          name: "Facilities",
          personnel: getNames(),
          subdepartments: [
            {
              name: "Real Estate",
              personnel: getNames(),
            },
            {
              name: "Security",
              personnel: getNames(),
            },
          ],
        },
      ],
    },
    {
      name: "Finance & Legal",
      personnel: getNames(),
      subdepartments: [
        {
          name: "Corporate Finance",
          personnel: getNames(),
          subdepartments: [
            {
              name: "Financial Planning",
              personnel: getNames(),
            },
            {
              name: "Accounting & Payroll",
              personnel: getNames(),
            },
            {
              name: "Tax & Treasury",
              personnel: getNames(),
            },
            {
              name: "Investor Relations",
              personnel: getNames(),
            },
          ],
        },
        {
          name: "Legal & Compliance",
          personnel: getNames(),
          subdepartments: [
            {
              name: "Corporate Governance",
              personnel: getNames(),
            },
            {
              name: "Intellectual Property",
              personnel: getNames(),
            },
            {
              name: "Commercial Contracts",
              personnel: getNames(),
            },
          ],
        },
      ],
    },
  ];
}

export class HeadcountPuzzle implements Puzzle {
  public name: string = "Headcount";

  private input: Department[] = getDepartments();

  public inputString: string = `
// Here's the input data type, if it helps.
//
// type Department = {
//   name: string;
//   personnel: string[];
//   subdepartments?: Department[];
// };
//
// type Input = Department[];

const input = [
  ${this.input.map((d) => JSON.stringify(d)).join(",\n  ")}
];`;

  public initialCode: string = `
function getHeadcount(departments) {
  let count = 0;

  const queue = [...departments];

  while (queue.length > 0) {
    const department = queue.shift();

    count += department.personnel.length;

    if (department.subdepartments) {
      queue.push(...department.subdepartments);
    }
  }

  return count;
}

return getHeadcount(input);
`;

  public descriptionHTML: string = `
<p>The fire inspector is demanding to know if our office is under the fire safety occupancy limit. We're not entirely sure how many employees we have, so we need you to go count them. Here's our department structure as a deeply-nested data object.</p>
<p>Good luck!</p>
<p>Bonus: can you think of a valid solution that <em>doesn't</em> use recursion?</p>
`;

  public solution: string = `
// This is the best solution I could come up with.
function getHeadcount(departments) {
  return departments.reduce((total, department) => {
    const currentCount = department.personnel.length;
    const subCount = department.subdepartments
      ? getHeadcount(department.subdepartments)
      : 0;
    return total + currentCount + subCount;
  }, 0);
}

// This solution is a bit more complicated, but it avoids
// using .reduce().
function getHeadcount(departments) {
  // departments will be empty in the final recursive
  // call because remainingDepartments will be empty.
  if (departments.length === 0) return 0;

  const [firstDepartment, ...remainingDepartments] = departments;

  const currentCount = firstDepartment.personnel.length;

  const subCount = firstDepartment.subdepartments
    ? getHeadcount(firstDepartment.subdepartments)
    : 0;

  const remainingCount = getHeadcount(remainingDepartments);

  return currentCount + subCount + remainingCount;
}
`;

  /**
   * This solution is fun, but it's *really* hacky and brittle to the point
   * where I'm not sure that I want to endorse it as an acceptable solution.
   *
   * Also, the regex seems to be causing some issues with prism-code-editor.
   * It's not rendering some of the characters or it's treating them as escaped
   * or something like that.
   */
  private _regexSolution = `
// This solution is not only hacky, brittle, and cursed,
// but it's also slow. Its only advantage is that it
// avoids the use of recursion.
function getHeadcount(departments) {
  const json = JSON.stringify(departments);
  const matches = json.match(/"personnel":\[(.*?)(?=\])/g) || [];
  return matches
    .flatMap((match) => match.replace('"personnel":[', "").split(","))
    .filter((name) => name.length > 0).length;
}
`;

  private getAnswer(departments: Department[]): number {
    let count: number = 0;

    const queue = [...departments];

    while (queue.length > 0) {
      const department = queue.shift();

      if (department === undefined) break;

      count += department.personnel.length;

      if (department.subdepartments) {
        queue.push(...department.subdepartments);
      }
    }

    return count;
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

    if (Array.isArray(res)) {
      return {
        passed: false,
        msg: `Expected a number but got an Array instead.`,
      };
    }

    if (typeof res !== "number") {
      return {
        passed: false,
        msg: `Expected a number but got type "${typeof res}" instead.`,
      };
    }

    const answer = this.getAnswer(this.input);
    if (res !== answer) {
      return {
        passed: false,
        msg: `Expected \`${answer}\` but got \`${res}\` instead.`,
      };
    }

    return {
      passed: true,
      msg: `Expected \`${answer}\` and got \`${res}\`.`,
    };
  }
}
