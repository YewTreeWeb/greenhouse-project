import { Command } from "@oclif/core";

export default class Optimise extends Command {
	static override description = "Optimisation";

	static override examples = ["<%= config.bin %>"];

	public async run(): Promise<void> {
		this.log("Optimise — work in progress");
	}
}
