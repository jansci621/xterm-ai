import React, { useState } from 'react'
import { Box, Text, useInput } from 'ink'
import type { NormalizedTool } from '../../tools/tool-registry.js'
import { colors } from '../theme.js'

interface ToolPickerOverlayProps {
  tools: NormalizedTool[]
  currentToolId: string
  onSelect: (toolId: string) => void
  onCancel: () => void
}

export function ToolPickerOverlay({
  tools,
  currentToolId,
  onSelect,
  onCancel,
}: ToolPickerOverlayProps) {
  const [cursor, setCursor] = useState(() => {
    const idx = tools.findIndex((t) => t.id === currentToolId)
    return idx >= 0 ? idx : 0
  })

  useInput((input, key) => {
    if (key.escape || input === 'q') {
      onCancel()
      return
    }
    if (key.upArrow) {
      setCursor((c) => Math.max(0, c - 1))
      return
    }
    if (key.downArrow) {
      setCursor((c) => Math.min(tools.length - 1, c + 1))
      return
    }
    if (key.return) {
      const selected = tools[cursor]
      if (selected) onSelect(selected.id)
      return
    }
  })

  return (
    <Box flexDirection="column" paddingX={1}>
      <Box justifyContent="space-between" marginBottom={1}>
        <Text color={colors.accent} bold>
          xTerm
        </Text>
        <Text color={colors.muted}>Tool Picker</Text>
      </Box>

      <Box marginY={1}>
        <Text color={colors.border}>{'─'.repeat(72)}</Text>
      </Box>

      <Box flexDirection="column" gap={0}>
        {tools.map((tool, idx) => {
          const isSelected = idx === cursor
          const isCurrent = tool.id === currentToolId
          return (
            <Box key={tool.id}>
              <Text color={isSelected ? colors.accent : colors.muted}>
                {isSelected ? '▶ ' : '  '}
              </Text>
              <Text color={isSelected ? colors.text : colors.muted} bold={isSelected}>
                {tool.label ?? tool.id}
              </Text>
              {isCurrent && (
                <Text color={colors.muted}> (current)</Text>
              )}
              <Text color={colors.muted}> — {tool.command}</Text>
            </Box>
          )
        })}
      </Box>

      <Box marginY={1}>
        <Text color={colors.border}>{'─'.repeat(72)}</Text>
      </Box>

      <Box gap={3}>
        <Text color={colors.accent} bold>[Enter] Select</Text>
        <Text color={colors.muted}>[↑↓] Navigate</Text>
        <Text color={colors.muted}>[Esc] Cancel</Text>
      </Box>
    </Box>
  )
}
