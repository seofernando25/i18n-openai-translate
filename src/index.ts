import oai from "@src/translators/openai";
import { assert } from "console";
import fs from "fs";
import OpenAI from "openai";
import yargs from "yargs";
import { Translator } from "./translation_service";
import { TC_ALL } from "./util";
const prompt = (from_language: string, to_language: string, ctx: string) =>
  `
Translate an i18n JSON from ${from_language} to ${to_language}.
Context = ${ctx} 
`.trim();

(async () => {
  const providers = [oai] satisfies Translator[];

  const args = await yargs(process.argv.slice(2)).options({
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

    providers: {
      type: "array",
      describe: "The providers to use in order of fallback. Available: openai",
      default: "openai",
      alias: "p",
    },
  }).argv;

  if (args.languages && args.languages.includes("tc_all")) {
    args.languages = TC_ALL;
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const translationJobs: Promise<unknown>[] = [];

  const main = async (argv: typeof args) => {
    const { from, to, languages, input, ctx, save } = argv;

    if ((!to && !languages) || (to && languages)) {
      console.error("You must specify either --to or --languages");
      process.exit(1);
    }

    // If languages recursive call
    if (languages) {
      for (const lang of languages) {
        let new_args = {
          ...argv,
          to: lang.toString(),
        };
        delete new_args.languages;
        assert(!new_args.languages, "Languages should be deleted");
        main(new_args);
      }
      return;
    }

    console.log(`Translating to ${to}`);
    //   Check if file exists
    if (!input || !fs.existsSync(input)) {
      console.error("Input file does not exist");
      process.exit(1);
    }

    // Minify the JSON
    const jsonStr = JSON.stringify(
      JSON.parse(fs.readFileSync(input, "utf8")),
      null,
      0
    );

    const chatPromise = openai.chat.completions.create({
      temperature: 0,
      n: 1,
      messages: [
        { role: "system", content: prompt(from, to.toString(), ctx) },
        { role: "user", content: jsonStr },
      ],
      model: "gpt-3.5-turbo",
    });
    translationJobs.push(chatPromise);

    chatPromise.then((chatCompletion) => {
      // Print the result
      const choice = chatCompletion.choices[0];

      if (choice.message.content === "") {
        console.error("Error translating to", to);
        console.error("Finish Reason", choice.finish_reason);
        process.exit(1);
      }

      if (save) {
        console.log(`Saving to ${to}.json`);
        fs.writeFileSync(`${to}.json`, choice.message.content);
      } else {
        console.log(choice.message.content);
      }
    });
  };

  main(args);
  await Promise.all(translationJobs);
  console.log("Done");
})();
