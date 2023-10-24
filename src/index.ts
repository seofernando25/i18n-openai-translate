import fs from "fs";
import OpenAI from "openai";
import yargs from "yargs";

const prompt = (from_language: string, to_language: string, ctx: string) =>
  `
[target]
goal= translate i18n JSON from ${from_language} to ${to_language}.
context= ${ctx} 

[output]
minified=true
single_line_output: true
space_after_colon: false
`.trim();

async function main() {
  const argv = await yargs(process.argv.slice(2)).options({
    from: {
      type: "string",
      default: "english",
      describe: "The language to translate from",
      alias: "f",
    },

    to: {
      type: "string",
      default: "french",
      describe: "The language to translate to",
      alias: "t",
    },

    input: {
      type: "string",
      describe: "The input file to translate",
      alias: "i",
    },

    ctx: {
      type: "string",
      default: "General",
      describe: "Additional context to use",
      alias: "c",
    },
  }).argv;

  const { from, to, input } = argv;

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

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const chatCompletion = await openai.chat.completions.create({
    temperature: 0,
    messages: [
      { role: "system", content: prompt(from, to) },
      { role: "user", content: jsonStr },
    ],
    model: "gpt-3.5-turbo",
  });

  // Print the result
  for (const choices of chatCompletion.choices) {
    console.log("###############");
    console.log();
    console.log("Choice:");
    console.log(choices.message.content);
    console.log();
    console.log("----------------");
    console.log();
    console.log("Finish Reason:");
    console.log(choices.finish_reason);
    console.log();
    console.log("----------------");
  }
}

main();
