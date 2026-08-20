# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

This is the early scaffold of the "Greenhouse" CLI suite. `readme.md` at the repo root describes an ambitious future monorepo (a `packages/*` workspace of tools like `terrarium`, `sprout`, `cultivate`, `seedbank`, `gardener`, etc., plus a Deno/Cliffy port). **None of that exists yet.** The real, current workspace is defined by `pnpm-workspace.yaml`, which only includes `apps/*`:

- `apps/greenhouse` — the Oclif-based CLI (Node/TypeScript, ESM)
- `apps/greenhouse-sunroom` — a SvelteKit dashboard (Svelte 5, Tailwind 4)

Treat `readme.md` as a roadmap/vision doc, not a description of what's implemented. Don't assume a `packages/` directory, a `gardener` Ollama integration, or a Deno build exist — check the actual filesystem first.

Inside `apps/greenhouse/src/commands/`, every command file (`branch.ts`, `bud.ts`, `cultivate.ts`, `fertilise.ts`, `harvest.ts`, `orchard.ts`, `plant.ts`, `planter.ts`, `prune.ts`, `seedbank.ts`, `sunroom.ts`, `terrarium.ts`, `water.ts`) is still the unmodified Oclif "hello world" generator stub — none contain real command logic yet. `src/config.ts` is an empty placeholder. The actual working logic so far lives in `apps/greenhouse/src/utils/`.

## Commands

Run from the repo root unless noted.

```bash
# Install deps (pnpm workspace)
pnpm install

# Run CLI in dev mode
pnpm dev:cli

# Run dashboard in dev mode
pnpm dev:dash          # or: pnpm sunroom

# Build all workspace packages
pnpm build

# Run built CLI / dashboard
pnpm start
pnpm start:dash
```

Per-app commands (run inside the app directory, or via `pnpm --filter <name> <script>`):

**`apps/greenhouse` (Oclif CLI)**
```bash
pnpm --filter greenhouse build   # shx rm -rf dist && tsc -b
pnpm --filter greenhouse lint    # eslint
pnpm --filter greenhouse test    # mocha --forbid-only "test/**/*.test.ts"
```
Note: there is no `test/` directory yet, so `test` currently has nothing to run. Tests use Mocha + Chai + `ts-node` (ESM loader), configured in `.mocharc.json` — not Vitest, despite what `readme.md` claims for the Node CLI.

**`apps/greenhouse-sunroom` (SvelteKit dashboard)**
```bash
pnpm --filter greenhouse-sunroom dev
pnpm --filter greenhouse-sunroom build
pnpm --filter greenhouse-sunroom check   # svelte-kit sync && svelte-check
pnpm --filter greenhouse-sunroom lint    # prettier --check . && eslint .
pnpm --filter greenhouse-sunroom test    # vitest run
pnpm --filter greenhouse-sunroom test:unit -- --watch  # to run a single/watch test
```

## Architecture notes

- **CLI dispatch**: `apps/greenhouse/src/index.ts` just re-exports Oclif's `run`. `apps/greenhouse/bin/run.js` is the executable entry point. Commands are auto-discovered from `src/commands/` per the `oclif` config block in `apps/greenhouse/package.json` (`dirname: "greenhouse"`, `topicSeparator: " "`).
- **Shared logic lives in `utils/`, not in command files.** When a command stub gets fleshed out, wire it to functions in `src/utils/` rather than inlining logic in the command class. Existing examples:
  - `gitUtils.ts` — branch existence/checkout/merge helpers built on `execa` + `ora` spinners.
  - `gitBranchNaming.ts` — branch name validation/formatting (expects patterns like `RCH-1234`, `HOTFIX-456`).
  - `gitHandleChanges.ts`, `gitBranches.ts` — git status/branch listing helpers.
  - `errorHandler.ts` — `formatErrorMsg()` normalizes thrown errors to a string; `failOrExit()` is the standard way a command should fail (prints full error and calls `command.error()` in debug mode, otherwise a plain `command.exit(1)`).
  - `execWrapper.ts` — wraps `execa` calls.
  - `createDockerFile.ts`, `getRepoName.ts`, `emoji.ts` — misc scaffolding/formatting helpers.
  - Follow the existing error pattern (`formatErrorMsg` + `spinner.fail`/`failOrExit`) rather than introducing a new error-handling convention.
- **TypeScript config** (`apps/greenhouse/tsconfig.json`): `strict: true`, `module`/`moduleResolution: Node16`, target `es2022`, `rootDir: src`, `outDir: dist`. The package is ESM (`"type": "module"`), so relative imports in `.ts` files use `.js` extensions (see `gitUtils.ts` importing `./errorHandler.js`).
- **Linting**: `apps/greenhouse` uses `eslint-config-oclif` + `eslint-config-prettier`, ignoring whatever's in its `.gitignore`. `apps/greenhouse-sunroom` uses its own ESLint flat config (`eslint-plugin-svelte`, TypeScript-ESLint) plus Prettier.
- **Package manager**: this repo uses pnpm (`packageManager` enforced via `pnpm-workspace.yaml`), and `apps/greenhouse`'s own utils are meant to be package-manager-agnostic at runtime (per `readme.md`'s stated goal), but that detection logic isn't implemented yet — don't assume it exists.
- **Sunroom app**: standard SvelteKit 5 + Tailwind 4 skeleton (`src/routes/+page.svelte`, `+layout.svelte`), one API route stub at `src/routes/api/greenhouse.ts` (currently empty), and Vitest set up for both browser (`vitest-browser-svelte`/Playwright) and unit tests.
