# xTerm

终端工作台，用于启动和管理多个 AI CLI 工具（Claude, Codex 等）。

[English](README.md)

---

## 功能特性

- 🚀 多 AI 工具和配置快速切换
- 📁 按工作区持久化会话
- ⚙️ 支持为每个配置指定 settings 文件
- 🎯 工具级别的配置限制

---

## 安装

### 从 npm 安装（推荐）

```bash
npm install -g xterm
```

### 从源码安装

```bash
git clone https://github.com/yourusername/xterm.git
cd xterm
npm install
npm run build
npm link
```

### 从安装包安装

```bash
npm install -g xterm-0.1.0.tgz
```

---

## 快速开始

```bash
# 打开 TUI（自动恢复当前目录的上次会话）
xterm

# 直接启动指定工具
xterm run claude
xterm run claude --profile qianfan
```

---

## 界面展示

### 主界面

```
 xTerm                                                                        Home

 Workspace ~/project/demo                                              Last never

 ─────────────────────────────────────────────────────────────────────────────────

 Tool       Claude CLI                   ok installed  · restored
 Profile    千帆                           · explicit

 ─────────────────────────────────────────────────────────────────────────────────

 [Enter] Launch   [t] Tool   [p] Profile   [q] Quit
```

### 工具选择器

```
 xTerm                                                                   Tool Picker

 ─────────────────────────────────────────────────────────────────────────────────

   ▶ Claude 原生 — claude
     Claude CLI — claude (current)
     Codex CLI — codex

 ─────────────────────────────────────────────────────────────────────────────────

 [Enter] Select   [↑↓] Navigate   [Esc] Cancel
```

### 配置选择器

```
 xTerm                                                                 Profile Picker

 ─────────────────────────────────────────────────────────────────────────────────

   ▶ 智谱 GLM (current)
     千帆

 ─────────────────────────────────────────────────────────────────────────────────

 [Enter] Select   [↑↓] Navigate   [Esc] Cancel
```

### 启动中

```
 xTerm                                                                    Launching

 Workspace ~/project/demo

 ─────────────────────────────────────────────────────────────────────────────────

 Command     claude
 Tool        Claude CLI
 Profile     千帆

 Handing off terminal control…
```

---

## 配置

首次运行时，xterm 会在 `~/.xterm/config.json` 创建初始配置文件。

### 完整示例

```json
{
  "version": 1,
  "profiles": {
    "claude-native": {
      "label": "Claude 原生",
      "settingsPath": "~/.claude/settings-native.json"
    },
    "zhipu-glm": {
      "label": "智谱 GLM",
      "settingsPath": "~/.claude/settings-glm.json"
    },
    "qianfan": {
      "label": "千帆",
      "settingsPath": "~/.claude/settings-qianfan.json"
    }
  },
  "tools": {
    "claude-native": {
      "label": "Claude 原生",
      "command": "claude",
      "settingsArg": "--settings",
      "allowedProfiles": ["claude-native"]
    },
    "claude": {
      "label": "Claude CLI",
      "command": "claude",
      "settingsArg": "--settings",
      "allowedProfiles": ["qianfan", "zhipu-glm"]
    },
    "codex": {
      "label": "Codex CLI",
      "command": "codex"
    }
  }
}
```

### Profile 配置

| 字段 | 类型 | 描述 |
|-------|------|------|
| `label` | string | TUI 显示名称 |
| `settingsPath` | string | settings 文件路径 |

### Tool 配置

| 字段 | 类型 | 描述 |
|-------|------|------|
| `label` | string | TUI 显示名称 |
| `command` | string | 要执行的 CLI 命令 |
| `args` | string[] | 额外参数 |
| `settingsArg` | string | settings 文件参数名（如 `--settings`） |
| `defaultProfile` | string | 默认 profile ID |
| `allowedProfiles` | string[] | 允许的 profile 列表，为空则禁用 profile 选择 |

### Settings 文件

在 `~/.claude/` 目录下为每个 profile 创建 settings 文件：

**Claude 原生 (settings-native.json):**
```json
{
  "permissions": {
    "allow": ["Bash(find:*)"]
  }
}
```

**千帆 (settings-qianfan.json):**
```json
{
  "env": {
    "ANTHROPIC_API_KEY": "your-qianfan-api-key",
    "ANTHROPIC_BASE_URL": "https://qianfan.baidubce.com/anthropic",
    "ANTHROPIC_MODEL": "qianfan-code-latest"
  }
}
```

**智谱 GLM (settings-glm.json):**
```json
{
  "env": {
    "ANTHROPIC_API_KEY": "your-zhipu-api-key",
    "ANTHROPIC_BASE_URL": "https://open.bigmodel.cn/api/anthropic",
    "ANTHROPIC_MODEL": "glm-5"
  }
}
```

---

## 快捷键

| 按键 | 操作 |
|-----|------|
| `Enter` | 启动工具 |
| `t` | 切换工具 |
| `p` | 切换配置 |
| `q` | 退出 |
| `↑↓` | 导航选择 |
| `Esc` | 关闭选择器 |

---

## 工作原理

- 会话按工作区存储在 `~/.xterm/sessions.json`
- 打开工作区时自动恢复上次的工具和配置
- settings 文件通过 `--settings` 参数传递给 CLI
- 对话历史保留在外部工具中，xterm 仅管理启动元数据

---

## 小贴士

- 删除 `~/.claude/settings.json` 避免与 profile settings 冲突
- 使用 `claude-native` 工具连接原生 Claude API，`claude` 工具切换不同厂商

---

## 许可证

MIT
