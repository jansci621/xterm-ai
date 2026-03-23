import { homedir } from 'node:os'

/**
 * Expands a path that may contain ~ to the user's home directory.
 * @param path - The path to expand
 * @returns The expanded path with ~ replaced by the home directory
 */
export function expandPath(path: string): string {
  if (path.startsWith('~/')) {
    return homedir() + path.slice(1)
  }
  if (path === '~') {
    return homedir()
  }
  return path
}
