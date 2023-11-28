import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import doTranslation from "./do-translations";
import { TC_ALL } from "./util";

const program = yargs(hideBin(process.argv))
  .scriptName("i18n-openai-translate")
  .option("from", {
    alias: "f",
    type: "string",
    description: "The language to translate from",
  })
  .option("to", {
    alias: "t",
    type: "string",
    description: "The language to translate to",
  })
  .option("languages", {
    alias: "l",
    type: "array",
    description: "The languages to translate to",
  })
  .option("ctx", {
    alias: "c",
    type: "string",
    description: "Additional context to use",
  })
  .option("save", {
    alias: "s",
    type: "boolean",
    description: "Save the output to a file of language name",
  })
  .option("pretty", {
    alias: "p",
    type: "boolean",
    description: "Pretty print the output",
  })
  .option("max_tokens", {
    alias: "m",
    type: "number",
    description: "The maximum number of tokens to use",
    default: 1000,
  })
  .option("input", {
    alias: "i",
    type: "string",
    description: "The input file to translate",
  })
  .demandOption("input", "Provide an input file to translate");

const args = program.parseSync();

if (
  (args.languages && args.languages.includes("tc_all")) ||
  args.to === "tc_all"
) {
  args.languages = TC_ALL;
  args.to = "";
}

const translationJobs = doTranslation(args);

Promise.all(translationJobs)
  .then((promises) => {
    const hasFailures = promises.some((p) => p.kind === "failure");
    if (hasFailures) {
      console.error("Some translations failed");
      process.exit(1);
    }
  })
  .catch((e) => {
    console.error("Some translations failed");
    console.error(e);
    process.exit(1);
  });

export type MainArgs = typeof args;
