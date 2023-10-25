import yargs from "yargs";
import doTranslation from "./do-translations";
import { TC_ALL } from "./util";

const argsPromise = yargs(process.argv.slice(2)).options({
  from: {
    type: "string",
    default: "[infer language]",
    describe: "The language to translate from",
    alias: "f",
  },

  to: {
    type: "string",
    describe: "The language to translate to",
    alias: "t",
  },

  languages: {
    type: "array",
    describe: "The languages to translate to",
    alias: "l",
  },

  input: {
    type: "string",
    describe: "The input file to translate",
    alias: "i",
  },

  ctx: {
    type: "string",
    default: "General Translation",
    describe: "Additional context to use",
    alias: "c",
  },

  save: {
    type: "boolean",
    describe: "Save the output to a file of language name",
    alias: "s",
  },

  pretty: {
    type: "boolean",
    describe: "Pretty print the output",
    alias: "p",
  },
}).argv;

export type MainArgs = Awaited<typeof argsPromise>;

async function main() {
  const args = await argsPromise;
  if (args.languages && args.languages.includes("tc_all")) {
    args.languages = TC_ALL;
  }

  const translationJobs = doTranslation(args);
  const promises = await Promise.all(translationJobs);
  const hasFailures = promises.some((p) => p.kind === "failure");
  if (hasFailures) {
    console.error("Some translations failed");
    process.exit(1);
  }
}
main();
