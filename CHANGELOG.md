# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.2.0](https://github.com/nlibjs/nlibjs/compare/v3.1.0...v3.2.0) (2019-01-22)


### Bug Fixes

* **afs:** fix import statements ([514acb3](https://github.com/nlibjs/nlibjs/commit/514acb3))
* **afs:** sort the lists before comparison ([fc27aeb](https://github.com/nlibjs/nlibjs/commit/fc27aeb))
* **global:** export Types instaed of defining ([4e911d3](https://github.com/nlibjs/nlibjs/commit/4e911d3))
* **global:** stop exporting Symbol ([3fdcb07](https://github.com/nlibjs/nlibjs/commit/3fdcb07))
* **global:** update constants ([5f38555](https://github.com/nlibjs/nlibjs/commit/5f38555))
* **infra:** add shim files ([c500fd7](https://github.com/nlibjs/nlibjs/commit/c500fd7))
* **lint:** disable some rules in .ts ([f68f7f7](https://github.com/nlibjs/nlibjs/commit/f68f7f7))
* **lint:** enable capitalized-comments ([acb0fc7](https://github.com/nlibjs/nlibjs/commit/acb0fc7))
* **lint:** enable capitalized-comments ([e284cf9](https://github.com/nlibjs/nlibjs/commit/e284cf9))
* **media-type:** disable no-console ([531f023](https://github.com/nlibjs/nlibjs/commit/531f023))
* **media-type:** fix constants ([03399e4](https://github.com/nlibjs/nlibjs/commit/03399e4))
* **media-type:** fix eslint errors ([005c653](https://github.com/nlibjs/nlibjs/commit/005c653))
* **media-type:** fix the build command ([c2bd717](https://github.com/nlibjs/nlibjs/commit/c2bd717))
* **node-global:** fix the before-test hook ([683afec](https://github.com/nlibjs/nlibjs/commit/683afec))
* **node-global:** fix the list of variable names to be ignored ([615b014](https://github.com/nlibjs/nlibjs/commit/615b014))
* **node-global:** ignore Symbol ([4966113](https://github.com/nlibjs/nlibjs/commit/4966113))
* **node-util:** update README ([cffdaf1](https://github.com/nlibjs/nlibjs/commit/cffdaf1))
* **unicode:** use NameAliases ([5d0d2f7](https://github.com/nlibjs/nlibjs/commit/5d0d2f7))
* **util:** fix comparator of comparator ([ce98abd](https://github.com/nlibjs/nlibjs/commit/ce98abd))


### Features

* **global:** add [@nlib](https://github.com/nlib)/global ([41f9926](https://github.com/nlibjs/nlibjs/commit/41f9926))
* **global:** declare Brand and Integer ([2d3cb01](https://github.com/nlibjs/nlibjs/commit/2d3cb01))
* **infra:** add Byte and isByte ([618ce81](https://github.com/nlibjs/nlibjs/commit/618ce81))
* **infra:** add codepoints ([951d73b](https://github.com/nlibjs/nlibjs/commit/951d73b))
* **infra:** add infra ([8652926](https://github.com/nlibjs/nlibjs/commit/8652926))
* **infra:** add skipASCIIWhitespace() ([8eb91e3](https://github.com/nlibjs/nlibjs/commit/8eb91e3))
* **infra:** add some methods for ScalarValueString ([3828f69](https://github.com/nlibjs/nlibjs/commit/3828f69))
* **infra:** add toScalaValueString() ([1a5b3c5](https://github.com/nlibjs/nlibjs/commit/1a5b3c5))
* **infra:** add toString ([bf25b10](https://github.com/nlibjs/nlibjs/commit/bf25b10))
* **infra:** use ScalarValueString ([96f5302](https://github.com/nlibjs/nlibjs/commit/96f5302))
* **media-type:** add media-type package (WIP) ([2730046](https://github.com/nlibjs/nlibjs/commit/2730046))
* **media-type:** add the parse() function ([#16](https://github.com/nlibjs/nlibjs/issues/16)) ([674f592](https://github.com/nlibjs/nlibjs/commit/674f592))
* **real-number:** add "real-number" package ([#8](https://github.com/nlibjs/nlibjs/issues/8)) ([f7d8ee5](https://github.com/nlibjs/nlibjs/commit/f7d8ee5))
* **real-number:** add ZSet ([5d965a5](https://github.com/nlibjs/nlibjs/commit/5d965a5))
* **unicode:** add unicode package ([#9](https://github.com/nlibjs/nlibjs/issues/9)) ([998933a](https://github.com/nlibjs/nlibjs/commit/998933a)), closes [#10](https://github.com/nlibjs/nlibjs/issues/10)
* remove set ([644a804](https://github.com/nlibjs/nlibjs/commit/644a804))
* **node-global:** add [@nlib](https://github.com/nlib)/node-global ([50ed403](https://github.com/nlibjs/nlibjs/commit/50ed403))
* **node-util:** add httpGet and readStream ([1c73f0c](https://github.com/nlibjs/nlibjs/commit/1c73f0c))
* **set:** add BinaryRelation ([e679cef](https://github.com/nlibjs/nlibjs/commit/e679cef))
* **util:** add NumberComparator ([432afde](https://github.com/nlibjs/nlibjs/commit/432afde))
* **xml-js:** add utilities for xml-js ([cc46e63](https://github.com/nlibjs/nlibjs/commit/cc46e63))





# 3.1.0 (2018-12-29)


### Bug Fixes

* **afs:** add semicolon ([c656fcd](https://github.com/nlibjs/nlibjs/commit/c656fcd))
* **afs:** check existence before promisify ([a151a79](https://github.com/nlibjs/nlibjs/commit/a151a79))
* **afs:** fix writeFilep not to return before writing ([bf5f03f](https://github.com/nlibjs/nlibjs/commit/bf5f03f))
* insert "run" to get detailed coverage report ([d8b6cb3](https://github.com/nlibjs/nlibjs/commit/d8b6cb3))
* **afs:** remove invalid promisify ([f98cc16](https://github.com/nlibjs/nlibjs/commit/f98cc16))
* add eslintConfig.env.es6: true ([1c3df03](https://github.com/nlibjs/nlibjs/commit/1c3df03))
* **afs:** retry removal if error.code is EBUSY ([4c9f403](https://github.com/nlibjs/nlibjs/commit/4c9f403))
* fix test command ([63e7d38](https://github.com/nlibjs/nlibjs/commit/63e7d38))
* fix the lint command ([7cd71fa](https://github.com/nlibjs/nlibjs/commit/7cd71fa))
* run init before test ([e0afa43](https://github.com/nlibjs/nlibjs/commit/e0afa43))
* use "rimraf" instead of "rm -rf" ([d78fed8](https://github.com/nlibjs/nlibjs/commit/d78fed8))
* **afs:** skip promisify-ing lchmod and lchown ([#1](https://github.com/nlibjs/nlibjs/issues/1)) ([bf7b548](https://github.com/nlibjs/nlibjs/commit/bf7b548))
* **afs:** wait before retrying ([42f4255](https://github.com/nlibjs/nlibjs/commit/42f4255))
* **lint:** add no-useless-catch ([59ffd43](https://github.com/nlibjs/nlibjs/commit/59ffd43))
* **lint:** disable no-unused-vars on .ts files ([660655b](https://github.com/nlibjs/nlibjs/commit/660655b))


### Features

* **afs:** add isSameFile ([79ce910](https://github.com/nlibjs/nlibjs/commit/79ce910))
* **afs:** add lock, unlock and check ([442df83](https://github.com/nlibjs/nlibjs/commit/442df83))
* **afs:** add mktempdir.ts ([f57b0c7](https://github.com/nlibjs/nlibjs/commit/f57b0c7))
* **util:** add [@nlib](https://github.com/nlib)/util ([a0c70ff](https://github.com/nlibjs/nlibjs/commit/a0c70ff))





## 0.0.1 (2018-12-20)

**Note:** Version bump only for package nlibjs
