# [3.4.0](https://github.com/cycjimmy/semantic-release-action/compare/v3.3.0...v3.4.0) (2023-03-15)


### Features

* add `ci` input parameter ([b356b18](https://github.com/cycjimmy/semantic-release-action/commit/b356b18b5f474bb4b9fe4bb5801b364ce24aa8f6))

# [3.3.0](https://github.com/cycjimmy/semantic-release-action/compare/v3.2.0...v3.3.0) (2023-03-07)


### Features

* support for option tagFormat ([ed38eb0](https://github.com/cycjimmy/semantic-release-action/commit/ed38eb0e9938eefc792510a75ec48d80fead9b21))

# [3.2.0](https://github.com/cycjimmy/semantic-release-action/compare/v3.1.2...v3.2.0) (2022-11-04)


### Features

* added gitHead and gitTag outputs ([385af4f](https://github.com/cycjimmy/semantic-release-action/commit/385af4fa1ceaf60ec10e35b950e9c1cbb9375a8c))

## [3.1.2](https://github.com/cycjimmy/semantic-release-action/compare/v3.1.1...v3.1.2) (2022-10-19)


### Bug Fixes

* **actions:** update @actions/core to cope with new output ([3e7aded](https://github.com/cycjimmy/semantic-release-action/commit/3e7adedd114a31396550cb5ef5445170fae72f9e))

## [3.1.1](https://github.com/cycjimmy/semantic-release-action/compare/v3.1.0...v3.1.1) (2022-08-30)


### Bug Fixes

* set last_release_version output even if no release has been published ([b1467cd](https://github.com/cycjimmy/semantic-release-action/commit/b1467cd17e70d963d7925a60266adb249ee2223d))

# [3.1.0](https://github.com/cycjimmy/semantic-release-action/compare/v3.0.0...v3.1.0) (2022-08-05)


### Features

* handle versioned extends inputs correctly ([4a51b9f](https://github.com/cycjimmy/semantic-release-action/commit/4a51b9fada7267737750fded8b8edfb275acbbbb))

# [3.0.0](https://github.com/cycjimmy/semantic-release-action/compare/v2.7.0...v3.0.0) (2022-03-03)


### Features

* switch operating environment to node16 ([b5f16ae](https://github.com/cycjimmy/semantic-release-action/commit/b5f16ae54b21667e3af8a1bd015ec069c8237674)), closes [#92](https://github.com/cycjimmy/semantic-release-action/issues/92) [#96](https://github.com/cycjimmy/semantic-release-action/issues/96)


### BREAKING CHANGES

* switch operating environment to node16

# [2.7.0](https://github.com/cycjimmy/semantic-release-action/compare/v2.6.0...v2.7.0) (2021-12-12)


### Features

* add working dir ([7126083](https://github.com/cycjimmy/semantic-release-action/commit/71260837fb05623446dee88dd211f7530838b234))

# [2.6.0](https://github.com/cycjimmy/semantic-release-action/compare/v2.5.4...v2.6.0) (2021-10-15)


### Features

* add output for last release version ([f8175c6](https://github.com/cycjimmy/semantic-release-action/commit/f8175c649133e2d9be14098cc4d41f7ef32316b6))

## [2.5.4](https://github.com/cycjimmy/semantic-release-action/compare/v2.5.3...v2.5.4) (2021-04-30)


### Bug Fixes

* use error loglevel for installing dependencies ([ed6729b](https://github.com/cycjimmy/semantic-release-action/commit/ed6729b716d281c2c4058d3553f3229a80203a79)), closes [#57](https://github.com/cycjimmy/semantic-release-action/issues/57)

## [2.5.3](https://github.com/cycjimmy/semantic-release-action/compare/v2.5.2...v2.5.3) (2020-11-16)


### Bug Fixes

* fix a type error when nextRelease is undefined ([f1ae39a](https://github.com/cycjimmy/semantic-release-action/commit/f1ae39a58a030dccda8bd11b51266b4824871e1f))

## [2.5.2](https://github.com/cycjimmy/semantic-release-action/compare/v2.5.1...v2.5.2) (2020-11-12)


### Bug Fixes

* use silent installation to prevent npm WARN ([7ca507d](https://github.com/cycjimmy/semantic-release-action/commit/7ca507d26a166ce426d8326c6d47d2ae94e469ff)), closes [#48](https://github.com/cycjimmy/semantic-release-action/issues/48)

## [2.5.1](https://github.com/cycjimmy/semantic-release-action/compare/v2.5.0...v2.5.1) (2020-11-12)


### Bug Fixes

* **deps:** upgrade dependencies ([2a98893](https://github.com/cycjimmy/semantic-release-action/commit/2a988931ba18eb8d84d8a7229672ce2fc932afc6)), closes [#44](https://github.com/cycjimmy/semantic-release-action/issues/44)

# [2.5.0](https://github.com/cycjimmy/semantic-release-action/compare/v2.4.2...v2.5.0) (2020-07-02)


### Features

* **outputs:** add new_release_channel ([ae40dc6](https://github.com/cycjimmy/semantic-release-action/commit/ae40dc665849d2b1a1a68751c65c88c0474395f4))

## [2.4.2](https://github.com/cycjimmy/semantic-release-action/compare/v2.4.1...v2.4.2) (2020-07-02)


### Bug Fixes

* **new_release_patch_version:** fix the problem of inaccurate new_release_patch_version ([5da0ac5](https://github.com/cycjimmy/semantic-release-action/commit/5da0ac558eb3a3a8eb75460ff9bd55cb1217da2d))

## [2.4.1](https://github.com/cycjimmy/semantic-release-action/compare/v2.4.0...v2.4.1) (2020-05-01)


### Bug Fixes

* **deps:** Update @actions/core to ^1.2.4 ([00f8039](https://github.com/cycjimmy/semantic-release-action/commit/00f8039cb6e50b6a052d33f8bbc76462e49a16ee))

# [2.4.0](https://github.com/cycjimmy/semantic-release-action/compare/v2.3.0...v2.4.0) (2020-04-30)


### Bug Fixes

* fixes rebase mistake for import of renamed func ([ddb8d28](https://github.com/cycjimmy/semantic-release-action/commit/ddb8d2814d0253519aec32bec92600fc9fc9a305))


### Features

* added ability to use the "extends" settings ([32db8a4](https://github.com/cycjimmy/semantic-release-action/commit/32db8a49b25f46b98a901084ada97b6aa7343813))

# [2.3.0](https://github.com/cycjimmy/semantic-release-action/compare/v2.2.0...v2.3.0) (2020-03-21)


### Features

* **branches:** support branches of semantic-release v16+ ([706c0ef](https://github.com/cycjimmy/semantic-release-action/commit/706c0ef960497657ddf0655d0a69732323d93238)), closes [#24](https://github.com/cycjimmy/semantic-release-action/issues/24) [#25](https://github.com/cycjimmy/semantic-release-action/issues/25)

# [2.2.0](https://github.com/cycjimmy/semantic-release-action/compare/v2.1.3...v2.2.0) (2020-03-15)


### Features

* add release notes to output ([a56320d](https://github.com/cycjimmy/semantic-release-action/commit/a56320d643d6a8e0c688a84f18449153865b8bc4))

## [2.1.3](https://github.com/cycjimmy/semantic-release-action/compare/v2.1.2...v2.1.3) (2020-01-19)


### Bug Fixes

* **branch:** parameter `branch` does not work in semantic v16 ([3e27c51](https://github.com/cycjimmy/semantic-release-action/commit/3e27c518af9a3d781b70e0cf1cbccc626ae7f4f3)), closes [#15](https://github.com/cycjimmy/semantic-release-action/issues/15) [#15](https://github.com/cycjimmy/semantic-release-action/issues/15)

## [2.1.2](https://github.com/cycjimmy/semantic-release-action/compare/v2.1.1...v2.1.2) (2020-01-13)


### Bug Fixes

* fix wrong version ([db14ba3](https://github.com/cycjimmy/semantic-release-action/commit/db14ba3eee0c681deee056535d2da3cc39a9411b))

## [2.1.1](https://github.com/cycjimmy/semantic-release-action/compare/v2.1.0...v2.1.1) (2020-01-13)


### Bug Fixes

* **install:** uninterrupted installation errors ([3a7ccd6](https://github.com/cycjimmy/semantic-release-action/commit/3a7ccd6a7fe4ed5e17de6560568e0b7b200709ed))


### Performance Improvements

* use the latest version of semantic-release by default ([600e4f0](https://github.com/cycjimmy/semantic-release-action/commit/600e4f0e2b761e1745995b660d7d8a8977172d26))

# [2.1.0](https://github.com/cycjimmy/semantic-release-action/compare/v2.0.3...v2.1.0) (2019-10-31)


### Features

* **inputs:** add semantic_version to specify version range([#3](https://github.com/cycjimmy/semantic-release-action/issues/3)) ([55e8862](https://github.com/cycjimmy/semantic-release-action/commit/55e8862f175cf05a7550c87bdbca1b440aeb1000))

## [2.0.3](https://github.com/cycjimmy/semantic-release-action/compare/v2.0.2...v2.0.3) (2019-10-28)


### Bug Fixes

* **inputs:** adjust the default for the "branch" configuration ([e5c555a](https://github.com/cycjimmy/semantic-release-action/commit/e5c555a6131ac6c67ba74b1e2d5e5cde56d38d10))

## [2.0.2](https://github.com/cycjimmy/semantic-release-action/compare/v2.0.1...v2.0.2) (2019-10-26)


### Bug Fixes

* **.npmrc:** modify wrong cwd for exec ([6cfcf38](https://github.com/cycjimmy/semantic-release-action/commit/6cfcf38c9b9cce2215ff5ae7f509b6501c8f8206))

## [2.0.1](https://github.com/cycjimmy/semantic-release-action/compare/v2.0.0...v2.0.1) (2019-10-26)


### Bug Fixes

* **.npmrc:** clean up `.npmrc` file in the repo after releasing ([a0ef86e](https://github.com/cycjimmy/semantic-release-action/commit/a0ef86eea3257234992126447d883529ce057ece)), closes [#2](https://github.com/cycjimmy/semantic-release-action/issues/2) [/github.com/semantic-release/semantic-release/issues/974#issuecomment-546577677](https://github.com//github.com/semantic-release/semantic-release/issues/974/issues/issuecomment-546577677)

# [2.0.0](https://github.com/cycjimmy/semantic-release-action/compare/v1.3.1...v2.0.0) (2019-10-21)


### Styles

* **outputs:** uniform outputs to underline format ([4cea44f](https://github.com/cycjimmy/semantic-release-action/commit/4cea44f71ac0f0c6e31dbb1fffeae5826eec6e2a))


### BREAKING CHANGES

* **outputs:** uniform outputs to underline format

Before:

outputs:
- new-release-published:
- new-release-version
- new-release-major-version
- new-release-minor-version
- new-release-patch-version

After:

outputs:
- new_release_published:
- new_release_version
- new_release_major_version
- new_release_minor_version
- new_release_patch_version

## [1.3.1](https://github.com/cycjimmy/semantic-release-action/compare/v1.3.0...v1.3.1) (2019-10-21)


### Bug Fixes

* **release:** bad substitution ([575492b](https://github.com/cycjimmy/semantic-release-action/commit/575492bbdcd5c93d1349250e3a1847a85d41419c))

# [1.3.0](https://github.com/cycjimmy/semantic-release-action/compare/v1.2.1...v1.3.0) (2019-10-21)


### Features

* **outputs:** Add outputs related to new release version ([12a1a39](https://github.com/cycjimmy/semantic-release-action/commit/12a1a39975a23b4915e90567d975240096cec66c))

## [1.2.1](https://github.com/cycjimmy/semantic-release-action/compare/v1.2.0...v1.2.1) (2019-10-18)


### Bug Fixes

* **branch v1:** push updates to v1 branch after releases([#1](https://github.com/cycjimmy/semantic-release-action/issues/1)) ([bb964eb](https://github.com/cycjimmy/semantic-release-action/commit/bb964eb28ee1823e67f82532b9e4d4fd3f135513))

# [1.2.0](https://github.com/cycjimmy/semantic-release-action/compare/v1.1.0...v1.2.0) (2019-10-18)


### Features

* **dry_run:** add a new input - "dry_run" ([65686aa](https://github.com/cycjimmy/semantic-release-action/commit/65686aabe72b7b976902b278411b8a4d16298fd0))

# [1.1.0](https://github.com/cycjimmy/semantic-release-action/compare/v1.0.0...v1.1.0) (2019-10-17)


### Features

* add a new output - "new-release-published" ([be8f403](https://github.com/cycjimmy/semantic-release-action/commit/be8f403201951e0c7b237bb7daab2c561af7303d))

# 1.0.0 (2019-10-17)


### Bug Fixes

* **src/index.js:** remove 'stream-buffers' ([d2cecad](https://github.com/cycjimmy/semantic-release-action/commit/d2cecad9a9379c7b03313be62c36da778eafa742))


### Features

* come a new action ([b9ad41d](https://github.com/cycjimmy/semantic-release-action/commit/b9ad41da609c63abe1b5f5ab5df7b4383d346906))
