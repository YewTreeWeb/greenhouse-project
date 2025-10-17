import {execa} from 'execa'
import ora from 'ora'

import {formatErrorMsg} from './errorHandler.js'
import {BranchType, formatBranchName, isValidBranchName} from './gitBranchNaming.js'
const spinner = ora()

export async function getCurrentBranch(): Promise<string> {
  try {
    const {stdout} = await execa('git', ['rev-parse', '--abbrev-ref', 'HEAD'])
    return stdout.trim()
  } catch (error) {
    spinner.fail('Failed to get current branch.')
    throw new Error(formatErrorMsg(error))
  }
}

export async function validateBranchName(name: string, type: BranchType, updateFrom: string, debug: boolean) {
  const isValidName = name === 'current' || isValidBranchName(name, type, debug)
  const isValidUpdateFrom =
    ['main', 'release', 'stage'].includes(updateFrom) || isValidBranchName(updateFrom, type, debug)

  if (!isValidationPass(isValidName) || !isValidationPass(isValidUpdateFrom)) {
    const msg =
      debug && typeof isValidName === 'object'
        ? isValidName?.error
        : `Invalid branch name: "${name}". Must match RCH-1234 or HOTFIX-456.`
    spinner.fail(msg)

    return 'failed'
  }
}

function isValidationPass(result: boolean | {pass: boolean}): boolean {
  return typeof result === 'boolean' ? result : result.pass
}

export async function branchExists(name: string): Promise<'local' | 'remote' | null> {
  const local = await execa('git', ['show-ref', '--quiet', '--verify', `refs/heads/${name}`])
    .then(() => true)
    .catch(() => false)
  if (local) return 'local'

  const {stdout} = await execa('git', ['ls-remote', '--heads', 'origin', name])
  if (stdout.trim()) return 'remote'

  return null
}

export async function checkoutBranch(name: string, errorFn: (msg: string) => never): Promise<void> {
  const exists = await branchExists(name)

  if (exists === 'local') {
    await execa('git', ['checkout', name])
    await execa('git', ['pull'])
  } else if (exists === 'remote') {
    spinner.info(`${name} not found locally. Fetching...`)
    await execa('git', ['checkout', '-t', `origin/${name}`])
    spinner.succeed(`${name} fetched and checked out.`)
  } else {
    spinner.stop()
    errorFn(`Branch "${name}" does not exist.`)
  }
}

export async function mergeBranch(
  from: string,
  into: string,
  errorFn: (msg: string) => never,
  dryRun?: boolean,
): Promise<void> {
  if (dryRun) {
    console.log(`[dry-run] Would merge from branch: ${from} into ${into}`)
    return
  }

  try {
    await execa('git', ['merge', '--squash', from])
    await execa('git', ['commit', '--m', `merged branch with ${from}`])
    await execa('git', ['push', '--force-with-lease', 'origin', into])
    spinner.succeed('Merge completed.')
    spinner.text = 'Continuing update...'
  } catch (error) {
    const hasConflicts = await hasMergeConflicts()
    if (hasConflicts) {
      spinner.warn(`${into} updated partially with merge conflicts.`)
      errorFn(`hasConflicts: ${hasConflicts}`)
    } else {
      spinner.fail('Merge failed')
      errorFn(formatErrorMsg(error))
    }
  }
}

export async function hasMergeConflicts(
  debug = false,
  log?: (msg: string, data: boolean | string) => void,
): Promise<boolean> {
  const {stdout} = await execa('git', ['status', '--porcelain'])
  if (debug && log) log('status', stdout)
  return stdout.split('\n').some((line) => line.startsWith('UU'))
}

export function shouldWarnMain(repo: string, updateFrom: string): boolean {
  return repo === 'wxrh-ui' && updateFrom === 'main'
}

export function resolveBranchName(inputName: string, type: BranchType, currentBranch: string): string {
  return inputName === 'current' ? currentBranch : formatBranchName(inputName, {type})
}
