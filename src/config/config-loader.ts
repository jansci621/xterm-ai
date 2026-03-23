import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync, chmodSync } from 'node:fs'
import type { GlobalConfig } from '../shared/types.js'
import { ConfigNotFoundError, ConfigInvalidError } from '../shared/errors.js'
import { validateConfig } from './config-validator.js'
import { getConfigFilePath, getXtermDir } from './config-path.js'

export async function loadConfig(): Promise<GlobalConfig> {
  const configPath = getConfigFilePath()

  if (!existsSync(configPath)) {
    throw new ConfigNotFoundError(configPath)
  }

  let raw: unknown
  try {
    const content = await readFile(configPath, 'utf8')
    raw = JSON.parse(content)
  } catch (err) {
    if (err instanceof SyntaxError) {
      throw new ConfigInvalidError(`invalid JSON — ${err.message}`)
    }
    throw err
  }

  return validateConfig(raw)
}

export async function writeStarterConfig(config: GlobalConfig): Promise<void> {
  const dir = getXtermDir()
  const configPath = getConfigFilePath()

  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true })
  }

  await writeFile(configPath, JSON.stringify(config, null, 2), 'utf8')
  // Only owner can read/write — protects plaintext API keys
  chmodSync(configPath, 0o600)
}
