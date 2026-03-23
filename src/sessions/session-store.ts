import { readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import type { WorkspaceSession, SessionStore } from '../shared/types.js'
import { getSessionFilePath } from './session-path.js'
import { normalizeWorkspacePath } from './workspace-normalizer.js'

async function loadStore(): Promise<SessionStore> {
  const path = getSessionFilePath()
  if (!existsSync(path)) return { version: 1, workspaces: {} }

  try {
    const content = await readFile(path, 'utf8')
    return JSON.parse(content) as SessionStore
  } catch {
    return { version: 1, workspaces: {} }
  }
}

async function saveStore(store: SessionStore): Promise<void> {
  await writeFile(getSessionFilePath(), JSON.stringify(store, null, 2), 'utf8')
}

export async function getWorkspaceSession(
  path: string,
): Promise<WorkspaceSession | undefined> {
  const store = await loadStore()
  return store.workspaces[normalizeWorkspacePath(path)]
}

export async function saveWorkspaceSession(
  path: string,
  patch: WorkspaceSession,
): Promise<void> {
  const normalized = normalizeWorkspacePath(path)
  const store = await loadStore()
  store.workspaces[normalized] = { ...store.workspaces[normalized], ...patch }
  await saveStore(store)
}

export async function listRecentWorkspaces(
  limit = 20,
): Promise<Array<{ path: string; session: WorkspaceSession }>> {
  const store = await loadStore()
  return Object.entries(store.workspaces)
    .map(([path, session]) => ({ path, session }))
    .sort((a, b) => {
      const aTime = a.session.lastLaunchedAt ?? ''
      const bTime = b.session.lastLaunchedAt ?? ''
      return bTime.localeCompare(aTime)
    })
    .slice(0, limit)
}
