import { resolve } from 'node:path'

export function normalizeWorkspacePath(path: string): string {
  return resolve(path)
}

export function getCurrentWorkspacePath(): string {
  return normalizeWorkspacePath(process.cwd())
}
