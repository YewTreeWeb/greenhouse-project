import { Command } from "@oclif/core";

export default class Diff extends Command {
	static override description = "Diff two snapshots of a project";

	static override examples = ["<%= config.bin %> <%= command.id %>"];

	public async run(): Promise<void> {
		this.log("seedbank diff — work in progress");
	}
}
