import { Command } from "@oclif/core";

export default class Insights extends Command {
	static override description = "View all current recommendations";

	static override examples = ["<%= config.bin %> <%= command.id %>"];

	public async run(): Promise<void> {
		this.log("gardener insights — work in progress");
	}
}
