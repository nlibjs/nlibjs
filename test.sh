#!/bin/bash
set -eux
npx lerna run cleanup --stream --scope @nlib/$1
npx lerna run build --stream --scope @nlib/$1
npx lerna run test --stream --scope @nlib/$1
