# 🌿 Greenhouse CLI Suite

**Greenhouse** is an umbrella CLI designed to nurture your development environment — from setup to deployment — with a natural, modular ecosystem of tools.

Each subcommand represents a growing phase of your system, from “seeding” your environment to “harvesting” production builds.

---

## 🌱 Overview

The **Greenhouse ecosystem** includes standalone tools that can also run independently:

| CLI Tool     | Description |
|--------------|-------------|
| **🌳 Greenhouse** | The main umbrella CLI — orchestrates the suite, configuration, plugins, and the dashboard (Sunroom). |
| **🏡 Terrarium** | Bootstraps and maintains system setup using **Nix** and **Homebrew** (macOS/Linux). |
| **🌱 Sprout** | Scaffolds projects (Vite, Astro, Laravel starter kits). |
| **🌾 Cultivate** | Applies dev configs (ESLint, Prettier, Tailwind, presets). |
| **🪴 Planter** | Plants starter templates / clones starter repos. |
| **🌳 Branch** | Git branch management (create, switch, delete). |
| **🍎 Orchard** | Multi-project orchestration (batch install, run dev). |
| **🌸 Bud** | Sandbox environments (local dev, optional Docker). |
| **🍂 Harvest** | Build/export artifacts, prepare deployables. |
| **🌰 Seedbank** | Backup / restore project seeds and templates. |
| **✂️ Prune** | Clean unused files, caches, or branches. |
| **💧 Water** | Update packages, system maintenance tasks. |
| **🌱💨 Fertilize** | Optimize projects (lint fixes, cache rebuilds, Tailwind purge, assets). |
| **☀️ Sunroom** | Dashboard UI to run and monitor commands (SvelteKit frontend, launched via CLI). |

---

## 🧩 Installation

### Option 1: via npm (recommended)
```bash
npm install -g @greenhouse/cli
```

### Option 2: manual / monorepo (pnpm workspace)
Clone the repo and use pnpm to run locally:
```bash
git clone <repo-url> greenhouse
cd greenhouse
pnpm install
# Start CLI in dev
pnpm --filter greenhouse dev
# Start Sunroom locally
pnpm --filter sunroom dev
```

## Usage

### Global (umbrella) usage
Run any command through the umbrella binary:
```bash
greenhouse <command> [flags]
```

#### Examples
```bash
# Run a maintenance task
greenhouse water --cache --force

# Create a sandbox and dockerize it
greenhouse bud --name test-sandbox --docker

# Launch the dashboard (Sunroom)
greenhouse sunroom
```

#### Standalone CLI usage
Each command can also be installed/run independently (aliases are provided in bin/):
```bash
bud --name my-sandbox --serve
water --cache
prune --node
fertilize --project myapp --tailwind --assets
```

## Configuration
A central config file (`~/.config/greenhouse/config.json` by default) governs behavior. A `config.ts` helper in the repo provides loading/saving utilities.

### Example config shape
```ts
export interface GreenhouseConfig {
  version: string;
  paths: {
    root: string;
    projects: string;
    backups: string;
    sandboxes: string;
    logs: string;
  };
  toggles: {
    nixEnabled: boolean;
    homebrewEnabled: boolean;
    dockerEnabled: boolean;
  };
  defaults: {
    packageManager: 'pnpm' | 'npm' | 'yarn';
    editor: string;
  };
  dashboard: {
    port: number;
    openBrowser: boolean;
  };
  theme: 'light' | 'dark';
}
```

### Commands can read/update config:
```bash
# View config
greenhouse config

# Set a value
greenhouse config --set dashboard.port=5173
```

## Commands & Examples

### Sprout (scaffold)
Scaffold projects quickly using supported stacks.
```bash
# Vite React project (TypeScript)
sprout myapp --stack vite --framework react --typescript

# Laravel with React starter kit via umbrella
greenhouse sprout myapp --stack laravel --framework react
```
