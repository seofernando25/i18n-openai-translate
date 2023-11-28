import fs from "fs";
import { MainArgs } from ".";
import { translate } from "./openai";
import { TranslationResult } from "./translation_service";

function doTranslation(
  argv: MainArgs,
  _translation_jobs: Promise<TranslationResult>[] = []
): Promise<TranslationResult>[] {
  const { from, to, languages, input, ctx, save, pretty, max_tokens } = argv;

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
      doTranslation(new_args, _translation_jobs);
    }
    return _translation_jobs;
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

  const translationPromise = translate(jsonStr, from, to, ctx, max_tokens);
  _translation_jobs.push(translationPromise);

  translationPromise.then((translationResult) => {
    if (translationResult.kind === "failure") {
      console.error("Error translating to", to);
      console.error(translationResult.error);
      return _translation_jobs;
    }

    const translation = translationResult.result;

    const content = JSON.parse(translation, null);
    const contentStr = JSON.stringify(content, null, pretty ? 2 : 0);
    if (save) {
      console.log(`Saving to ${to}.json`);
      fs.writeFileSync(`${to}.json`, contentStr);
    } else {
      console.log(contentStr);
    }
  });
  return _translation_jobs;
}

export default doTranslation;
