import { spawn } from 'node:child_process'
import type { LaunchContext } from '../shared/types.js'
import { LaunchError } from '../shared/errors.js'

export interface LaunchResult {
  exitCode: number
  signal: string | null
}

/**
 * Launch an external CLI with the given context.
 *
 * stdio: 'inherit' — the external tool gets full terminal control.
 * Profile env vars are merged on top of process.env (profile values win).
 */
export function launchExternalTool(context: LaunchContext): Promise<LaunchResult> {
  return new Promise((resolve, reject) => {
    const env = { ...process.env, ...context.env }

    const child = spawn(context.command, context.args, {
      cwd: context.workspacePath,
      env,
      stdio: 'inherit',
    })

    child.on('error', (err) => {
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
        reject(new LaunchError(`command not found: "${context.command}". Is it installed?`))
      } else {
        reject(new LaunchError(err.message))
      }
    })

    child.on('close', (code, signal) => {
      resolve({ exitCode: code ?? 1, signal })
    })
  })
}
