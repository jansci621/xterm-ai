import React from 'react'
import { Box, Text, useInput, useApp } from 'ink'
import type { ResolvedSelection } from '../../shared/types.js'
import type { NormalizedTool } from '../../tools/tool-registry.js'
import { colors, sourceLabel } from '../theme.js'
import { checkToolHealth } from '../health/health-display.js'

interface HomeViewProps {
  workspacePath: string
  selection: ResolvedSelection
  tools: NormalizedTool[]
  lastLaunchedAt?: string
  onLaunch: () => void
  onOpenToolPicker: () => void
  onOpenProfilePicker: () => void
}

function formatDate(iso?: string): string {
  if (!iso) return 'never'
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function HealthTag({ level }: { level: 'ok' | 'missing' }) {
  const color = level === 'ok' ? colors.success : colors.error
  return <Text color={color}>{level === 'ok' ? 'ok' : 'missing'}</Text>
}

export function HomeView({
  workspacePath,
  selection,
  lastLaunchedAt,
  onLaunch,
  onOpenToolPicker,
  onOpenProfilePicker,
}: HomeViewProps) {
  const { exit } = useApp()
  const toolHealth = checkToolHealth({
    id: selection.toolId,
    label: selection.tool.label ?? selection.toolId,
    command: selection.tool.command,
    args: selection.tool.args ?? [],
    defaultProfile: selection.tool.defaultProfile,
  })

  useInput((input, key) => {
    if (input === 'q' || (key.escape && Object.keys({}).length === 0)) exit()
    if (key.return) onLaunch()
    if (input === 't') onOpenToolPicker()
    if (input === 'p') onOpenProfilePicker()
    if (input === 'q') exit()
  })

  // Shorten path for display
  const displayPath = workspacePath.replace(process.env['HOME'] ?? '', '~')

  return (
    <Box flexDirection="column" paddingX={1}>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <Box justifyContent="space-between" marginBottom={1}>
        <Text color={colors.accent} bold>
          xTerm-AI
        </Text>
        <Text color={colors.muted}>Home</Text>
      </Box>

      <Box justifyContent="space-between">
        <Text color={colors.muted}>
          Workspace{' '}
          <Text color={colors.text}>{displayPath}</Text>
        </Text>
        <Text color={colors.muted}>Last {formatDate(lastLaunchedAt)}</Text>
      </Box>

      {/* ── Divider ────────────────────────────────────────────────────────── */}
      <Box marginY={1}>
        <Text color={colors.border}>{'─'.repeat(72)}</Text>
      </Box>

      {/* ── Tool section ───────────────────────────────────────────────────── */}
      <Box marginBottom={1}>
        <Text color={colors.muted}>{'Tool'.padEnd(10)}</Text>
        <Text color={colors.text} bold>
          {(selection.tool.label ?? selection.toolId).padEnd(28)}
        </Text>
        <Text> </Text>
        <HealthTag level={toolHealth.installed ? 'ok' : 'missing'} />
        <Text color={colors.muted}> {toolHealth.installed ? 'installed' : 'not found'}</Text>
        <Text color={colors.muted}>  · {sourceLabel[selection.toolSource]}</Text>
      </Box>

      <Box marginBottom={1}>
        <Text color={colors.muted}>{'Profile'.padEnd(10)}</Text>
        <Text color={colors.text}>
          {selection.profileId === '__none__'
            ? '-'.padEnd(28)
            : (selection.profile.label ?? selection.profileId).padEnd(28)}
        </Text>
        <Text color={colors.muted}>  · {sourceLabel[selection.profileSource]}</Text>
      </Box>

      {/* ── Divider ────────────────────────────────────────────────────────── */}
      <Box marginY={1}>
        <Text color={colors.border}>{'─'.repeat(72)}</Text>
      </Box>

      {/* ── Footer actions (Editorial: one dominant action first) ───────────── */}
      <Box gap={3}>
        <Text color={colors.accent} bold>
          [Enter] Launch
        </Text>
        <Text color={colors.muted}>[t] Tool</Text>
        <Text color={colors.muted}>[p] Profile</Text>
        <Text color={colors.muted}>[q] Quit</Text>
      </Box>
    </Box>
  )
}
