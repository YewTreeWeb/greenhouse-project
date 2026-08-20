import { Command } from "@oclif/core";

export default class Restore extends Command {
	static override description =
		"Retrieve a Seedbank snapshot and replant it — reinstall dependencies and rehydrate the project back to its saved state";

	static override examples = ["<%= config.bin %> <%= command.id %>"];

	public async run(): Promise<void> {
		this.log("planter restore — work in progress");
	}
}
