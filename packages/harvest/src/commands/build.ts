import { Command } from "@oclif/core";

export default class Build extends Command {
	static override description = "Build / export";

	static override examples = ["<%= config.bin %>"];

	public async run(): Promise<void> {
		this.log("Build — work in progress");
	}
}
