import { Command } from "@oclif/core";

export default class Checkout extends Command {
	static override description = "Git branch management";

	static override examples = ["<%= config.bin %>"];

	public async run(): Promise<void> {
		this.log("Checkout — work in progress");
	}
}
