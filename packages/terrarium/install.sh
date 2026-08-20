#!/bin/sh
# Bootstraps Node on a bare machine, then hands off to terrarium's oclif setup.
# Only job: get Node on PATH and exec. Everything else (Nix, Homebrew, dotfiles) is oclif's job.
set -eu

if ! curl -fsS --max-time 5 https://nodejs.org -o /dev/null; then
	echo "terrarium: no internet connection available. Please connect and try again." >&2
	exit 1
fi

# ponytail: pinned bootstrap Node version, bump periodically — Nix takes over node management after handoff
NODE_VERSION="22.11.0"

os="$(uname -s)"
arch="$(uname -m)"

case "$os" in
	Darwin) platform="macos"; node_os="darwin" ;;
	Linux) platform="linux"; node_os="linux" ;;
	*)
		echo "terrarium: unsupported platform '$os' (mac/linux only)" >&2
		exit 1
		;;
esac

case "$arch" in
	arm64 | aarch64) node_arch="arm64" ;;
	x86_64) node_arch="x64" ;;
	*)
		echo "terrarium: unsupported architecture '$arch'" >&2
		exit 1
		;;
esac

if [ "$platform" = "macos" ]; then
	if xcode-select -p >/dev/null 2>&1; then
		echo "terrarium: Xcode Command Line Tools already installed. Skipping..."
	else
		echo "terrarium: installing Xcode Command Line Tools..."
		xcode-select --install >/dev/null 2>&1
		until xcode-select -p >/dev/null 2>&1; do
			sleep 5
		done
		echo "terrarium: Xcode Command Line Tools installed."
	fi
fi

if ! command -v node >/dev/null 2>&1 || [ "$(node -e 'console.log(process.versions.node.split(".")[0])')" -lt 18 ]; then
	echo "terrarium: bootstrapping Node ${NODE_VERSION}..."
	tmp_dir="$(mktemp -d)"
	trap 'rm -rf "$tmp_dir"' EXIT
	archive="node-v${NODE_VERSION}-${node_os}-${node_arch}"
	curl -fsSL "https://nodejs.org/dist/v${NODE_VERSION}/${archive}.tar.gz" -o "$tmp_dir/node.tar.gz"
	tar -xzf "$tmp_dir/node.tar.gz" -C "$tmp_dir"
	PATH="$tmp_dir/${archive}/bin:$PATH"
	export PATH
fi

echo "terrarium: handing off to setup (platform: ${platform})..."
exec npx --yes @greenhouse/terrarium@latest setup "$platform"
