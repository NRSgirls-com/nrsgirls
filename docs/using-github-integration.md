# Using the GitHub Integration

> For more information on enabling GitHub within your account, see Setting Up Claude Integrations.

Connect your GitHub repositories directly to Claude to provide comprehensive context for your software development tasks. You can easily add repositories by selecting them from a list, helping Claude better understand and assist with your codebase.

## How to Add GitHub Repositories

> **Note:** If you're currently unauthenticated with GitHub, you'll be redirected to GitHub to authenticate before you can use this integration.

### Chats

1. Click the "+" button on the lower left corner of the chat interface.
2. Select "Add from GitHub" from the drop-down.
3. Use the file browser to select specific files and folders.
4. When you send your message, Claude will access and process the content to inform its response.

### Projects

1. Click the "+" button in the upper right corner of your project knowledge section.
2. Select "GitHub" from the drop-down.
3. Search through your accessible repositories, or paste a repository URL.
4. Use the file browser to select specific files and folders.
5. Your selected content will be added to the project knowledge for Claude to access and process.

**Sync Icon:** Use the "Sync" icon to ensure you're working with the most up-to-date version of your codebase.

**Configure Files Icon:** Use the "Configure files" icon to modify which files and folders Claude analyzes.

## Connecting to Private Repositories

If you see a warning after inputting a valid URL, it most likely means you're attempting to connect Claude to a private repository.

Follow the link to our GitHub App, where you can grant access to repos if you're a GitHub administrator, or send a request to your GitHub organization's administrators.

### Grant Access Yourself (If You Have Permissions)

You can choose between letting Claude access all repos or specific ones.

### Request Access (If You Don't Have Permissions)

The administrators of your GitHub organization will receive an email notification about your request. Once they approve the request, you'll be able to sync and access the repository in Claude.

## Best Practices

- **Start small:** Begin by selecting a small subset of your codebase to analyze. This will help you get familiar with how Claude interprets and discusses your code.

- **Iterate and refine:** If Claude's initial response doesn't fully address your question, don't hesitate to ask follow-up questions or request clarification.

- **Combine with human expertise:** Use Claude's insights as a starting point for further investigation and discussion with your team. Please review Claude's work.

- **Thoughtful file selection:** When using "Configure files", be strategic about your selections. Include key files and directories that are central to your current task or project, but avoid selecting unnecessary files to keep within token limits and maintain focus.

- **Regular updates:** Remember to refresh your project's GitHub sync periodically to ensure Claude is working with the most up-to-date version of your codebase and especially before starting a new analysis or when you know there have been significant changes to your repo.

## Frequently Asked Questions

### Q: What information is retrieved from GitHub?

Only files (names and contents) in a repo on a specific branch are synced. We do not retrieve commit history, PRs, or other metadata.

### Q: What happens if my repository is updated after adding it to a project?

You can click "Sync now" to fetch the latest changes from your repository. This will update all previously selected files and folders.

### Q: Can I add multiple repositories to a single project or chat?

Yes, you can add multiple repositories to provide Claude with comprehensive context for your development tasks. The repositories must fit within Claude's context window.

### Q: What happens if I lose access to a repository?

If you lose access to a repository, you won't be able to view its contents in projects where it was previously added. The repository preview will be removed, though the conversation history will be maintained.

---

> **Note:** All Claude integrations are currently in beta.

## Related Articles

- Using the Google Drive Integration
- Automated Security Reviews in Claude Code
- Claude Code FAQ
- Claude Code on the web
