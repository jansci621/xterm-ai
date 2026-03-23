import { execSync } from 'node:child_process'
import type { ToolHealth } from '../../shared/types.js'
import type { NormalizedTool } from '../../tools/tool-registry.js'

/**
 * Side-effectful checks isolated in the TUI health layer.
 * Domain modules (tool-registry, resolution) remain pure.
 */

export function checkToolHealth(tool: NormalizedTool): ToolHealth {
  try {
    const path = execSync(`which ${tool.command} 2>/dev/null`, {
      encoding: 'utf8',
    }).trim()
    return { installed: !!path, commandPath: path || undefined }
  } catch {
    return { installed: false }
  }
}
