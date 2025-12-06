# Getting Code Suggestions with GitHub Copilot

Use GitHub Copilot to get code suggestions in your editor.

## Tool Navigation

GitHub Copilot is available for:

- Visual Studio Code
- JetBrains IDEs
- Visual Studio
- Eclipse
- Vim/Neovim

---

## Introduction

This guide demonstrates how to get coding suggestions from GitHub Copilot in a JetBrains IDE. The examples use Java, however other languages work similarly.

For more information, see [GitHub Copilot code suggestions in your IDE](https://docs.github.com/en/copilot/using-github-copilot/getting-code-suggestions-in-your-ide-with-github-copilot).

---

## Prerequisites

### Access to Copilot

To use GitHub Copilot in JetBrains, you need either:

- Limited access through **Copilot Free**
- A paid **Copilot plan** for full access

See [What is GitHub Copilot?](https://docs.github.com/en/copilot/about-github-copilot/what-is-github-copilot) for more details.

### Compatible JetBrains IDE

GitHub Copilot is compatible with the following IDEs:

- IntelliJ IDEA (Ultimate, Community, Educational)
- Android Studio
- AppCode
- CLion
- Code With Me Guest
- DataGrip
- DataSpell
- GoLand
- JetBrains Client
- MPS
- PhpStorm
- PyCharm (Professional, Community, Educational)
- Rider
- RubyMine
- RustRover
- WebStorm
- Writerside

See the [JetBrains IDEs tool finder](https://www.jetbrains.com/products/) to download.

### Install the GitHub Copilot Extension

Install the latest version of the GitHub Copilot plugin from the [JetBrains Marketplace](https://plugins.jetbrains.com/plugin/17718-github-copilot).

For installation instructions, see [Installing the GitHub Copilot extension in your environment](https://docs.github.com/en/copilot/managing-copilot/configure-personal-settings/installing-the-github-copilot-extension-in-your-environment).

### Sign in to GitHub

Sign in to GitHub in your JetBrains IDE. For authentication instructions, see the installation guide linked above.

---

## Getting Code Suggestions

GitHub Copilot offers coding suggestions as you type.

### Example: Creating a Class

In a Java file, create a class by typing:

```java
class Test
```

GitHub Copilot will automatically suggest a class body in grayed text. To accept the suggestion, press **Tab**.

### Example: Using Natural Language Comments

You can describe something you want to do using natural language within a comment, and Copilot will suggest the code to accomplish your goal.

```java
// find all images without alternate text
// and give them a red border
void process () {
```

GitHub Copilot will automatically suggest code. To accept the suggestion, press **Tab**.

> **Tip:** GitHub Copilot will attempt to match the context and style of your code. You can always edit the suggested code.

> **Note:** If you receive limited or no suggestions from Copilot, you may have duplication detection enabled. For more information, see [Managing GitHub Copilot policies as an individual subscriber](https://docs.github.com/en/copilot/managing-copilot/managing-copilot-as-an-individual-subscriber/managing-copilot-policies-as-an-individual-subscriber).

---

## Showing Alternative Suggestions

For any given input, GitHub Copilot may offer multiple suggestions. You can select which suggestion to use, or reject all suggestions.

### Example

Type the following line in a Java file, and press **Enter**:

```java
private int calculateDaysBetweenDates(Date date1,
```

GitHub Copilot will show you a suggestion.

### Navigating Suggestions

Hover over the suggestion to show the GitHub Copilot control for choosing suggestions. Click the forward or back arrow button in the control to display next or previous suggestions.

### Keyboard Shortcuts

| OS               | See Next Suggestion | See Previous Suggestion |
|------------------|---------------------|-------------------------|
| macOS            | `Option+]`          | `Option+[`              |
| Windows or Linux | `Alt+]`             | `Alt+[`                 |

### Accepting or Rejecting

- To accept a suggestion, click "Accept" in the Copilot command palette, or press **Tab**
- To reject all suggestions, press **Esc**

---

## Showing Multiple Suggestions in a New Tab

If you don't want to use any of the initial suggestions, you can show multiple suggestions in a new tab.

### Example

Type the following line in a Java file:

```java
private int calculateDaysBetweenDates(Date date1,
```

### Opening Multiple Suggestions

Use the following keyboard shortcut, then click **Open GitHub Copilot**:

| OS               | Open Multiple Suggestions |
|------------------|---------------------------|
| macOS            | `Command+Shift+A`         |
| Windows or Linux | `Ctrl+Enter`              |

### Accepting or Rejecting from Tab

- To accept a suggestion, click **Accept suggestion NUMBER** below the suggestion
- To reject all suggestions, close the tab

---

## Accepting Partial Suggestions

You can accept just the next word or line of a suggestion instead of the entire suggestion.

### Example

Type the following line in a Java file:

```java
private int calculateDaysBetweenDates(Date date1,
```

GitHub Copilot will show a suggestion in grayed text.

### Using the Control Panel

Hover over the suggestion to show the GitHub Copilot control. To accept only the next word, click **Accept Word**.

### Keyboard Shortcuts

| OS               | Accept Next Word | Accept Next Line     |
|------------------|------------------|----------------------|
| macOS            | `Command+Right`  | `Command+Control+Right` |
| Windows or Linux | `Control+Right`  | `Control+Alt+Right`  |

> **Note:** To accept the next line, you may need to set a custom keyboard shortcut for the command `editor.action.inlineSuggest.acceptNextLine`. See [Configuring GitHub Copilot in your environment](https://docs.github.com/en/copilot/managing-copilot/configure-personal-settings/configuring-github-copilot-in-your-environment) for more information.

---

## Next Steps

- **Learn effective prompts** - See [Prompt engineering for GitHub Copilot Chat](https://docs.github.com/en/copilot/using-github-copilot/prompt-engineering-for-github-copilot)
- **Configure Copilot** - Enable or disable GitHub Copilot and create custom keyboard shortcuts. See [Configuring GitHub Copilot in your environment](https://docs.github.com/en/copilot/managing-copilot/configure-personal-settings/configuring-github-copilot-in-your-environment)
- **Get started with Copilot Chat** - Learn how to ask Copilot for information and assistance. See [Asking GitHub Copilot questions in your IDE](https://docs.github.com/en/copilot/using-github-copilot/asking-github-copilot-questions-in-your-ide)
- **Troubleshoot issues** - Learn more about common issues with GitHub Copilot. See [Troubleshoot GitHub Copilot](https://docs.github.com/en/copilot/troubleshooting-github-copilot)

---

## Further Reading

- [GitHub Copilot code suggestions in your IDE](https://docs.github.com/en/copilot/using-github-copilot/getting-code-suggestions-in-your-ide-with-github-copilot)
