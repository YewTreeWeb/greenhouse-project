# 🌿 Greenhouse CLI Suite

![WIP](https://img.shields.io/badge/-work%20in%20progress-orange?style=flat-square)
![Node.js](https://img.shields.io/badge/-Node.js%2018%2B-green?style=flat-square)
![Deno](https://img.shields.io/badge/-Deno%20planned-lightgrey?style=flat-square)
![Platform](https://img.shields.io/badge/-macOS%20%7C%20Linux-blue?style=flat-square)

**Greenhouse** is an umbrella CLI designed to be a modular suite of CLI tools for planting, cultivating, and harvesting your development environment — from system setup to production builds.

Each tool in the ecosystem can be run **standalone** or **under the `greenhouse` umbrella**. No lock-in, no opinions forced on you.

---

## 🌱 Ecosystem

| Command | Role | Status |
|---|---|---|
| `terrarium` | Bootstrap a fresh Mac or Linux machine — Nix-first setup, Homebrew (macOS), dotfiles, SSH, git config | ![WIP](https://img.shields.io/badge/-work%20in%20progress-orange?style=flat-square) |
| `sprout` | Scaffold a new project (Vite, Astro, Laravel 12) with opinionated defaults and official starter kits | ![WIP](https://img.shields.io/badge/-work%20in%20progress-orange?style=flat-square) |
| `cultivate` | Apply dev configs to an existing project (ESLint, Prettier, Tailwind, Stylelint) | ![Planned](https://img.shields.io/badge/-planned-lightgrey?style=flat-square) |
| `planter` | Restore a project from a Seedbank snapshot — the replant side of the backup/restore workflow | ![Planned](https://img.shields.io/badge/-planned-lightgrey?style=flat-square) |
| `branch` | Git management — simplified branch creation, switching, deletion with stash safety | ![Planned](https://img.shields.io/badge/-planned-lightgrey?style=flat-square) |
| `orchard` | Batch operations across multiple projects at once | ![Planned](https://img.shields.io/badge/-planned-lightgrey?style=flat-square) |
| `bud` | Spin up a sandbox dev environment with optional Docker isolation and TTL-based auto-teardown | ![Planned](https://img.shields.io/badge/-planned-lightgrey?style=flat-square) |
| `harvest` | Build and export project artifacts | ![Planned](https://img.shields.io/badge/-planned-lightgrey?style=flat-square) |
| `seedbank` | Dual-scope backup — git-backed snapshots for projects, local manifest backups for system state (Homebrew packages, dotfiles, global tools) | ![Planned](https://img.shields.io/badge/-planned-lightgrey?style=flat-square) |
| `prune` | Clean unused files, dependencies, and branches | ![Planned](https://img.shields.io/badge/-planned-lightgrey?style=flat-square) |
| `water` | Update packages and dependencies across a project | ![Planned](https://img.shields.io/badge/-planned-lightgrey?style=flat-square) |
| `fertilize` | Optimise — lint, purge Tailwind, compress assets, warm caches | ![Planned](https://img.shields.io/badge/-planned-lightgrey?style=flat-square) |
| `botanist` | Full environment health check — inspect every tool, report green/amber/red, provide one-line fix hints | ![Planned](https://img.shields.io/badge/-planned-lightgrey?style=flat-square) |
| `sunroom` | Launch the Greenhouse dashboard UI (Tauri desktop app + SvelteKit frontend) | ![Planned](https://img.shields.io/badge/-planned-lightgrey?style=flat-square) |
| `gardener` | AI-powered project intelligence — watches all projects, surfaces proactive insights, answers natural language queries via local Ollama | ![Planned](https://img.shields.io/badge/-planned-lightgrey?style=flat-square) |

---

## 🌰 Backup & Restore

`seedbank` and `planter` are two halves of the same workflow. Seedbank takes the snapshot and stores it; Planter retrieves it and replants.

### 🌰 Seedbank

Commits project and system manifests to the configured destination, recording package versions, config files, env var keys (not values), and project metadata. Large artifacts — `node_modules`, build output, binaries — are excluded via `.seedbankignore` and reinstalled fresh from the manifest on restore.

By default, Seedbank writes to a local directory in your home folder with no configuration needed:

```
~/.greenhouse/seedbank/
```

When you're ready to push backups off-machine, configure a remote destination:

```bash
# View current destination
seedbank config

# Local (default — created automatically)
seedbank config --destination local

# GitHub / Gitea private repo
seedbank config --destination github --repo git@github.com:mat/greenhouse-seeds.git

# NAS (via mounted path or SSH)
seedbank config --destination nas --path /Volumes/NAS/greenhouse-seeds
seedbank config --destination nas --path ssh://mat@192.168.1.10:/volume1/seeds

# Any custom path
seedbank config --destination /path/to/wherever
```

The destination is stored in `~/.config/greenhouse/config.json`. You can switch at any time — Seedbank syncs to the new location on the next snapshot.

**Project snapshots**

```bash
seedbank snapshot my-app       # snapshot a project
seedbank snapshot --all        # snapshot all tracked projects
seedbank list my-app           # list all snapshots for a project
seedbank diff my-app@2026-01-15 my-app@2026-03-01
```

**System snapshots**

Backs up your entire global environment so you can fully rebuild a machine from scratch:

```bash
seedbank snapshot --system
```

| Source | What's saved |
|---|---|
| Homebrew | `brew bundle dump` → `Brewfile` |
| npm globals | `npm list -g --depth=0` |
| pnpm globals | `pnpm list -g` |
| Bun globals | `bun pm ls -g` |
| Ruby gems | `gem list` |
| pip packages | `pip freeze` → `requirements.txt` |
| Composer global | `composer global show` |
| VS Code extensions | `code --list-extensions` |
| macOS defaults | Selected `defaults export` values |
| Dotfiles manifest | List of tracked dotfile paths |

System snapshots are stored at `system/YYYY-MM-DD/` in the configured destination. On a fresh machine, `terrarium setup` bootstraps Nix and Homebrew, then `planter restore --system` rehydrates everything else.

### 🪴 Planter

Retrieves seeds from the Seedbank destination and replants them — reinstalling dependencies from the manifest and rehydrating the project back to its saved state.

```bash
planter restore my-app                    # restore latest snapshot
planter restore my-app@2026-01-15         # restore a specific date
planter restore my-app --dry-run          # preview without changing anything
planter restore my-app --out ./recovered  # restore to a new directory
planter restore --system                  # restore system-level packages
planter restore --system@2026-01-15       # restore system from a specific date
```

Seedbank stores the seeds. Planter puts them back in the ground.

---

## 🔬 Botanist

`botanist` is the Greenhouse environment health check, inspired by `flutter doctor`. It inspects every tool in your environment and produces a structured report with green ✅ / amber ⚠️ / red ❌ status per item, and a one-line fix hint for anything that needs attention.

```bash
# Run via umbrella
greenhouse botanist

# Or standalone
botanist
```

Example output:

```
┌  🔬 Greenhouse Botanist
│
  ✅ Node.js                 v20.11.0
  ✅ Git                     git version 2.43.0
  ✅ Bun                     1.1.3
  ✅ pnpm                    9.1.0
  ⚠️  Deno                    not found
     → brew install deno
  ✅ Docker                  25.0.3
  ❌ Laravel installer        not found
     → composer global require laravel/installer
  ✅ Git identity            Mat Teague <mat@yewtreeweb.co.uk>
  ⚠️  SSH key                 no key in ssh-agent
     → ssh-add ~/.ssh/id_ed25519
  ✅ Greenhouse config       ~/.config/greenhouse/config.json (v1.0.0)

└  1 issue · 2 warnings — run fix commands above to resolve
```

Checks performed:

- Node.js version (18+ required)
- Git, Bun, pnpm, Deno, Docker, PHP, Composer
- Laravel installer
- Git global identity (name + email)
- SSH agent key
- Greenhouse config file

---

## 🌿 Gardener

`gardener` is the most powerful and distinctive tool in the Greenhouse ecosystem. Unlike every other command — which you invoke to do a specific task — Gardener **watches and advises**. It runs as a background daemon, builds a local knowledge graph of all your projects over time, and surfaces proactive insights without you having to ask.

All intelligence runs through your local [Ollama](https://ollama.ai) instance. **No data ever leaves your machine.**

```bash
# Start the background watcher
gardener watch

# Get a snapshot of all project health right now
gardener status

# Ask a natural language question
gardener ask "which of my projects is most out of date?"
gardener ask "what should I work on first today?"
gardener ask "why is my Vite build getting slower?"

# View all current recommendations
gardener insights

# Generate a weekly digest report
gardener report

# Stop tracking a project
gardener forget my-app
```

### What Gardener watches

- Git activity (commit frequency, stale branches, uncommitted changes)
- Dependency age and security advisories
- Bundle size trends over time
- Test coverage drift
- TODO/FIXME accumulation
- Unused exports and dead code signals
- Sandbox (Bud) usage — flags dormant containers

### Example output

```
🌿 Gardener insights — 3 projects analysed

  frontend       ⚠  4 dependencies with security advisories
                    → run: greenhouse water --project frontend

  api            ⚠  Test coverage dropped 12% since last sprint
                    8 new functions have no tests

  sandbox-demo   ℹ  Created 18 days ago, no commits since creation
                    → run: greenhouse prune --sandboxes
```

### How the Ollama integration works

Gardener assembles a structured context payload from the knowledge graph — package versions, git log summary, file change frequency, bundle stats — and sends it to your configured local model. The `ask` subcommand pipes your question and this context into the model and streams the response back to your terminal or the Sunroom dashboard.

```bash
# Configure which Ollama model to use
gardener config --model llama3
gardener config --model codellama

# Check current config
gardener config
```

### Sunroom integration

Gardener has a dedicated panel in the Sunroom dashboard, showing:

- Live insight cards per project
- A chat-style input for `ask` queries
- Trend graphs for coverage, bundle size, and dependency age
- One-click actions to act on recommendations (run `water`, `prune`, etc.)

---

## 🚀 Getting started

### Two flavours

| Flavour | Runtime | Framework | Install |
|---|---|---|---|
| **Node** (active) | Node.js 18+ / Bun | Oclif + Clack | `npm install -g @greenhouse/cli` |
| **Deno** (planned) | Deno 1.40+ | Cliffy | `deno install --allow-all jsr:@greenhouse/cli` |

```bash
# npm
npm install -g @greenhouse/cli

# pnpm
pnpm add -g @greenhouse/cli

# bun
bun add -g @greenhouse/cli

# Homebrew (coming soon)
brew install greenhouse
```

Every command is available under the umbrella or as a standalone binary:

```bash
# Umbrella
greenhouse botanist
greenhouse sprout my-app --stack laravel --framework react
greenhouse sunroom

# Standalone aliases
botanist
sprout my-app --stack vite --framework vue --typescript
gardener watch
```

---

## 🏗️ Architecture

```
greenhouse/
├── apps/
│   ├── greenhouse/       # Umbrella CLI entry point (Oclif)
│   └── sunroom/          # Dashboard UI (SvelteKit + Tauri)
├── packages/
│   ├── terrarium/        # Machine setup
│   ├── sprout/           # Project scaffolding
│   ├── cultivate/        # Config applier
│   ├── planter/          # Seedbank restorer (restore side of backup/restore)
│   ├── branch/           # Git management
│   ├── orchard/          # Batch operations
│   ├── bud/              # Sandbox environments
│   ├── harvest/          # Build / export
│   ├── seedbank/         # Project snapshots + system manifest backups
│   ├── prune/            # Cleanup
│   ├── water/            # Dependency updates
│   ├── fertilize/        # Optimisation
│   ├── botanist/         # Environment health check
│   ├── gardener/         # AI project intelligence (Ollama)
│   └── shared/           # Shared utilities
│       ├── dockerUtils.ts
│       ├── emojiUtils.ts
│       ├── packageManager.ts
│       └── execaWrapper.ts
├── pnpm-workspace.yaml
└── package.json
```

### Key decisions

- **No Express** — native Node `http` / `ws` only for the Sunroom server
- **Package manager agnostic** — Bun, pnpm, npm all supported via `detectPackageManager()`
- **No `any` types** — strict TypeScript throughout
- **Global config** at `~/.config/greenhouse/config.json`
- **Clack** for all interactive prompts (Node version)
- **Cliffy** for all interactive prompts (Deno version)
- **Vitest** for all tests (Node), built-in test runner (Deno)
- **Tauri** for the Sunroom desktop app — native webview, ~8MB bundle, no Chromium
- **Ollama** for Gardener — local LLM inference, no external API calls

---

## 🌿 Gardener — Deno architecture (planned)

The Deno version of Gardener uses Cliffy for the CLI surface and Deno's native file system watchers for the daemon:

```
packages/
└── gardener-deno/
    ├── src/
    │   ├── commands/
    │   │   ├── watch.ts      # fs.watchFs daemon
    │   │   ├── ask.ts        # Ollama query with context
    │   │   ├── insights.ts   # recommendation engine
    │   │   ├── report.ts     # weekly digest
    │   │   └── status.ts     # snapshot view
    │   ├── graph/
    │   │   ├── builder.ts    # knowledge graph construction
    │   │   └── store.ts      # local SQLite via Deno KV
    │   └── ollama/
    │       └── client.ts     # HTTP client for local Ollama
    ├── deno.json
    └── mod.ts
```

---

## 🧪 Testing

**Node version**

```bash
pnpm test
pnpm --filter @greenhouse/botanist test
pnpm test --watch
```

**Deno version** *(planned)*

```bash
deno test
```

Tests use Vitest (Node) and Deno's built-in test runner. No `any` types permitted.

---

## 🛠️ Development

```bash
# Run a command in dev mode
pnpm --filter @greenhouse/sprout dev

# Build a single package
pnpm --filter @greenhouse/sprout build

# Build everything
pnpm build

# Lint / type check
pnpm lint
pnpm typecheck
```

---

## ⚙️ Configuration

Global config at `~/.config/greenhouse/config.json`.

```json
{
  "defaultPackageManager": "pnpm",
  "defaultFramework": "vite",
  "editor": "code",
  "seedbank": {
    "destination": "local",
    "localPath": "~/.greenhouse/seedbank",
    "remote": null,
    "ignorePatterns": ["node_modules", "dist", ".git", "*.log"]
  },
  "gardener": {
    "ollamaModel": "llama3",
    "ollamaHost": "http://localhost:11434",
    "watchedProjects": [],
    "reportSchedule": "weekly"
  }
}
```

The `seedbank.destination` field accepts:

| Value | Description |
|---|---|
| `"local"` | Default — writes to `~/.greenhouse/seedbank`. Created automatically on first snapshot. |
| `"github"` | Push to a private GitHub or Gitea repo. Set `remote` to the SSH clone URL. |
| `"nas"` | Write to a NAS via mounted volume path or SSH path. Set `remote` to the target path. |
| Any absolute path | Write to any custom directory on your system. |

Switching destinations only affects future snapshots — existing local snapshots stay in place until you manually migrate them.

Run `greenhouse config` to view or edit settings interactively, or `seedbank config` to update just the Seedbank destination.

---

## 📖 Documentation

Full docs available at the [Greenhouse docs site](https://greenhouse.yewtreeweb.co.uk) — built with Astro Starlight.

---

## 📄 Licence

MIT © Mathew Teague / [Yew Tree Web](https://yewtreeweb.co.uk)
