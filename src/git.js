const utils = require('corifeus-utils');
const path = require('path');
const { execSync } = require('child_process');

const getMainBranch = () => {
    try {
        execSync('git rev-parse --verify main 2>/dev/null', { stdio: 'pipe' });
        return 'main';
    } catch(e) {
        return 'master';
    }
}

const claudeCommitSnippet = (fallback = 'r0b08x', diffCommand = 'git diff --cached --stat 2>/dev/null || true') => {
    return `COMMIT_MSG_FILE=$(mktemp)
echo "${fallback}" > "$COMMIT_MSG_FILE"
P3X_CLAUDE_RC="$HOME/.p3x-claude-rc"
if [ -f "$P3X_CLAUDE_RC" ]; then
  P3X_DIFF=$(${diffCommand})
  if [ -n "$P3X_DIFF" ]; then
    P3X_SCRIPT=$(mktemp)
    cat > "$P3X_SCRIPT" << P3X_NODE_SCRIPT
(async () => {
  try {
    var fs = require("fs");
    var apiKey = fs.readFileSync(process.env.HOME + "/.p3x-claude-rc", "utf8").trim();
    var diff = process.env.P3X_DIFF_DATA;
    var resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 300,
        messages: [{
          role: "user",
          content: "Generate a git commit message for these changes. Use conventional commit style. First line is a short summary (max 72 chars), then a blank line, then bullet points describing the changes in detail. Do not use markdown code fences. Output ONLY the commit message, no extra commentary.\\n\\n" + diff
        }]
      })
    });
    var data = await resp.json();
    if (data.content && data.content[0]) process.stdout.write(data.content[0].text);
  } catch(e) {}
})();
P3X_NODE_SCRIPT
    P3X_MSG=$(P3X_DIFF_DATA="$P3X_DIFF" node "$P3X_SCRIPT" 2>/dev/null || true)
    rm -f "$P3X_SCRIPT"
    if [ -n "$P3X_MSG" ]; then
      echo "$P3X_MSG" > "$COMMIT_MSG_FILE"
    fi
  fi
elif command -v claude >/dev/null 2>&1; then
  P3X_DIFF=$(${diffCommand})
  P3X_MSG=$(claude -p "Generate a git commit message for these changes. Use conventional commit style. First line is a short summary (max 72 chars), then a blank line, then bullet points describing the changes in detail. Do not use markdown code fences. Output ONLY the commit message, no extra commentary.

$P3X_DIFF" --no-session-persistence 2>/dev/null || true)
  if [ -n "$P3X_MSG" ]; then
    echo "$P3X_MSG" > "$COMMIT_MSG_FILE"
  fi
fi`;
}

const truncate = async (options) => {
    const mainBranch = getMainBranch();

    const command = `git config --global credential.helper 'cache --timeout 7200'
git checkout --orphan temp
git add -A
${claudeCommitSnippet('r0b08x (truncate)')}
git commit -a -F "$COMMIT_MSG_FILE"
rm -f "$COMMIT_MSG_FILE"
git branch -D ${mainBranch}
git branch -m ${mainBranch}
git branch --set-upstream-to origin/${mainBranch} ${mainBranch}
git push -f origin ${mainBranch}`

    console.log(command);
    if (!options.dry) {
        await utils.childProcess.exec(command, {
            display: true,
            maxBuffer: 1024 * 500,
        })
    }
}

const findModules = async (root) => {
    const { globby } = await import('globby')
    const glob = globby

    const modules = await glob(`${root}/**/.gitmodules`);
    return modules.map((dir) => {
        return path.dirname(dir);
    });
}


module.exports.findModules = findModules;
module.exports.truncate = truncate;
module.exports.getMainBranch = getMainBranch;
module.exports.claudeCommitSnippet = claudeCommitSnippet;
