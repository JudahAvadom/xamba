#!/usr/bin/env node

process.removeAllListeners('warning')

import Xamba from "../lib/xamba.js";

const xamba = new Xamba();
xamba.emit('cli');