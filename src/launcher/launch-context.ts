import { existsSync } from 'node:fs'
import type { ResolvedSelection, LaunchContext } from '../shared/types.js'
import { expandPath } from '../utils/path-utils.js'
import { LaunchError } from '../shared/errors.js'

export function buildLaunchContext(selection: ResolvedSelection): LaunchContext {
  const { tool, profile, workspacePath, toolId, profileId } = selection

  // Build args array
  const args = [...(tool.args ?? [])]

  // Add settings argument if profile has settingsPath and tool has settingsArg
  if (profile.settingsPath && tool.settingsArg) {
    const expandedPath = expandPath(profile.settingsPath)

    // Validate settings file exists
    if (!existsSync(expandedPath)) {
      throw new LaunchError(
        `Settings file not found: ${profile.settingsPath}\n` +
        `Create it with your API credentials. See README for format.`
      )
    }

    args.push(tool.settingsArg, expandedPath)
  }

  return {
    workspacePath,
    command: tool.command,
    args,
    env: {},
    toolId,
    profileId,
  }
}
