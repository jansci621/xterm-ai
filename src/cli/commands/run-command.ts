import type { GlobalConfig } from '../../shared/types.js'
import { getWorkspaceSession, saveWorkspaceSession } from '../../sessions/session-store.js'
import { getCurrentWorkspacePath } from '../../sessions/workspace-normalizer.js'
import { resolveSelection } from '../../resolution/selection-resolver.js'
import { buildLaunchContext } from '../../launcher/launch-context.js'
import { launchExternalTool } from '../../launcher/process-launcher.js'

export interface RunOptions {
  profile?: string
}

export async function runCommand(
  config: GlobalConfig,
  toolId: string | undefined,
  options: RunOptions,
): Promise<void> {
  const workspacePath = getCurrentWorkspacePath()
  const session = await getWorkspaceSession(workspacePath)

  const selection = resolveSelection({
    config,
    workspacePath,
    session,
    explicitToolId: toolId,
    explicitProfileId: options.profile,
  })

  const context = buildLaunchContext(selection)

  // Record launch intent before handing off
  await saveWorkspaceSession(workspacePath, {
    lastTool: selection.toolId,
    lastProfile: selection.profileId,
    lastLaunchedAt: new Date().toISOString(),
  })

  const result = await launchExternalTool(context)

  // Record exit result
  await saveWorkspaceSession(workspacePath, { lastExitCode: result.exitCode })

  if (result.exitCode !== 0) {
    process.stderr.write(
      `\n ${selection.tool.command} exited with code ${result.exitCode}\n` +
        ` Session saved. Run 'xterm run' to relaunch.\n\n`,
    )
    process.exit(result.exitCode)
  }
}
