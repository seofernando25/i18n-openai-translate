# i18n-openai-translate 🌍🔀📚

> 🤖 Automagically translate your i18n JSON files into multiple languages using OpenAI's API! 🌐

---

## 🚀 Features

- 🌍 Translate `en.json` into multiple languages (`fr.json`, `es.json`, etc.)
- 💾 Saves directly into your `i18n` folder.
- ⚙️ Easy to configure.
- 🚫 No more manual translation!

---

## 🛠 Installation

Use npm to install `i18n-openai-translate`.

```bash
npm install -g i18n-openai-translate
```

---

## ⚙️ Usage

Simply run the following command inside your `i18n` folder:

```bash
i18n-openai-translate  -i en.json --to fr
```

---

## 📝 Configuration

You can set up your OpenAI API Key by setting the `OPENAI_API_KEY` environment variable.

Here are the usage flags for the program:

```text
--help: Shows the help message for the program.
--version: Shows the version number of the program.
-f, --from: Specifies the language to translate from.
-t, --to: Specifies the language to translate to.
-l, --languages: Specifies the languages to translate to as an array.
-c, --ctx: Specifies additional context to use.
-s, --save: Specifies whether to save the output to a file or stdout.
-p, --pretty: Specifies whether to pretty print the output.
-i, --input: Specifies the input file to translate, which is required.
```

---

## 🔒 License

This project is [GPLv2](LICENSE) licensed.

---

## 🌟 Show your support

Give a ⭐️ if this project helped you!

---

💡 **Happy Coding!** 🎉
