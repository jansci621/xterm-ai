import { homedir } from 'node:os'
import { join } from 'node:path'

export const XTERM_DIR = join(homedir(), '.xterm-ai')
export const CONFIG_FILE = join(XTERM_DIR, 'config.json')
export const SESSIONS_FILE = join(XTERM_DIR, 'sessions.json')

export const CONFIG_VERSION = 1 as const
export const SESSIONS_VERSION = 1 as const

export const API_KEY_MASK_LENGTH = 8
