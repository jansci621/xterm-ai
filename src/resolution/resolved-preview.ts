import type { ResolvedSelection } from '../shared/types.js'

export interface ResolvedPreview {
  workspacePath: string
  toolId: string
  toolLabel: string
  command: string
  profileId: string
  profileLabel: string
  toolSource: string
  profileSource: string
}

export function buildResolvedPreview(selection: ResolvedSelection): ResolvedPreview {
  const { tool, profile, toolSource, profileSource } = selection

  return {
    workspacePath: selection.workspacePath,
    toolId: selection.toolId,
    toolLabel: tool.label ?? selection.toolId,
    command: tool.command,
    profileId: selection.profileId,
    profileLabel: profile.label ?? selection.profileId,
    toolSource,
    profileSource,
  }
}
