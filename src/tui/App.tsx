import React, { useState, useCallback } from 'react'
import { Box, Text, useApp } from 'ink'
import type { TuiState } from './tui-state.js'
import type { ResolvedSelection } from '../shared/types.js'
import { resolveSelection } from '../resolution/selection-resolver.js'
import { saveWorkspaceSession } from '../sessions/session-store.js'
import { buildLaunchContext } from '../launcher/launch-context.js'
import { launchExternalTool } from '../launcher/process-launcher.js'
import { HomeView } from './views/home-view.js'
import { LaunchingView } from './views/launching-view.js'
import { ToolPickerOverlay } from './overlays/tool-picker-overlay.js'
import { ProfilePickerOverlay } from './overlays/profile-picker-overlay.js'
import { colors } from './theme.js'

interface AppProps {
  initialState: TuiState
}

export function App({ initialState }: AppProps) {
  const { exit } = useApp()
  const [state, setState] = useState<TuiState>(initialState)

  // ── Helpers ────────────────────────────────────────────────────────────────

  const updateSelection = useCallback(
    (toolId: string, profileId: string, source: 'explicit' | 'session' | 'toolDefault' | 'fallback' = 'explicit') => {
      try {
        const resolved = resolveSelection({
          config: state.config,
          workspacePath: state.workspacePath,
          explicitToolId: toolId,
          explicitProfileId: profileId,
        })
        setState((prev) => ({
          ...prev,
          resolvedSelection: resolved,
          overlay: 'NONE',
        }))
      } catch (err) {
        setState((prev) => ({
          ...prev,
          overlay: 'NONE',
          lastError: err instanceof Error ? err.message : String(err),
        }))
      }
    },
    [state.config, state.workspacePath],
  )

  // ── Launch flow ────────────────────────────────────────────────────────────

  const handleLaunch = useCallback(async () => {
    if (!state.resolvedSelection) return

    const selection = state.resolvedSelection

    // Save pre-launch session
    await saveWorkspaceSession(state.workspacePath, {
      lastTool: selection.toolId,
      lastProfile: selection.profileId,
      lastLaunchedAt: new Date().toISOString(),
    })

    // Exit TUI immediately to free the terminal for the external tool.
    // Without this, setState + launchExternalTool race each other:
    // React hasn't unmounted the TUI yet, but the child process already
    // took over stdio — causing "Handing off terminal control…" to hang.
    exit()

    const context = buildLaunchContext(selection)
    const result = await launchExternalTool(context)

    // Save exit code
    await saveWorkspaceSession(state.workspacePath, {
      lastExitCode: result.exitCode ?? undefined,
    })

    // Note: after exit() the TUI is unmounted; to return to the TUI we would
    // need to re-render here. For now, the process exits — the user runs
    // `xterm` again to relaunch.
  }, [state.resolvedSelection, state.workspacePath])

  // ── Tool picker ────────────────────────────────────────────────────────────

  const handleSelectTool = useCallback(
    (toolId: string) => {
      // Don't pass profileId - let resolveSelection pick the first allowed profile
      try {
        const resolved = resolveSelection({
          config: state.config,
          workspacePath: state.workspacePath,
          explicitToolId: toolId,
        })
        setState((prev) => ({
          ...prev,
          resolvedSelection: resolved,
          overlay: 'NONE',
        }))
      } catch (err) {
        setState((prev) => ({
          ...prev,
          overlay: 'NONE',
          lastError: err instanceof Error ? err.message : String(err),
        }))
      }
    },
    [state.config, state.workspacePath],
  )

  // ── Profile picker ─────────────────────────────────────────────────────────

  const handleSelectProfile = useCallback(
    (profileId: string) => {
      const toolId = state.resolvedSelection?.toolId ?? Object.keys(state.config.tools)[0] ?? ''
      updateSelection(toolId, profileId)
    },
    [state.resolvedSelection, state.config.tools, updateSelection],
  )

  // ── Render overlays ────────────────────────────────────────────────────────

  if (state.overlay === 'TOOL_PICKER') {
    return (
      <ToolPickerOverlay
        tools={state.tools}
        currentToolId={state.resolvedSelection?.toolId ?? ''}
        onSelect={handleSelectTool}
        onCancel={() => setState((prev) => ({ ...prev, overlay: 'NONE' }))}
      />
    )
  }

  if (state.overlay === 'PROFILE_PICKER') {
    // Filter profiles based on current tool's allowedProfiles
    const currentTool = state.resolvedSelection?.tool
      ? state.config.tools[state.resolvedSelection.toolId]
      : null
    const allowedProfiles = currentTool?.allowedProfiles

    let profileEntries = Object.entries(state.config.profiles).map(([id, profile]) => ({
      id,
      profile,
    }))

    if (allowedProfiles && allowedProfiles.length > 0) {
      profileEntries = profileEntries.filter((entry) =>
        allowedProfiles.includes(entry.id)
      )
    }

    return (
      <ProfilePickerOverlay
        profiles={profileEntries}
        currentProfileId={state.resolvedSelection?.profileId ?? ''}
        onSelect={handleSelectProfile}
        onCancel={() => setState((prev) => ({ ...prev, overlay: 'NONE' }))}
      />
    )
  }

  // ── Main states ────────────────────────────────────────────────────────────

  if (state.main === 'MISSING_CONFIG') {
    return (
      <Box flexDirection="column" paddingX={1}>
        <Box justifyContent="space-between" marginBottom={1}>
          <Text color={colors.accent} bold>
            xTerm
          </Text>
          <Text color={colors.muted}>Setup Required</Text>
        </Box>
        <Box marginY={1}>
          <Text color={colors.border}>{'─'.repeat(72)}</Text>
        </Box>
        <Box flexDirection="column" gap={1}>
          <Text color={colors.warning}>No configuration found.</Text>
          <Text color={colors.muted}>
            A starter config has been written to{' '}
            <Text color={colors.text}>~/.xterm/config.json</Text>
          </Text>
          <Text color={colors.muted}>Edit it to add your tools and profiles, then run xterm again.</Text>
        </Box>
        <Box marginY={1}>
          <Text color={colors.border}>{'─'.repeat(72)}</Text>
        </Box>
        <Text color={colors.muted}>[q] Quit</Text>
      </Box>
    )
  }

  if (state.main === 'LAUNCHING' && state.resolvedSelection) {
    return <LaunchingView selection={state.resolvedSelection} />
  }

  if (state.main === 'HOME' && state.resolvedSelection) {
    return (
      <HomeView
        workspacePath={state.workspacePath}
        selection={state.resolvedSelection}
        tools={state.tools}
        lastLaunchedAt={undefined}
        onLaunch={() => void handleLaunch()}
        onOpenToolPicker={() => setState((prev) => ({ ...prev, overlay: 'TOOL_PICKER' }))}
        onOpenProfilePicker={() => setState((prev) => ({ ...prev, overlay: 'PROFILE_PICKER' }))}
      />
    )
  }

  // BOOT or fallback
  return (
    <Box paddingX={1}>
      <Text color={colors.muted}>Loading…</Text>
    </Box>
  )
}
