import { Err, Ok, Result, Translator } from "@src/translation_service";
import * as deepl from "deepl-node";

let client: deepl.Translator | null = null;

function help() {
  console.log("DeepL Translation API");
  console.log();
  console.log("Required Environment Variables:");
  console.log("Make sure to set DEEPL_API_KEY in your environment");
}

async function translate(
  text: string,
  from: string,
  to: string,
  _ctx: string
): Promise<Result<string, unknown>> {
  if (!process.env.DEEPL_API_KEY) {
    return Err("No API Key set");
  }

  try {
    if (!client) {
      client = new deepl.Translator(process.env.DEEPL_API_KEY);
    }

    const result = await client.translateText(
      text,
      from as deepl.SourceLanguageCode,
      to as deepl.TargetLanguageCode
    );
    if (!result.text) {
      return Err("No text in choice");
    }

    return Ok(result.text);
  } catch (e) {
    return Err(e);
  }
}
export default {
  name: "deepl",
  translate,
  help,
} satisfies Translator;
