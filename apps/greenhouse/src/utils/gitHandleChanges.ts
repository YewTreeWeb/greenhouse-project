import {execa, ExecaError} from 'execa'

import {formatErrorMsg} from './errorHandler.js'

/**
 * Checks if there are any uncommitted changes in the current branch.
 * @param debug If true, logs and returns changed file paths.
 * @returns `false` if no changes, `true` or list of files if changes exist.
 */
export const checkForChanges = async (debug = false): Promise<boolean | string[]> => {
  try {
    // `--quiet` suppresses output, just returns status code
    await execa('git', ['diff-index', '--quiet', 'HEAD', '--'])
    return false // No changes
  } catch (error) {
    const err = error as ExecaError

    if (err.exitCode === 1) {
      // Changes exist
      if (debug) {
        const {stdout} = await execa('git', ['diff-index', '--name-only', 'HEAD', '--'])
        const files = stdout.trim().split('\n').filter(Boolean)
        return files
      }

      return true
    }

    // Unexpected error (e.g. malformed command)
    throw new Error(`Git diff-index failed: ${formatErrorMsg(error)}`)
  }
}

/**
 * Stashes any uncommitted changes in the current branch.
 * @returns void
 */
export const stashChanges = async () => {
  await execa('git', ['stash', 'push', '-m', `Stashing files...`])
}

/**
 * Checks for uncommitted changes and stashes them if they exist.
 * @returns Object with 2 properties: `hasChanges` (boolean) and `hasError` (boolean | string).
 * `hasChanges` is true if there are changes, false otherwise.
 * `hasError` is a string if there was an error stashing the changes (e.g. non-zero exit code).
 * If there was no error, `hasError` is false.
 */
export const handleChanges = async (debug?: boolean, stash = true) => {
  const hasChanges = await checkForChanges(debug)
  let hasError = null

  try {
    if (hasChanges && Array.isArray(hasChanges)) {
      console.log('Uncommitted files:\n' + hasChanges.map((f) => `• ${f}`).join('\n'))
    }

    if (hasChanges && stash) {
      stashChanges()
    }
  } catch (error) {
    hasError = formatErrorMsg(error)
  }

  return {hasChanges, hasError}
}
