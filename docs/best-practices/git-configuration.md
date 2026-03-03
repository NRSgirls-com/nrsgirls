# Git Configuration Guide

Recommended Git configuration for all NRSgirls contributors. Run these commands after cloning the repository to ensure a consistent development experience.

## Required Setup

```bash
# Identity (use your real name and GitHub email)
git config user.name "Your Name"
git config user.email "you@example.com"

# Default branch name
git config init.defaultBranch main
```

## Recommended Client Settings

```bash
# Editor — set to your preferred editor
git config --global core.editor "code --wait"   # VS Code
# git config --global core.editor "vim"          # Vim
# git config --global core.editor "nano"         # Nano

# Pager — use less with better defaults
git config --global core.pager "less -FRX"

# Auto-correct mistyped commands after 1.5 seconds
git config --global help.autocorrect 15

# Colorized output
git config --global color.ui auto
```

## Line Endings

Cross-platform consistency is critical. The `.gitattributes` file at the repo root enforces line-ending rules, but set your local config as a safety net:

```bash
# macOS / Linux — convert CRLF to LF on commit, no conversion on checkout
git config --global core.autocrlf input

# Windows — convert LF to CRLF on checkout, CRLF to LF on commit
git config --global core.autocrlf true
```

## Whitespace

```bash
# Detect trailing whitespace, blank lines at EOF, and spaces before tabs
git config --global core.whitespace trailing-space,blank-at-eof,space-before-tab
```

## Merge and Diff

```bash
# Show common ancestor in merge conflicts (makes conflicts easier to read)
git config --global merge.conflictstyle diff3

# Reuse recorded resolution — Git remembers how you resolved a conflict
git config --global rerere.enabled true
```

## Pull Strategy

```bash
# Default to rebase on pull to keep a linear history
git config --global pull.rebase true
```

## Commit Signing (Optional)

If you have a GPG key, sign your commits:

```bash
git config --global user.signingkey <your-gpg-key-id>
git config --global commit.gpgsign true
```

## Global Gitignore

Create a personal global gitignore so OS and editor files never pollute the repo:

```bash
# Create the file
cat > ~/.gitignore_global << 'EOF'
# macOS
.DS_Store
._*

# Windows
Thumbs.db
Desktop.ini

# Editors
*.swp
*.swo
*~
.idea/
.vscode/
*.sublime-workspace

# Environment
.env.local
.env.*.local
EOF

# Tell Git to use it
git config --global core.excludesfile ~/.gitignore_global
```

## Commit Message Template

Use the project commit template for consistent messages:

```bash
git config commit.template .gitmessage
```

If the template file does not yet exist, create `.gitmessage` in the repo root:

```
<type>: <subject>

# Types: feat, fix, docs, chore, refactor, test, style, perf
# Subject: imperative mood, no period, under 50 chars
#
# Body (optional): explain *why*, not *what*
#
# Footer (optional): references, breaking changes
# Refs: #123
```

## Aliases (Optional Productivity Boosters)

```bash
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.lg "log --oneline --graph --decorate --all"
git config --global alias.last "log -1 HEAD --stat"
git config --global alias.unstage "reset HEAD --"
```

## Verifying Your Configuration

```bash
# Show all effective settings and where they come from
git config --list --show-origin

# Check a specific value
git config user.name
git config core.autocrlf
```

## Further Reading

- [Git Documentation — git-config](https://git-scm.com/docs/git-config)
- [Pro Git Book — Customizing Git](https://git-scm.com/book/en/v2/Customizing-Git-Git-Configuration)
