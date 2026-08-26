import { type ExecaError, execa, type Options } from "execa";
import { formatErrorMsg } from "./errorHandler.js";

export type ExecResult =
	| { ok: true; stdout: string }
	| { ok: false; error: string; stderr?: string; exitCode?: number };

function execOutputToText(
	value: string | unknown[] | Uint8Array | undefined,
): string | undefined {
	if (value === undefined) return undefined;
	if (value instanceof Uint8Array) return Buffer.from(value).toString();
	if (Array.isArray(value)) return value.join("\n");
	return value;
}

export const runCommand = async (
	command: string,
	args: string[],
	options: Options = {},
): Promise<ExecResult> => {
	try {
		const { stdout } = await execa(command, args, {
			...options,
			reject: true,
		});
		return {
			ok: true,
			stdout: execOutputToText(stdout) ?? "",
		};
	} catch (error) {
		// SAFETY: caught from an execa() call, which always rejects with an ExecaError.
		const execaError = error as ExecaError;
		return {
			ok: false,
			error: formatErrorMsg(error),
			stderr: execOutputToText(execaError?.stderr),
			exitCode: execaError?.exitCode,
		};
	}
};
