import {isProtectedBranch} from './gitBranches.js'

export type BranchType = 'hotfix' | 'rch'

interface FormatOptions {
  type?: BranchType
}

const patterns: Record<BranchType, RegExp> = {
  hotfix: /^HOTFIX-[a-zA-Z0-9-]+$/,
  rch: /^RCH-[a-zA-Z0-9-]+$/,
}

function ensurePrefix(name: string, type: BranchType): string {
  const prefix = type.toUpperCase()
  const normalized = [prefix, type].includes(name) ? name.replace(prefix || type, '') : name
  return `${prefix}-${normalized}`
}

export function formatBranchName(raw: string, options: FormatOptions = {}): string {
  const input = raw.trim().toUpperCase()
  const type = options.type ?? 'rch'

  return ensurePrefix(input, type)
}

export type BranchValidationResult = boolean | {error?: string; pass: boolean}

export function isValidBranchName(
  name: string,
  type: BranchType,
  debug: boolean,
): boolean | {error?: string; pass: boolean} {
  const notAllowed = isProtectedBranch(name) === 'not-allowed'
  const upper = name.trim().toUpperCase()
  const pass = !notAllowed && patterns[type].test(upper)

  if (debug) {
    return {
      pass,
      ...(notAllowed && {error: `${name} is a protected branch`}),
    }
  }

  return pass
}
