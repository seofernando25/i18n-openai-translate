import { Err, Ok, TranslationResult } from "@src/translation_service";
import OpenAI from "openai";

let client: OpenAI | null = null;

function prompt(
  from_language: string,
  to_language: string,
  ctx: string,
  input: string
) {
  return `Translate an i18n JSON from ${from_language} to ${to_language} in the context of "${ctx}"\nYou May return a valid JSON file given: ${input}`.trim();
}

export async function translate(
  text: string,
  from: string,
  to: string,
  ctx: string
): Promise<TranslationResult> {
  if (!process.env.OPENAI_API_KEY) {
    return Err(new Error("No API Key set"));
  }

  try {
    if (!client) {
      client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }

    const res = await client.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt: prompt(from, to, ctx || "General Translation", text),
      temperature: 0,
      n: 1,
      max_tokens: 1000,
    });

    if (!res.choices || res.choices.length === 0) {
      return Err(new Error("No results from completion"));
    }

    const choice = res.choices[0];

    if (!choice.text) {
      return Err(new Error("No text in choice"));
    }

    if (choice.finish_reason === "length") {
      return Err(new Error("Result too long"));
    }

    if (choice.finish_reason === "content_filter") {
      return Err(new Error("Inappropriate content"));
    }

    return Ok(choice.text);
  } catch (e) {
    return Err(e);
  }
}
