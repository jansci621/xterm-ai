import type { GlobalConfig } from '../shared/types.js'
import { ConfigInvalidError } from '../shared/errors.js'

export function validateConfig(raw: unknown): GlobalConfig {
  if (typeof raw !== 'object' || raw === null) {
    throw new ConfigInvalidError('config must be a JSON object')
  }

  const obj = raw as Record<string, unknown>

  if (obj['version'] !== 1) {
    throw new ConfigInvalidError('version must be 1')
  }

  if (typeof obj['profiles'] !== 'object' || obj['profiles'] === null || Array.isArray(obj['profiles'])) {
    throw new ConfigInvalidError('"profiles" must be an object')
  }

  if (typeof obj['tools'] !== 'object' || obj['tools'] === null || Array.isArray(obj['tools'])) {
    throw new ConfigInvalidError('"tools" must be an object')
  }

  const tools = obj['tools'] as Record<string, unknown>
  const profiles = obj['profiles'] as Record<string, unknown>

  if (Object.keys(tools).length === 0) {
    throw new ConfigInvalidError('at least one tool must be configured')
  }

  for (const [id, tool] of Object.entries(tools)) {
    if (typeof tool !== 'object' || tool === null) {
      throw new ConfigInvalidError(`tool "${id}" must be an object`)
    }

    const t = tool as Record<string, unknown>

    if (typeof t['command'] !== 'string' || !t['command']) {
      throw new ConfigInvalidError(`tool "${id}" must have a non-empty "command" string`)
    }

    if (t['defaultProfile'] !== undefined) {
      if (typeof t['defaultProfile'] !== 'string') {
        throw new ConfigInvalidError(`tool "${id}.defaultProfile" must be a string`)
      }
      if (!(t['defaultProfile'] in profiles)) {
        throw new ConfigInvalidError(
          `tool "${id}" references unknown profile "${t['defaultProfile']}"`
        )
      }
    }
  }

  return raw as GlobalConfig
}
