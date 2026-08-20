import { Command } from "@oclif/core";

export default class Model extends Command {
	static override description =
		"View or update the Ollama model / host configuration";

	static override examples = ["<%= config.bin %> <%= command.id %>"];

	public async run(): Promise<void> {
		this.log("Model — work in progress");
	}
}
