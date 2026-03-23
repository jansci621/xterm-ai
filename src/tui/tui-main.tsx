/**
 * TUI entry point — boots the Ink app with initial resolved state.
 *
 * Called by cli-main.ts when no subcommand is given (default TUI mode).
 * All async setup happens here before render so the App component stays pure.
 */
import React from 'react'
import { render } from 'ink'
import { loadConfig, writeStarterConfig } from '../config/config-loader.js'
import type { GlobalConfig } from '../shared/types.js'
import { getWorkspaceSession } from '../sessions/session-store.js'
import { listTools } from '../tools/tool-registry.js'
import { resolveSelection } from '../resolution/selection-resolver.js'
import { ConfigNotFoundError } from '../shared/errors.js'
import type { TuiState } from './tui-state.js'
import { App } from './App.js'

export async function startTui(workspacePath: string): Promise<void> {
  let state: TuiState

  try {
    const config = await loadConfig()
    const session = await getWorkspaceSession(workspacePath)
    const tools = listTools(config)

    let resolvedSelection
    try {
      resolvedSelection = resolveSelection({
        config,
        workspacePath,
        session,
      })
    } catch {
      // Resolution can fail if config has no tools — handled in HOME view
      resolvedSelection = undefined
    }

    state = {
      main: resolvedSelection ? 'HOME' : 'MISSING_CONFIG',
      overlay: 'NONE',
      config,
      workspacePath,
      resolvedSelection,
      tools,
    }
  } catch (err) {
    if (err instanceof ConfigNotFoundError) {
      // Write starter config and show setup screen
      const starterConfig: GlobalConfig = { version: 1, profiles: {}, tools: {} }
      await writeStarterConfig(starterConfig)

      state = {
        main: 'MISSING_CONFIG',
        overlay: 'NONE',
        config: starterConfig,
        workspacePath,
        resolvedSelection: undefined,
        tools: [],
      }
    } else {
      throw err
    }
  }

  const { waitUntilExit } = render(<App initialState={state} />)
  await waitUntilExit()
}
