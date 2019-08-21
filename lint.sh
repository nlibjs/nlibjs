#!/bin/bash
set -eux
npx lerna run lint --scope @nlib/$1
