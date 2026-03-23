// ─── Profile ─────────────────────────────────────────────────────────────────

export interface ProfileConfig {
  label?: string
  // Path to a settings file to pass to the tool (e.g., Claude settings file)
  settingsPath?: string
}

// ─── Tool ────────────────────────────────────────────────────────────────────

export interface ToolConfig {
  label?: string
  command: string
  args?: string[]
  defaultProfile?: string
  // Argument name for settings file (e.g., "--settings" for Claude CLI)
  settingsArg?: string
  // List of profile IDs allowed for this tool. If not set or empty, profile is not supported.
  allowedProfiles?: string[]
}

// ─── Global Config ────────────────────────────────────────────────────────────

export interface GlobalConfig {
  version: 1
  profiles: Record<string, ProfileConfig>
  tools: Record<string, ToolConfig>
}

// ─── Session ──────────────────────────────────────────────────────────────────

export interface WorkspaceSession {
  lastTool?: string
  lastProfile?: string
  lastLaunchedAt?: string
  lastExitCode?: number
}

export interface SessionStore {
  version: 1
  workspaces: Record<string, WorkspaceSession>
}

// ─── Resolution ───────────────────────────────────────────────────────────────

export type SelectionSource = 'explicit' | 'session' | 'toolDefault' | 'fallback'

export interface ResolvedSelection {
  workspacePath: string
  toolId: string
  tool: ToolConfig
  profileId: string
  profile: ProfileConfig
  toolSource: SelectionSource
  profileSource: SelectionSource
}

// ─── Launch Context ───────────────────────────────────────────────────────────

export interface LaunchContext {
  workspacePath: string
  command: string
  args: string[]
  env: Record<string, string>
  toolId: string
  profileId: string
}

// ─── Health ───────────────────────────────────────────────────────────────────

export interface ToolHealth {
  installed: boolean
  commandPath?: string
}
