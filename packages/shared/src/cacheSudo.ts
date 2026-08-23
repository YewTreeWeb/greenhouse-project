import { formatErrorMsg } from "./errorHandler.js";
import { runCommand } from "./execWrapper.js";

export const cacheSudo = async (): Promise<{
	keepAlive: NodeJS.Timeout;
	msg: { type: "error" | "success"; text: string };
}> => {
	let cacheMessage = "Password cached for this session.";
	const result = await runCommand("sudo", ["-v"], { stdio: "inherit" });

	if (!result.ok) {
		cacheMessage = formatErrorMsg(result.error);
		throw new Error("Administrator password required to continue.");
	}

	const sudoKeepAlive = setInterval(() => {
		void runCommand("sudo", ["-n", "true"]);
	}, 60_000).unref();

	return {
		keepAlive: sudoKeepAlive,
		msg: { type: !result.ok ? "error" : "success", text: cacheMessage },
	};
};
