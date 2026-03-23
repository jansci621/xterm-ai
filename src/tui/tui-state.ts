import type { GlobalConfig, ResolvedSelection } from '../shared/types.js'
import type { NormalizedTool } from '../tools/tool-registry.js'

export type MainState = 'BOOT' | 'MISSING_CONFIG' | 'HOME' | 'LAUNCHING'
export type OverlayState = 'NONE' | 'TOOL_PICKER' | 'PROFILE_PICKER' | 'ERROR_DIALOG'

export interface TuiState {
  main: MainState
  overlay: OverlayState
  config: GlobalConfig
  workspacePath: string
  resolvedSelection?: ResolvedSelection
  tools: NormalizedTool[]
  lastExitCode?: number
  lastError?: string
}
