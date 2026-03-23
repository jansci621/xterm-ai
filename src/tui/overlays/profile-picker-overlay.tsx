import React, { useState } from 'react'
import { Box, Text, useInput } from 'ink'
import type { ProfileConfig } from '../../shared/types.js'
import { colors } from '../theme.js'

interface ProfileEntry {
  id: string
  profile: ProfileConfig
}

interface ProfilePickerOverlayProps {
  profiles: ProfileEntry[]
  currentProfileId: string
  onSelect: (profileId: string) => void
  onCancel: () => void
}

export function ProfilePickerOverlay({
  profiles,
  currentProfileId,
  onSelect,
  onCancel,
}: ProfilePickerOverlayProps) {
  const [cursor, setCursor] = useState(() => {
    const idx = profiles.findIndex((p) => p.id === currentProfileId)
    return idx >= 0 ? idx : 0
  })

  const hasProfiles = profiles.length > 0

  useInput((input, key) => {
    if (key.escape || input === 'q') {
      onCancel()
      return
    }
    if (!hasProfiles) return
    if (key.upArrow) {
      setCursor((c) => Math.max(0, c - 1))
      return
    }
    if (key.downArrow) {
      setCursor((c) => Math.min(profiles.length - 1, c + 1))
      return
    }
    if (key.return) {
      const selected = profiles[cursor]
      if (selected) onSelect(selected.id)
      return
    }
  })

  return (
    <Box flexDirection="column" paddingX={1}>
      <Box justifyContent="space-between" marginBottom={1}>
        <Text color={colors.accent} bold>
          xTerm-AI
        </Text>
        <Text color={colors.muted}>Profile Picker</Text>
      </Box>

      <Box marginY={1}>
        <Text color={colors.border}>{'─'.repeat(72)}</Text>
      </Box>

      <Box flexDirection="column" gap={0}>
        {hasProfiles ? (
          profiles.map((entry, idx) => {
            const isSelected = idx === cursor
            const isCurrent = entry.id === currentProfileId
            const displayLabel = entry.profile.label ?? entry.id
            return (
              <Box key={entry.id}>
                <Text color={isSelected ? colors.accent : colors.muted}>
                  {isSelected ? '▶ ' : '  '}
                </Text>
                <Text color={isSelected ? colors.text : colors.muted} bold={isSelected}>
                  {displayLabel}
                </Text>
                {isCurrent && (
                  <Text color={colors.muted}> (current)</Text>
                )}
              </Box>
            )
          })
        ) : (
          <Box>
            <Text color={colors.muted}>  - (no profiles available)</Text>
          </Box>
        )}
      </Box>

      <Box marginY={1}>
        <Text color={colors.border}>{'─'.repeat(72)}</Text>
      </Box>

      <Box gap={3}>
        {hasProfiles && <Text color={colors.accent} bold>[Enter] Select</Text>}
        {hasProfiles && <Text color={colors.muted}>[↑↓] Navigate</Text>}
        <Text color={colors.muted}>[Esc] Cancel</Text>
      </Box>
    </Box>
  )
}
