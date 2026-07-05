import { PUZZLES } from "$lib/puzzles";

import { error } from "@sveltejs/kit";
import type { PageLoad, EntryGenerator } from "./$types";

export const load: PageLoad = async ({ params }) => {
  const puzzleSlug = params.slug;
  if (!puzzleSlug) throw error(404, { message: "Not found" });

  const puzzle = PUZZLES.find((p) => p.slug === puzzleSlug);

  return { puzzle };
};

export const entries: EntryGenerator = () => {
  return PUZZLES.map((p) => {
    return { slug: p.slug };
  });
};
