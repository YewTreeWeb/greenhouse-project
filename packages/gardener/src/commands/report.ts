import { Command } from "@oclif/core";

export default class Report extends Command {
	static override description = "Generate a weekly digest report";

	static override examples = ["<%= config.bin %> <%= command.id %>"];

	public async run(): Promise<void> {
		this.log("gardener report — work in progress");
	}
}
