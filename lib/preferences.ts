export interface Preference {
  key: string;
  name: string;
  description: string;
  type: "union" | "string";
  options?: string[];
  default: string;
}

const defaultPreferences = {
  ratingSystem: "tierlist",
  label1: "Unwatchable",
  label2: "Awful",
  label3: "Bad",
  label4: "Good",
  label5: "Great",
  label6: "Excellent",
  label7: "Masterpiece",
} as const;

const schema: Readonly<Preference[]> = [
  {
    key: "ratingSystem",
    name: "Rating System",
    description:
      "Controls whether you want to use a stars based system or a tierlist system for ranking movies.",
    type: "union",
    options: ["stars", "tierlist"],
    default: defaultPreferences.ratingSystem,
  },
  {
    key: "label1",
    name: "Worst tier",
    description: "Name of the worst tier",
    type: "string",
    default: defaultPreferences.label1,
  },
  {
    key: "label2",
    name: "Second to worst tier",
    description: "Name of the second to worst tier",
    type: "string",
    default: defaultPreferences.label2,
  },
  {
    key: "label3",
    name: "Third to worst tier",
    description: "Name of the third to worst tier",
    type: "string",
    default: defaultPreferences.label3,
  },
  {
    key: "label4",
    name: "Middle tier",
    description: "Name of the middle tier",
    type: "string",
    default: defaultPreferences.label4,
  },
  {
    key: "label5",
    name: "Third to best tier",
    description: "Name of the third to best tier",
    type: "string",
    default: defaultPreferences.label5,
  },
  {
    key: "label6",
    name: "Second to best tier",
    description: "Name of the second to best tier",
    type: "string",
    default: defaultPreferences.label6,
  },
  {
    key: "label7",
    name: "Best tier",
    description: "Name of the best tier",
    type: "string",
    default: defaultPreferences.label7,
  },
];

export { schema, defaultPreferences };
