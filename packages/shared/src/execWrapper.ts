import { type ExecaError, execa, type Options } from "execa";
import { formatErrorMsg } from "./errorHandler.js";

export type ExecResult =
	| { ok: true; stdout: string }
	| { ok: false; error: string; stderr?: string; exitCode?: number };

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
			stdout: typeof stdout === "string" ? stdout : String(stdout ?? ""),
		};
	} catch (error) {
		const execaError = error as ExecaError;
		return {
			ok: false,
			error: formatErrorMsg(error),
			stderr:
				typeof execaError?.stderr === "string" ? execaError.stderr : undefined,
			exitCode: execaError?.exitCode,
		};
	}
};
