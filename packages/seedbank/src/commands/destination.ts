import { Command } from "@oclif/core";

export default class Destination extends Command {
	static override description =
		"View or update the configured Seedbank destination";

	static override examples = ["<%= config.bin %> <%= command.id %>"];

	public async run(): Promise<void> {
		this.log("Destination — work in progress");
	}
}
