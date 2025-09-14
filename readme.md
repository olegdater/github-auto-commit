# auto-commit-cli

Automatically commit and push changes using AI-generated commit messages.

NOTE: All files will be staged before the commit is made.

The Anthropic API is used to generate the commit message. Therefore, you will need to have an Anthropic API key.


## Installation

```bash
npm install -g https://github.com/olegdater/github-auto-commit.git
sudo npm install -g https://github.com/olegdater/github-auto-commit.git
```

### Setting your environment variables

```bash
### locally
export ANTHROPIC_API_KEY="xxx" # set your Anthropic API key
export AUTO_COMMIT_PUSH_DISABLED="disabled" # optional: set to "disabled" to skip pushing to remote

### in .zshrc or .bashrc
echo "export ANTHROPIC_API_KEY='xxx'" >> ~/.zshrc # or ~/.bashrc
echo "export AUTO_COMMIT_PUSH_DISABLED='disabled'" >> ~/.zshrc # optional: skip pushing
source ~/.zshrc # or ~/.bashrc
```

#### Environment Variables

- `ANTHROPIC_API_KEY` (required): Your Anthropic API key for generating commit messages
- `AUTO_COMMIT_PUSH_DISABLED` (optional): Controls whether to push commits to remote repository
  - Default behavior: push to remote (when not set or set to any value except "disabled")
  - Set to "disabled" to skip pushing and only commit locally

## Usage

```bash
auto-commit
```

### Optional: Create an alias

```bash
echo "alias ac='auto-commit'" >> ~/.zshrc # or ~/.bashrc
source ~/.zshrc # or ~/.bashrc

ac
```