greenhouse
=================

A new CLI generated with oclif


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/greenhouse.svg)](https://npmjs.org/package/greenhouse)
[![Downloads/week](https://img.shields.io/npm/dw/greenhouse.svg)](https://npmjs.org/package/greenhouse)


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g greenhouse
$ greenhouse COMMAND
running command...
$ greenhouse (--version)
greenhouse/0.0.0 linux-x64 node-v24.10.0
$ greenhouse --help [COMMAND]
USAGE
  $ greenhouse COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`greenhouse hello PERSON`](#greenhouse-hello-person)
* [`greenhouse hello world`](#greenhouse-hello-world)
* [`greenhouse help [COMMAND]`](#greenhouse-help-command)
* [`greenhouse plugins`](#greenhouse-plugins)
* [`greenhouse plugins add PLUGIN`](#greenhouse-plugins-add-plugin)
* [`greenhouse plugins:inspect PLUGIN...`](#greenhouse-pluginsinspect-plugin)
* [`greenhouse plugins install PLUGIN`](#greenhouse-plugins-install-plugin)
* [`greenhouse plugins link PATH`](#greenhouse-plugins-link-path)
* [`greenhouse plugins remove [PLUGIN]`](#greenhouse-plugins-remove-plugin)
* [`greenhouse plugins reset`](#greenhouse-plugins-reset)
* [`greenhouse plugins uninstall [PLUGIN]`](#greenhouse-plugins-uninstall-plugin)
* [`greenhouse plugins unlink [PLUGIN]`](#greenhouse-plugins-unlink-plugin)
* [`greenhouse plugins update`](#greenhouse-plugins-update)

## `greenhouse hello PERSON`

Say hello

```
USAGE
  $ greenhouse hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ greenhouse hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/YewTreeWeb/greenhouse/blob/v0.0.0/src/commands/hello/index.ts)_

## `greenhouse hello world`

Say hello world

```
USAGE
  $ greenhouse hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ greenhouse hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/YewTreeWeb/greenhouse/blob/v0.0.0/src/commands/hello/world.ts)_

## `greenhouse help [COMMAND]`

Display help for greenhouse.

```
USAGE
  $ greenhouse help [COMMAND...] [-n]

ARGUMENTS
  [COMMAND...]  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for greenhouse.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.33/src/commands/help.ts)_

## `greenhouse plugins`

List installed plugins.

```
USAGE
  $ greenhouse plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ greenhouse plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.50/src/commands/plugins/index.ts)_

## `greenhouse plugins add PLUGIN`

Installs a plugin into greenhouse.

```
USAGE
  $ greenhouse plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into greenhouse.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the GREENHOUSE_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the GREENHOUSE_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ greenhouse plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ greenhouse plugins add myplugin

  Install a plugin from a github url.

    $ greenhouse plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ greenhouse plugins add someuser/someplugin
```

## `greenhouse plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ greenhouse plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ greenhouse plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.50/src/commands/plugins/inspect.ts)_

## `greenhouse plugins install PLUGIN`

Installs a plugin into greenhouse.

```
USAGE
  $ greenhouse plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into greenhouse.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the GREENHOUSE_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the GREENHOUSE_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ greenhouse plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ greenhouse plugins install myplugin

  Install a plugin from a github url.

    $ greenhouse plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ greenhouse plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.50/src/commands/plugins/install.ts)_

## `greenhouse plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ greenhouse plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ greenhouse plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.50/src/commands/plugins/link.ts)_

## `greenhouse plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ greenhouse plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ greenhouse plugins unlink
  $ greenhouse plugins remove

EXAMPLES
  $ greenhouse plugins remove myplugin
```

## `greenhouse plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ greenhouse plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.50/src/commands/plugins/reset.ts)_

## `greenhouse plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ greenhouse plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ greenhouse plugins unlink
  $ greenhouse plugins remove

EXAMPLES
  $ greenhouse plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.50/src/commands/plugins/uninstall.ts)_

## `greenhouse plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ greenhouse plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ greenhouse plugins unlink
  $ greenhouse plugins remove

EXAMPLES
  $ greenhouse plugins unlink myplugin
```

## `greenhouse plugins update`

Update installed plugins.

```
USAGE
  $ greenhouse plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.50/src/commands/plugins/update.ts)_
<!-- commandsstop -->
