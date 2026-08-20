#!/usr/bin/env -S node --loader ts-node/esm --disable-warning=ExperimentalWarning

import { execute, settings } from "@oclif/core";

settings.performanceEnabled = true;

await execute({ development: true, dir: import.meta.url });
