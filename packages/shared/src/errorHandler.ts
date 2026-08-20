import type { Command } from "@oclif/core";

export function failAndExit(
	command: Command,
	error: Error | unknown,
	debug: boolean,
) {
	const err = formatErrorMsg(error);
	if (debug) {
		if (error instanceof Error) console.error(error);
		command.log(`Debug: ${err}`);
		return;
	}

	command.error(err);
}

export function formatErrorMsg(error: Error | unknown): string {
	return error instanceof Error ? error.message : String(error);
}
