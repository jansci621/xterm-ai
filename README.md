# xTerm-AI

Terminal workspace for launching and managing AI CLIs (Claude, Codex, etc.).

[中文文档](README_CN.md)

---

## Features

- 🚀 Quick switch between multiple AI tools and profiles
- 📁 Per-workspace session persistence
- ⚙️ Settings file support for each profile
- 🎯 Tool-specific profile restrictions

---

## Install

### From npm (recommended)

```bash
npm install -g xterm-ai
```

### From source

```bash
git clone https://github.com/jansci621/xterm-ai.git
cd xterm-ai
npm install
npm run build
npm link
```

### From tarball

```bash
npm install -g xterm-ai-0.1.0.tgz
```

> **Note**: You can also create a tarball using `npm pack`:
```bash
npm pack
npm install -g xterm-ai-0.1.0.tgz
```

---

## Quick Start

```bash
# Open TUI (auto-resumes last session for current directory)
xterm-ai

# Launch a specific tool directly
xterm-ai run claude
xterm-ai run claude --profile qianfan
```

> **Note**: On first run, xterm-ai creates `~/.xterm-ai/config.json` with pre-configured profiles. You need to create settings files in `~/.claude/` with your API keys (see [Settings Files](#settings-files)).

---

## Interface

### Home

```
 xTerm-AI                                                                     Home

 Workspace ~/project/demo                                              Last never

 ─────────────────────────────────────────────────────────────────────────────────

 Tool       Claude CLI                   ok installed  · restored
 Profile    Qianfan                        · explicit

 ─────────────────────────────────────────────────────────────────────────────────

 [Enter] Launch   [t] Tool   [p] Profile   [q] Quit
```

### Tool Picker

```
 xTerm-AI                                                              Tool Picker

 ─────────────────────────────────────────────────────────────────────────────────

   ▶ Claude Native — claude
     Claude CLI — claude (current)
     Codex CLI — codex

 ─────────────────────────────────────────────────────────────────────────────────

 [Enter] Select   [↑↓] Navigate   [Esc] Cancel
```

### Profile Picker

```
 xTerm-AI                                                            Profile Picker

 ─────────────────────────────────────────────────────────────────────────────────

   ▶ Qianfan (current)
     Claude Native

 ─────────────────────────────────────────────────────────────────────────────────

 [Enter] Select   [↑↓] Navigate   [Esc] Cancel
```

### Launching

```
 xTerm-AI                                                                 Launching

 Workspace ~/project/demo

 ─────────────────────────────────────────────────────────────────────────────────

 Tool        Claude CLI
 Profile     Qianfan

 Handing off terminal control…
```

### Setup (First Run)

```
 xTerm-AI                                                              Setup Required

 ─────────────────────────────────────────────────────────────────────────────────

 Configuration created.
 A starter config has been written to ~/.xterm-ai/config.json
 Create settings files in ~/.claude/ with your API keys:
   • settings-native.json (Claude Native)
   • settings-qianfan.json (Qianfan)
 Then run xterm-ai again.

 ─────────────────────────────────────────────────────────────────────────────────

 [q] Quit
```

---

## Configuration

On first run, xterm-ai creates `~/.xterm-ai/config.json` with pre-configured profiles for common vendors. You need to create the corresponding settings files with your API keys.

### Complete Example

```json
{
  "version": 1,
  "profiles": {
    "claude-native": {
      "label": "Claude Native",
      "settingsPath": "~/.claude/settings-native.json"
    },
    "qianfan": {
      "label": "Qianfan",
      "settingsPath": "~/.claude/settings-qianfan.json"
    }
  },
  "tools": {
    "claude-native": {
      "label": "Claude Native",
      "command": "claude",
      "settingsArg": "--settings",
      "allowedProfiles": ["claude-native"]
    },
    "claude": {
      "label": "Claude CLI",
      "command": "claude",
      "settingsArg": "--settings",
      "allowedProfiles": ["qianfan"]
    },
    "codex": {
      "label": "Codex CLI",
      "command": "codex"
    }
  }
}
```

### Profile Configuration

| Field | Type | Description |
|-------|------|-------------|
| `label` | string | Display name in TUI |
| `settingsPath` | string | Path to settings file |

### Tool Configuration

| Field | Type | Description |
|-------|------|-------------|
| `label` | string | Display name in TUI |
| `command` | string | CLI command to execute |
| `args` | string[] | Additional arguments |
| `settingsArg` | string | Argument name for settings file (e.g., `--settings`) |
| `defaultProfile` | string | Default profile ID |
| `allowedProfiles` | string[] | Allowed profile IDs. Empty or not set = profile disabled |

### Settings Files

Create settings files for each profile in `~/.claude/`:

**Native Claude (settings-native.json):**
```json
{
  "permissions": {
    "allow": ["Bash(find:*)"]
  }
}
```

**Qianfan (settings-qianfan.json):**
```json
{
  "env": {
    "ANTHROPIC_API_KEY": "your-qianfan-api-key",
    "ANTHROPIC_BASE_URL": "https://qianfan.baidubce.com/anthropic",
    "ANTHROPIC_MODEL": "qianfan-code-latest"
  }
}
```

---

## TUI Shortcuts

| Key | Action |
|-----|--------|
| `Enter` | Launch tool |
| `t` | Switch tool |
| `p` | Switch profile |
| `q` | Quit |
| `↑↓` | Navigate picker |
| `Esc` | Close picker |

---

## How It Works

- Sessions are stored per workspace in `~/.xterm-ai/sessions.json`
- When you open a workspace, xterm-ai auto-resumes the last tool + profile
- Settings files are passed via `--settings` argument to the CLI
- Conversation history stays in the external tool — xterm-ai only manages launch metadata

---

## Tips

- Delete `~/.claude/settings.json` to avoid conflicts with profile-specific settings
- Use `claude-native` tool for original Claude API, `claude` tool for switching between vendors

---

## License

MIT
