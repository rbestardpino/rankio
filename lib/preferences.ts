import { Preferences } from "@lib/models";

const schema = {
  ratingSystem: {
    name: "Rating System",
    description:
      "Controls whether you want to use a stars based system or a tierlist system for ranking movies.",
    type: "union",
    options: ["stars", "tierlist"],
    default: "tierlist",
  },
  tierlistNames: {
    name: "Tierlist Names",
    description:
      "The names of your tiers if you choose to use tierlist as the ranking system.",
    type: "object",
    sub: {
      1: {
        name: "Worst tier",
        description: "Name of the worst tier",
        type: "string",
        default: "Unwatchable",
      },
      2: {
        name: "Second to worst tier",
        description: "Name of the second to worst tier",
        type: "string",
        default: "Awful",
      },
      3: {
        name: "Third to worst tier",
        description: "Name of the third to worst tier",
        type: "string",
        default: "Bad",
      },
      4: {
        name: "Middle tier",
        description: "Name of the middle tier",
        type: "string",
        default: "Good",
      },
      5: {
        name: "Third to best tier",
        description: "Name of the third to best tier",
        type: "string",
        default: "Great",
      },
      6: {
        name: "Second to best tier",
        description: "Name of the second to best tier",
        type: "string",
        default: "Excellent",
      },
      7: {
        name: "Best tier",
        description: "Name of the best tier",
        type: "string",
        default: "Masterpiece",
      },
    },
  },
} as const;

const defaults: Preferences = {
  ratingSystem: "tierlist",
  tierlistNames: {
    1: "Unwatchable",
    2: "Awful",
    3: "Bad",
    4: "Good",
    5: "Great",
    6: "Excellent",
    7: "Masterpiece",
  },
};

export { schema, defaults };
