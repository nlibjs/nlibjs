#!/bin/bash
set -eux
npx lerna run build --scope @nlib/$1
npx lerna run test --scope @nlib/$1
