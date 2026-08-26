# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

This is the early scaffold of the "Greenhouse" CLI suite. `readme.md` at the repo root is a roadmap/vision doc — treat it as aspirational, not a description of what's implemented. The workspace now follows the `apps/*` + `packages/*` split readme.md describes:

- `apps/greenhouse` — the umbrella Oclif CLI. Has no commands of its own; it loads every `packages/*` tool as an oclif plugin (see `oclif.plugins` in its `package.json`), so all their commands surface flat on the `greenhouse` bin (e.g. `greenhouse setup`).
- `apps/sunroom` — the SvelteKit dashboard (Svelte 5, Tailwind 4). Renamed from `apps/greenhouse-sunroom`; package name is `sunroom`.
- `packages/*` — each standalone tool from readme.md's ecosystem table, each its own installable Oclif CLI with its own `bin`. Runs standalone (`terrarium setup`) or via the umbrella (`greenhouse setup`) — same command, no wrapper code.
- `packages/shared` — shared utilities (not a CLI), moved from the old `apps/greenhouse/src/utils/`. Plain TS lib, built with `tsc`, consumed via `@greenhouse/shared` workspace dependency.

Every command across every package is still just an Oclif "hello world" stub (`this.log('<Name> — work in progress')`) — none contain real command logic yet. Command names were deliberately chosen to be **globally unique across all packages**, because the umbrella merges them flat with no per-tool prefix (an oclif plugin's command id is fixed by its own file layout, not renamed by the host CLI). Don't reintroduce a generic `index.ts` default command or a duplicate verb (e.g. `config`) in a new package without checking for collisions against the table below — two plugins claiming the same id will silently shadow each other under `greenhouse`.

| Package | Command(s) |
|---|---|
| `terrarium` | `setup` |
| `sprout` | `scaffold` |
| `cultivate` | `apply` |
| `planter` | `restore` |
| `branch` | `checkout` |
| `orchard` | `batch` |
| `bud` | `create` |
| `harvest` | `build` |
| `seedbank` | `snapshot`, `list`, `diff`, `destination` |
| `prune` | `clean` |
| `water` | `update` |
| `fertilize` | `optimise` |
| `botanist` | `doctor` (readme's "inspired by `flutter doctor`") |
| `gardener` | `watch`, `status`, `ask`, `insights`, `report`, `forget`, `model` |

## Commands

Run from the repo root unless noted.

```bash
# Install deps (pnpm workspace)
pnpm install

# Root lint (biome + shellcheck + oxlint anti-slop rules)
pnpm lint

# Run umbrella CLI in dev mode
pnpm dev:cli

# Run dashboard in dev mode
pnpm dev:dash          # or: pnpm sunroom

# Build all workspace packages
pnpm build

# Run built CLI / dashboard
pnpm start
pnpm start:dash
```

Per-package commands (run inside the package directory, or via `pnpm --filter <name> <script>`):

**`apps/greenhouse` and every `packages/*` tool (Oclif CLI)**
```bash
pnpm --filter <name> build   # shx rm -rf dist && tsc -b
pnpm --filter <name> lint    # eslint
pnpm --filter <name> test    # mocha --forbid-only "test/**/*.test.ts"
```
Package names are npm-scoped for everything except the umbrella: `@greenhouse/terrarium`, `@greenhouse/sprout`, etc. (`pnpm --filter greenhouse build` for the umbrella itself). There is no `test/` directory in any package yet, so `test` currently has nothing to run. Tests use Mocha + Chai + `ts-node` (ESM loader), configured in `.mocharc.json` — not Vitest, despite what `readme.md` claims for the Node CLI.

**`packages/shared`** — plain TS lib, no oclif/bin. `pnpm --filter @greenhouse/shared build` only.

**`apps/sunroom` (SvelteKit dashboard)**
```bash
pnpm --filter sunroom dev
pnpm --filter sunroom build
pnpm --filter sunroom check   # svelte-kit sync && svelte-check
pnpm --filter sunroom lint    # prettier --check . && eslint .
pnpm --filter sunroom test    # vitest run
pnpm --filter sunroom test:unit -- --watch  # to run a single/watch test
```

## Definition of done

A code change is NOT complete — do not say "done" or stop — until ALL of these ran, in this order, for every turn that touched code:

1. `caveman-review` skill
2. `ponytail-review` skill
3. `fallow-review` skill
4. `pnpm lint` passes clean

Fix everything each step flags before moving to the next. Fixes must be proper root-cause fixes — no inferring, no guessing, no shortcuts (no `// eslint-disable`, no type-cast silencing, no suppressions). Skipping any of the four, or claiming completion before all four are clean, is a failure to follow this file.

`pnpm lint` must pass clean for the whole repo, not just the files touched this turn — pre-existing failures elsewhere in the repo still block completion and must be fixed, not scoped out.

## Code research

Use tokensave MCP tools (`tokensave_context`, `tokensave_search`, etc.) for codebase research and exploration instead of Explore agents.

## Architecture notes

- **Umbrella/plugin dispatch**: `apps/greenhouse/package.json`'s `oclif.plugins` array lists every `@greenhouse/*` tool package as a workspace dependency. Oclif core loads each plugin's `dist/commands/` at runtime and merges them into the umbrella's command list with no prefix — that's what makes `greenhouse setup` resolve to `packages/terrarium`'s `setup` command. A package must be built (`dist/` present) before the umbrella can load its commands.
- **Single-command-CLI gotcha**: oclif treats a package whose *only* command lives at `src/commands/index.ts` as a "single command CLI," which breaks when that package is loaded as a plugin (`MODULE_NOT_FOUND` on `Symbol(SINGLE_COMMAND_CLI)`). Always give a package's command(s) explicit names instead of relying on `index.ts` as a default — this is why `botanist`'s command is `doctor.ts`, not `index.ts`.
- **Shared logic lives in `packages/shared/src/`, not in command files.** When a command stub gets fleshed out, add the dependency `"@greenhouse/shared": "workspace:*"` and import from it rather than inlining logic in the command class. Existing utils (barrel-exported from `packages/shared/src/index.ts`):
  - `gitUtils.ts` — branch existence/checkout/merge helpers built on `execa` + `ora` spinners.
  - `gitBranchNaming.ts` — branch name validation/formatting (expects patterns like `RCH-1234`, `HOTFIX-456`).
  - `gitHandleChanges.ts`, `gitBranches.ts` — git status/branch listing helpers.
  - `errorHandler.ts` — `formatErrorMsg()` normalizes thrown errors to a string; `failOrExit()` is the standard way a command should fail (prints full error and calls `command.error()` in debug mode, otherwise a plain `command.exit(1)`).
  - `execWrapper.ts` — wraps `execa` calls.
  - `createDockerFile.ts`, `getRepoName.ts`, `emoji.ts` — misc scaffolding/formatting helpers.
  - Follow the existing error pattern (`formatErrorMsg` + `spinner.fail`/`failOrExit`) rather than introducing a new error-handling convention.
- **TypeScript config**: every package's `tsconfig.json` matches the original — `strict: true`, `module`/`moduleResolution: Node16`, target `es2022`, `rootDir: src`, `outDir: dist`. Every package is ESM (`"type": "module"`), so relative imports in `.ts` files use `.js` extensions (see `gitUtils.ts` importing `./errorHandler.js`).
- **Linting**: `apps/greenhouse` and every `packages/*` tool use `eslint-config-oclif` + `eslint-config-prettier`, ignoring whatever's in its own `.gitignore`. `apps/sunroom` uses its own ESLint flat config (`eslint-plugin-svelte`, TypeScript-ESLint) plus Prettier. At the repo root, `pnpm lint` also runs Oxlint (`oxlint.config.ts`) with the vendored [anti-slop](https://github.com/dmmulroy/anti-slop) plugin at `tools/oxlint/anti-slop/` (copied via the `install-anti-slop` skill, not hand-written — don't edit it directly, re-run the skill's `scripts/install.mjs --force` to update it). It flags slop patterns like unjustified type assertions, runtime `typeof` narrowing, and unsafe dictionary types across the whole workspace; both Biome and Oxlint ignore `tools/oxlint/anti-slop/` itself.
- **Package manager**: this repo uses pnpm (`packages: [apps/*, packages/*]` in `pnpm-workspace.yaml`), and the CLI tooling is meant to be package-manager-agnostic at runtime (per `readme.md`'s stated goal), but that detection logic isn't implemented yet — don't assume it exists.
- **Sunroom app**: standard SvelteKit 5 + Tailwind 4 skeleton (`src/routes/+page.svelte`, `+layout.svelte`), and Vitest set up for both browser (`vitest-browser-svelte`/Playwright) and unit tests.
