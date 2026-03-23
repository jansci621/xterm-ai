import React from 'react'
import { Box, Text } from 'ink'
import type { ResolvedSelection } from '../../shared/types.js'
import { colors } from '../theme.js'

interface LaunchingViewProps {
  selection: ResolvedSelection
}

export function LaunchingView({ selection }: LaunchingViewProps) {
  const displayPath = selection.workspacePath.replace(process.env['HOME'] ?? '', '~')

  return (
    <Box flexDirection="column" paddingX={1}>
      <Box justifyContent="space-between" marginBottom={1}>
        <Text color={colors.accent} bold>
          xTerm
        </Text>
        <Text color={colors.muted}>Launching</Text>
      </Box>

      <Box marginBottom={1}>
        <Text color={colors.muted}>
          Workspace <Text color={colors.text}>{displayPath}</Text>
        </Text>
      </Box>

      <Box marginY={1}>
        <Text color={colors.border}>{'─'.repeat(72)}</Text>
      </Box>

      <Box flexDirection="column" gap={0} marginBottom={1}>
        <Box>
          <Text color={colors.muted}>{'Command'.padEnd(12)}</Text>
          <Text color={colors.text}>{selection.tool.command}</Text>
        </Box>
        <Box>
          <Text color={colors.muted}>{'Tool'.padEnd(12)}</Text>
          <Text color={colors.text}>{selection.tool.label ?? selection.toolId}</Text>
        </Box>
        <Box>
          <Text color={colors.muted}>{'Profile'.padEnd(12)}</Text>
          <Text color={colors.text}>{selection.profile.label ?? selection.profileId}</Text>
        </Box>
      </Box>

      <Box marginTop={1}>
        <Text color={colors.warning}>Handing off terminal control…</Text>
      </Box>
    </Box>
  )
}
