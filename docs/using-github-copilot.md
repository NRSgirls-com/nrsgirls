# Getting Code Suggestions in Your IDE with GitHub Copilot

> Use GitHub Copilot to get code suggestions in your editor.

This guide demonstrates how to get coding suggestions from GitHub Copilot in a JetBrains IDE. The examples use Java, however other languages will work similarly.

For more information, see [GitHub Copilot code suggestions in your IDE](https://docs.github.com/en/copilot/using-github-copilot/getting-code-suggestions-in-your-ide-with-github-copilot).

## Prerequisites

### Access to Copilot

To use GitHub Copilot in JetBrains, you need either limited access through Copilot Free or a paid Copilot plan for full access. See [What is GitHub Copilot?](https://docs.github.com/en/copilot/about-github-copilot/what-is-github-copilot).

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

### GitHub Copilot Extension

Install the latest version of the GitHub Copilot extension from the [JetBrains Marketplace](https://plugins.jetbrains.com/plugin/17718-github-copilot). For installation instructions, see [Installing the GitHub Copilot extension in your environment](https://docs.github.com/en/copilot/managing-copilot/configure-personal-settings/installing-the-github-copilot-extension-in-your-environment).

### Sign in to GitHub

Sign in to GitHub in your JetBrains IDE. For authentication instructions, see [Installing the GitHub Copilot extension in your environment](https://docs.github.com/en/copilot/managing-copilot/configure-personal-settings/installing-the-github-copilot-extension-in-your-environment).

## Getting Code Suggestions

GitHub Copilot offers coding suggestions as you type. For example, in a Java file, create a class by typing `class Test`.

GitHub Copilot will automatically suggest a class body in grayed text. To accept the suggestion, press **Tab**.

You can also describe something you want to do using natural language within a comment, and Copilot will suggest the code to accomplish your goal. For example, type this comment in a Java file:

```java
// find all images without alternate text
// and give them a red border
void process () {
```

GitHub Copilot will automatically suggest code. To accept the suggestion, press **Tab**.

GitHub Copilot will attempt to match the context and style of your code. You can always edit the suggested code.

> **Tip:** If you receive limited or no suggestions from Copilot, you may have duplication detection enabled. For more information about duplication detection, see [Managing GitHub Copilot policies as an individual subscriber](https://docs.github.com/en/copilot/managing-copilot/managing-copilot-as-an-individual-subscriber/managing-copilot-policies-as-an-individual-subscriber).

## Showing Alternative Suggestions

For any given input, GitHub Copilot may offer multiple suggestions. You can select which suggestion to use, or reject all suggestions.

For example, type the following line in a Java file, and press **Enter**:

```java
private int calculateDaysBetweenDates(Date date1,
```

GitHub Copilot will show you a suggestion.

Now hover over the suggestion to show the GitHub Copilot control for choosing suggestions. To display next or previous suggestions, click the forward or back arrow button in the control.

### Keyboard Shortcuts for Alternative Suggestions

| OS | See next suggestion | See previous suggestion |
|---|---|---|
| macOS | Option+] | Option+[ |
| Windows or Linux | Alt+] | Alt+[ |

To accept a suggestion, click "Accept" in the Copilot command palette, or press **Tab**. To reject all suggestions, press **Esc**.

## Showing Multiple Suggestions in a New Tab

If you don't want to use any of the initial suggestions GitHub Copilot offers, you can show multiple suggestions in a new tab.

For example, type the following line in a Java file:

```java
private int calculateDaysBetweenDates(Date date1,
```

GitHub Copilot will show you a suggestion.

To open a new tab with multiple additional suggestions, use the following keyboard shortcut, then click **Open GitHub Copilot**:

| OS | Open multiple suggestions |
|---|---|
| macOS | Command+Shift+A |
| Windows or Linux | Ctrl+Enter |

To accept a suggestion, below the suggestion, click **Accept suggestion NUMBER**. To reject all suggestions, close the tab.

## Accepting Partial Suggestions

If you don't want to accept an entire suggestion from GitHub Copilot, you can accept the next word or the next line of a suggestion.

For example, type the following line in a Java file:

```java
private int calculateDaysBetweenDates(Date date1,
```

GitHub Copilot will show a suggestion in grayed text. The exact suggestion may vary.

Now hover over the suggestion to show the GitHub Copilot control for choosing suggestions. To accept only the next word of the suggestion, click **Accept Word** in the control.

### Keyboard Shortcuts for Partial Acceptance

| OS | Accept Next Word | Accept Next Line |
|---|---|---|
| macOS | Command+Right Arrow | Command+Control+Right Arrow |
| Windows or Linux | Control+Right Arrow | Control+Alt+Right Arrow |

If you want to accept the next line of a suggestion, you will need to set a custom keyboard shortcut for the command `editor.action.inlineSuggest.acceptNextLine`. For more information on setting custom keyboard shortcuts, see [Configuring GitHub Copilot in your environment](https://docs.github.com/en/copilot/managing-copilot/configure-personal-settings/configuring-github-copilot-in-your-environment).

## Next Steps

- **Learn how to write effective prompts** - See [Prompt engineering for GitHub Copilot Chat](https://docs.github.com/en/copilot/using-github-copilot/prompt-engineering-for-github-copilot).
- **Configure Copilot in your editor** - You can enable or disable GitHub Copilot from within your editor, and create your own preferred keyboard shortcuts for Copilot. See [Configuring GitHub Copilot in your environment](https://docs.github.com/en/copilot/managing-copilot/configure-personal-settings/configuring-github-copilot-in-your-environment).
- **Get started with GitHub Copilot Chat** - Learn how to ask Copilot for information and assistance. See [Asking GitHub Copilot questions in your IDE](https://docs.github.com/en/copilot/using-github-copilot/asking-github-copilot-questions-in-your-ide).
- **Troubleshoot issues** - Learn more about how to troubleshoot common issues with GitHub Copilot. See [Troubleshoot GitHub Copilot](https://docs.github.com/en/copilot/troubleshooting-github-copilot).

---

## Related Articles

- [Using the GitHub Integration](using-github-integration.md)
- [GitHub Copilot code suggestions in your IDE](https://docs.github.com/en/copilot/using-github-copilot/getting-code-suggestions-in-your-ide-with-github-copilot)
