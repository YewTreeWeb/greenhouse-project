import {Command} from '@oclif/core'
import {ExecaError} from 'execa'

export function failOrExit(command: Command, error: Error | unknown, debug: boolean): never {
  const err = error instanceof Error ? error.message : (error as string)
  if (debug) {
    if (error instanceof Error) console.error(error)
    command.error(err)
  } else {
    command.exit(1)
  }
}

export function formatErrorMsg(error: Error | ExecaError | unknown) {
  const err = error instanceof Error ? error.message : (error as string)
  return err
}
