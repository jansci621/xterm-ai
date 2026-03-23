#!/usr/bin/env node

import { Command } from 'commander'
import { loadConfig } from '../config/config-loader.js'
import { ConfigNotFoundError } from '../shared/errors.js'
import { CONFIG_FILE } from '../shared/constants.js'
import { runCommand } from './commands/run-command.js'

const program = new Command()

program
  .name('xterm-ai')
  .description('Terminal workspace for launching AI CLIs')
  .version('0.1.0')

// ── xterm run [tool] ───────────────────────────────────────────────────────
program
  .command('run [tool]')
  .description('Launch an AI CLI in the current workspace')
  .option('-p, --profile <profile>', 'Profile to use')
  .action(async (tool: string | undefined, options: { profile?: string }) => {
    await withConfig(async (config) => {
      await runCommand(config, tool, { profile: options.profile })
    })
  })

// ── xterm (no subcommand) → open TUI ──────────────────────────────────────
// The TUI owns its own config loading and handles MISSING_CONFIG internally.
program.action(async () => {
  try {
    const { startTui } = await import('../tui/tui-main.js')
    await startTui(process.cwd())
  } catch (err) {
    if (err instanceof Error) {
      process.stderr.write(`\n Error: ${err.message}\n\n`)
      process.exit(1)
    }
    throw err
  }
})

// ─────────────────────────────────────────────────────────────────────────────

async function withConfig(
  fn: (config: Awaited<ReturnType<typeof loadConfig>>) => Promise<void>,
): Promise<void> {
  try {
    const config = await loadConfig()
    await fn(config)
  } catch (err) {
    if (err instanceof ConfigNotFoundError) {
      process.stderr.write(
        `\n No config found at ${CONFIG_FILE}\n` +
          ` Create ~/.xterm-ai/config.json to get started.\n` +
          ` See the docs for the config format.\n\n`,
      )
      process.exit(1)
    }
    if (err instanceof Error) {
      process.stderr.write(`\n Error: ${err.message}\n\n`)
      process.exit(1)
    }
    throw err
  }
}

program.parse()
