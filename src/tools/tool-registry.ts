/**
 * tool-registry — pure read model
 *
 * Input:  GlobalConfig
 * Output: NormalizedTool[]
 *
 * No file IO, no process calls, no side effects.
 * Availability checks (which <command>) live in tui/health/health-display.ts.
 */
import type { GlobalConfig, ToolConfig } from '../shared/types.js'
import { ToolNotFoundError } from '../shared/errors.js'

export interface NormalizedTool {
  id: string
  label: string
  command: string
  args: string[]
  defaultProfile?: string
}

export function listTools(config: GlobalConfig): NormalizedTool[] {
  return Object.entries(config.tools).map(([id, tool]) => normalize(id, tool))
}

export function findTool(config: GlobalConfig, toolId: string): NormalizedTool {
  const tool = config.tools[toolId]
  if (!tool) throw new ToolNotFoundError(toolId)
  return normalize(toolId, tool)
}

function normalize(id: string, tool: ToolConfig): NormalizedTool {
  return {
    id,
    label: tool.label ?? id,
    command: tool.command,
    args: tool.args ?? [],
    defaultProfile: tool.defaultProfile,
  }
}
