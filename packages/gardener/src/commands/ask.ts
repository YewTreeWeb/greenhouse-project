import { Command } from "@oclif/core";

export default class Ask extends Command {
	static override description =
		"Ask a natural language question about your projects, answered via local Ollama";

	static override examples = ["<%= config.bin %> <%= command.id %>"];

	public async run(): Promise<void> {
		this.log("gardener ask — work in progress");
	}
}
