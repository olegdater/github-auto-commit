#!/usr/bin/env node

const { execSync } = require('child_process');
const axios = require('axios');
const { CLIENT_RENEG_LIMIT } = require('tls');

async function autoCommit() {
    // Check if ANTHROPIC_API_KEY is set
    if (!process.env.ANTHROPIC_API_KEY) {
        console.error("Error: ANTHROPIC_API_KEY is not set. Please set it in your environment.");
        return 1;
    }
    // Get the current git diff
    let diffOutput;
    try {
        execSync('git add -A');
        diffOutput = execSync('git diff --staged').toString();
    } catch (error) {
        console.error("Error getting git diff:", error.message);
        return 1;
    }


    // Check if there are any changes
    if (!diffOutput.trim()) {
        console.log("No changes to commit.");
        return 0;
    }

    const prompt = `Generate a concise git commit message from this diff. Follow these rules:
- Use conventional commit format: type: description
- Types: feat, fix, refactor, docs, style, test, chore
- Keep each line under 72 characters
- Can be multiple lines if needed (but keep it brief)
- No empty lines between lines
- Output ONLY the commit message, no explanations or quotes

Git diff:
${diffOutput}`;


    // Use Claude API to summarize the changes
    let response;
    try {
        response = await axios.post('https://api.anthropic.com/v1/messages', {
            model: "claude-sonnet-4-5-20250929",
            max_tokens: 1024,
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ]
        }, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01'
            }
        });
    } catch (error) {
        console.error("Error calling Claude API: ", error.message);
        // console.error(error);
        return 1;
    }


    const summary = response.data.content[0].text.replace(/['"`;$&|<>]/g, '').replace(/'/g, "\\'");

    // Commit the changes with the generated summary
    try {
        execSync(`git commit -m "${summary}"`);
        
        // Check if AUTO_COMMIT_PUSH_DISABLED is set to 'disabled'
        const shouldPush = process.env.AUTO_COMMIT_PUSH_DISABLED !== 'disabled';
        
        if (shouldPush) {
            execSync('git push');
            console.log("[auto-commit] Changes committed and pushed with the following summary:");
        } else {
            console.log("[auto-commit] Changes committed (push skipped) with the following summary:");
        }
    } catch (error) {
        console.error("Error committing or pushing changes:", error.message);
        return 1;
    }

    console.log("-> " + summary);
}

// Export the function for use as a module
module.exports = autoCommit;

// Run the function if called directly
if (require.main === module) {
    autoCommit().catch(console.error);
}
