import {
	cancel,
	confirm,
	group,
	intro,
	isCancel,
	log,
	multiselect,
	outro,
	select,
} from "@clack/prompts";
import { runCommand } from "@greenhouse/shared";
import { Args, Command, Flags } from "@oclif/core";
import type { FlagInput } from "@oclif/core/interfaces";

export default class Setup extends Command {
	static override description =
		"Bootstrap a fresh Mac or Linux machine — Nix-first setup, Homebrew (macOS), dotfiles, SSH, git config";

	static override examples = ["terrarium setup", "greenhouse setup"];

	static override args = {
		platform: Args.string({
			description: "The platform to setup (macOS or Linux)",
			options: ["macos", "linux"],
			required: true,
		}),
	};

	static override flags: FlagInput<{ [flag: string]: any }> = {
		shell: Flags.string({
			char: "s",
			description: "The shell environment to use",
			options: ["bash", "zsh", "fish"],
		}),
		node: Flags.string({
			description: "The Node.js version to install",
			default: "lts",
		}),
		ruby: Flags.string({
			description: "The Ruby version to install",
			default: "latest",
		}),
		php: Flags.string({
			description: "The PHP version to install",
			default: "latest",
		}),
		terminal: Flags.string({
			description: "The terminal emulator to use",
			options: ["iterm", "kitty", "alacritty", "hyper", "ghostty"],
		}),
		dryRun: Flags.boolean({
			char: "d",
			description: "Simulate creation without applying changes",
			default: false,
		}),
		debug: Flags.boolean({
			char: "D",
			description: "Enable debug logging",
			default: false,
		}),
		default: Flags.boolean({
			description: "Use default settings for setup",
			default: false,
		}),
	};

	private isDryRun = false;
	private isDebug = false;
	private devMode = process.env.NODE_ENV === "development";

	private sudoKeepAlive?: NodeJS.Timeout;

	private bail(message: string): never {
		cancel(message);
		this.exit(1);
	}

	private async cacheSudo(): Promise<void> {
		const result = await runCommand("sudo", ["-v"], { stdio: "inherit" });
		if (!result.ok) {
			log.error(result.error);
			this.bail("Administrator password required to continue.");
		}

		this.sudoKeepAlive = setInterval(() => {
			void runCommand("sudo", ["-n", "true"]);
		}, 60_000).unref();

		log.success("Password cached for this session.");
	}

	public async run(): Promise<void> {
		const { args, flags } = await this.parse(Setup);
		const { platform } = args;

		this.isDryRun = flags.dryRun;
		this.isDebug = flags.debug || this.devMode;
		const introMsg = "Starting setup process.";

		const defaultSettings = flags.default
			? {
					shell: "zsh",
					terminal: "hyper",
					launchers: ["raycast"],
					node: { version: "lts", pkgManager: "pnpm" },
					ruby: { version: "latest", gemManager: "bundler" },
					php: { version: "latest", phpManager: "composer" },
				}
			: null;

		if (this.devMode) {
			intro(`${introMsg} (Development Mode)...`);
		} else {
			intro(`${introMsg}...`);
		}

		const shell =
			flags.shell ||
			(await select({
				message: "Select your preferred shell environment",
				options: [
					{ value: "bash", label: "Bash" },
					{ value: "zsh", label: "Zsh" },
					{ value: "fish", label: "Fish" },
				],
				maxItems: 3,
			}));
		if (isCancel(shell)) this.bail("Setup canceled by user.");

		const terminal =
			flags.terminal ||
			(await select({
				message: "Select your preferred terminal emulator",
				options: [
					{ value: "iterm", label: "iTerm" },
					{ value: "kitty", label: "Kitty" },
					{ value: "alacritty", label: "Alacritty" },
					{ value: "hyper", label: "Hyper" },
					{ value: "ghostty", label: "Ghostty" },
				],
				maxItems: 5,
			}));
		if (isCancel(terminal)) this.bail("Setup canceled by user.");

		const launcher =
			platform !== "macos"
				? []
				: await multiselect({
						message: "Select the launchers you want to install",
						options: [
							{ value: "raycast", label: "Raycast" },
							{ value: "alfred", label: "Alfred" },
						],
						maxItems: 2,
					});
		if (isCancel(launcher)) this.bail("Setup canceled by user.");

		const nodeGroup = await group(
			{
				node: () =>
					select({
						message: "Select the Node.js version to install",
						options: [
							{ value: "latest", label: "Latest" },
							{ value: "lts", label: "LTS" },
						],
					}),
				pkgManager: () =>
					select({
						message: "Select the package manager to use",
						options: [
							{ value: "npm", label: "npm" },
							{ value: "yarn", label: "Yarn" },
							{ value: "pnpm", label: "pnpm" },
							{ value: "bun", label: "Bun" },
						],
					}),
			},
			{ onCancel: () => this.bail("Setup canceled by user.") },
		);

		const rubyGroup = await group(
			{
				ruby: () =>
					select({
						message: "Select the Ruby version to install",
						options: [
							{ value: "latest", label: "Latest" },
							{ value: "3.2", label: "3.2" },
							{ value: "3.1", label: "3.1" },
							{ value: "3.0", label: "3.0" },
							{ value: "2.7", label: "2.7" },
						],
					}),
				gemManager: () =>
					select({
						message: "Select the gem manager to use",
						options: [
							{ value: "bundler", label: "Bundler" },
							{ value: "rubygems", label: "RubyGems" },
						],
					}),
			},
			{ onCancel: () => this.bail("Setup canceled by user.") },
		);

		const phpGroup = await group(
			{
				php: () =>
					select({
						message: "Select the PHP version to install",
						options: [
							{ value: "latest", label: "Latest" },
							{ value: "8.2", label: "8.2" },
							{ value: "8.1", label: "8.1" },
							{ value: "8.0", label: "8.0" },
							{ value: "7.4", label: "7.4" },
						],
					}),
				phpManager: () =>
					select({
						message: "Select the PHP manager to use",
						options: [
							{ value: "composer", label: "Composer" },
							{ value: "pecl", label: "PECL" },
						],
					}),
			},
			{ onCancel: () => this.bail("Setup canceled by user.") },
		);

		const confirmation = await confirm({
			message: "Do you want to proceed with the setup?",
			initialValue: true,
		});
		if (isCancel(confirmation)) this.bail("Setup canceled by user.");
		if (!confirmation) this.bail("Setup aborted.");

		if (this.isDebug) {
			console.log("Parsed arguments:", args);
			console.log("Parsed flags:", flags);
			console.log("Selected shell:", shell);
			console.log("Selected terminal:", terminal);
			console.log("Selected launchers:", launcher);
			console.log("Selected node choices:", nodeGroup);
			console.log("Selected ruby choices:", rubyGroup);
			console.log("Selected php choices:", phpGroup);
		}

		await this.cacheSudo();
		try {
			log.message("Starting setup tasks...");
			// await tasks([{}]);
		} finally {
			clearInterval(this.sudoKeepAlive);
		}

		outro("Setup configuration collected.");
	}
}
