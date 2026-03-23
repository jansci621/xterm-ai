import type {
  GlobalConfig,
  WorkspaceSession,
  ResolvedSelection,
  ProfileConfig,
} from '../shared/types.js'
import {
  ToolNotFoundError,
  ProfileNotFoundError,
  NoToolsConfiguredError,
} from '../shared/errors.js'

export interface SelectionInput {
  config: GlobalConfig
  workspacePath: string
  session?: WorkspaceSession
  explicitToolId?: string
  explicitProfileId?: string
}

/**
 * Check if a profile is allowed for a tool based on allowedProfiles config.
 */
function isProfileAllowedForTool(
  profileId: string,
  tool: { allowedProfiles?: string[] },
): boolean {
  // If allowedProfiles is not set, all profiles are allowed
  if (!tool.allowedProfiles) return true
  return tool.allowedProfiles.includes(profileId)
}

/**
 * Get the first allowed profile for a tool.
 * Returns null if allowedProfiles is not configured or empty (profile not supported).
 */
function getFirstAllowedProfile(
  config: GlobalConfig,
  tool: { allowedProfiles?: string[] },
): { profileId: string; profile: ProfileConfig } | null {
  // If allowedProfiles is not set or empty, profile is not supported for this tool
  if (!tool.allowedProfiles || tool.allowedProfiles.length === 0) {
    return null
  }

  // Return first allowed profile that exists
  for (const profileId of tool.allowedProfiles) {
    const profile = config.profiles[profileId]
    if (profile) {
      return { profileId, profile }
    }
  }
  return null
}

/**
 * Resolve the effective tool and profile for a workspace.
 *
 * Precedence:
 *   1. explicit user choice (CLI flag or TUI selection)
 *   2. workspace session state (lastTool / lastProfile)
 *   3. tool's defaultProfile
 *   4. first available fallback
 */
export function resolveSelection(input: SelectionInput): ResolvedSelection {
  const { config, workspacePath, session, explicitToolId, explicitProfileId } = input

  // ── Tool ─────────────────────────────────────────────────────────────────────
  let toolId: string
  let toolSource: ResolvedSelection['toolSource']

  if (explicitToolId) {
    if (!config.tools[explicitToolId]) throw new ToolNotFoundError(explicitToolId)
    toolId = explicitToolId
    toolSource = 'explicit'
  } else if (session?.lastTool && config.tools[session.lastTool]) {
    toolId = session.lastTool
    toolSource = 'session'
  } else {
    const first = Object.keys(config.tools)[0]
    if (!first) throw new NoToolsConfiguredError()
    toolId = first
    toolSource = 'fallback'
  }

  const tool = config.tools[toolId]!

  // ── Profile ───────────────────────────────────────────────────────────────────
  let profileId: string
  let profileSource: ResolvedSelection['profileSource']
  let profile: ProfileConfig

  if (explicitProfileId) {
    if (!config.profiles[explicitProfileId])
      throw new ProfileNotFoundError(explicitProfileId)
    // Validate that explicit profile is allowed for this tool
    if (!isProfileAllowedForTool(explicitProfileId, tool)) {
      // If not allowed, fall through to select first allowed profile
    } else {
      profileId = explicitProfileId
      profileSource = 'explicit'
      profile = config.profiles[explicitProfileId]!
      return { workspacePath, toolId, tool, profileId, profile, toolSource, profileSource }
    }
  }

  // Check session profile (if allowed for current tool)
  if (session?.lastProfile && config.profiles[session.lastProfile]) {
    if (isProfileAllowedForTool(session.lastProfile, tool)) {
      profileId = session.lastProfile
      profileSource = 'session'
      profile = config.profiles[session.lastProfile]!
      return { workspacePath, toolId, tool, profileId, profile, toolSource, profileSource }
    }
  }

  // Check tool's defaultProfile (if allowed)
  if (tool.defaultProfile && config.profiles[tool.defaultProfile]) {
    if (isProfileAllowedForTool(tool.defaultProfile, tool)) {
      profileId = tool.defaultProfile
      profileSource = 'toolDefault'
      profile = config.profiles[tool.defaultProfile]!
      return { workspacePath, toolId, tool, profileId, profile, toolSource, profileSource }
    }
  }

  // Fall back to first allowed profile
  const firstAllowed = getFirstAllowedProfile(config, tool)
  if (firstAllowed) {
    profileId = firstAllowed.profileId
    profileSource = 'fallback'
    profile = firstAllowed.profile
  } else {
    // No profiles at all — still valid, env injection will be empty
    profileId = '__none__'
    profileSource = 'fallback'
    profile = {}
  }

  return { workspacePath, toolId, tool, profileId, profile, toolSource, profileSource }
}
