import { Err, Ok, Result, Translator } from "@src/translation_service";

function help() {
  console.log("Google Cloud Translation API");
  console.log();
  console.log("Required Environment Variables:");
  console.log("Make sure to set GOOGLE_API_KEY in your environment");
}

async function translate(
  text: string,
  from: string,
  to: string,
  _ctx: string
): Promise<Result<string, unknown>> {
  const url = "https://translation.googleapis.com/language/translate/v2";
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    return Err("No API Key set");
  }

  const body = {
    q: text,
    target: to,
    source: from,
    format: "text",
    model: "nmt",
    key: apiKey,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      return Err(response.statusText);
    }
    const data = await response.json();

    const text = data.data.translations[0].translatedText;

    if (!text) {
      return Err("No text in choice");
    }
    return Ok(text);
  } catch (error) {
    return Err(error);
  }
}

export default {
  name: "google-cloud",
  translate,
  help,
} satisfies Translator;
