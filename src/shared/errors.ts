export class XtermError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message)
    this.name = 'XtermError'
  }
}

export class ConfigNotFoundError extends XtermError {
  constructor(path: string) {
    super(`Config not found: ${path}`, 'CONFIG_NOT_FOUND')
  }
}

export class ConfigInvalidError extends XtermError {
  constructor(reason: string) {
    super(`Config invalid: ${reason}`, 'CONFIG_INVALID')
  }
}

export class ToolNotFoundError extends XtermError {
  constructor(toolId: string) {
    super(`Tool not found in config: "${toolId}"`, 'TOOL_NOT_FOUND')
  }
}

export class ProfileNotFoundError extends XtermError {
  constructor(profileId: string) {
    super(`Profile not found in config: "${profileId}"`, 'PROFILE_NOT_FOUND')
  }
}

export class NoToolsConfiguredError extends XtermError {
  constructor() {
    super(
      'No tools configured. Add at least one tool to ~/.xterm-ai/config.json',
      'NO_TOOLS',
    )
  }
}

export class LaunchError extends XtermError {
  constructor(reason: string) {
    super(`Launch failed: ${reason}`, 'LAUNCH_ERROR')
  }
}
