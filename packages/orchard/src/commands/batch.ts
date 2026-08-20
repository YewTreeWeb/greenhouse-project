import { Command } from "@oclif/core";

export default class Batch extends Command {
	static override description = "Batch operations across projects";

	static override examples = ["<%= config.bin %>"];

	public async run(): Promise<void> {
		this.log("Batch — work in progress");
	}
}
