import { Command } from "@oclif/core";

export default class Watch extends Command {
	static override description =
		"Start the background watcher that builds a local knowledge graph of all projects over time";

	static override examples = ["<%= config.bin %> <%= command.id %>"];

	public async run(): Promise<void> {
		this.log("gardener watch — work in progress");
	}
}
