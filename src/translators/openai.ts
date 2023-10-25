import { Err, Ok, Result, Translator } from "@src/translation_service";
import OpenAI from "openai";

let client: OpenAI | null = null;

function prompt(
  from_language: string,
  to_language: string,
  ctx: string = "General Translation",
  input: string = ""
) {
  return `Translate an i18n JSON from ${from_language} to ${to_language} in the context of "${ctx}"\n[INPUT]\n${input}`.trim();
}

function help() {
  console.log("OpenAI Translation API");
  console.log();
  console.log("Required Environment Variables:");
  console.log("Make sure to set OPENAI_API_KEY in your environment");
}

async function translate(
  text: string,
  from: string,
  to: string,
  ctx: string
): Promise<Result<string, unknown>> {
  if (!process.env.OPENAI_API_KEY) {
    return Err("No API Key set");
  }

  try {
    if (!client) {
      client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }

    const res = await client.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt: prompt(from, to, ctx, text),
      temperature: 0,
      n: 1,
      max_tokens: 1000,
    });

    if (!res.choices || res.choices.length === 0) {
      return Err("No results from completion");
    }

    const choice = res.choices[0];

    if (!choice.text) {
      return Err("No text in choice");
    }

    if (choice.finish_reason === "length") {
      return Err("Result too long");
    }

    if (choice.finish_reason === "content_filter") {
      return Err("Inappropriate content");
    }

    return Ok(choice.text);
  } catch (e) {
    return Err(e);
  }
}
export default {
  name: "openai",
  translate,
  help,
} satisfies Translator;
