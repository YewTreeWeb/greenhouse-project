import type { Command } from "@oclif/core";

export function failOrExit(
	command: Command,
	error: Error | unknown,
	debug: boolean,
): never {
	const err = formatErrorMsg(error);
	if (debug) {
		if (error instanceof Error) console.error(error);
		command.error(err);
	} else {
		command.warn(err);
		command.exit(1);
	}
}

export function formatErrorMsg(error: Error | unknown): string {
	return error instanceof Error ? error.message : String(error);
}
