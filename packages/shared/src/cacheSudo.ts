import { formatErrorMsg } from "./errorHandler.js";
import { runCommand } from "./execWrapper.js";

export const cacheSudo = async (): Promise<{
	keepAlive?: NodeJS.Timeout;
	msg: { type: "error" | "success"; text: string };
}> => {
	const result = await runCommand("sudo", ["-v"], { stdio: "inherit" });

	if (!result.ok) {
		return { msg: { text: formatErrorMsg(result.error), type: "error" } };
	}

	const sudoKeepAlive = setInterval(() => {
		void runCommand("sudo", ["-n", "true"]);
	}, 60_000).unref();

	return {
		keepAlive: sudoKeepAlive,
		msg: { text: "Password cached for this session.", type: "success" },
	};
};
