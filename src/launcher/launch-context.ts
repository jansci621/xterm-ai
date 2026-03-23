import type { ResolvedSelection, LaunchContext } from '../shared/types.js'
import { expandPath } from '../utils/path-utils.js'

export function buildLaunchContext(selection: ResolvedSelection): LaunchContext {
  const { tool, profile, workspacePath, toolId, profileId } = selection

  // Build args array
  const args = [...(tool.args ?? [])]

  // Add settings argument if profile has settingsPath and tool has settingsArg
  if (profile.settingsPath && tool.settingsArg) {
    const expandedPath = expandPath(profile.settingsPath)
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
