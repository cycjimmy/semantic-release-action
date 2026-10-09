# Semantic Release Action
![][version-image]
![][workflows-badge-image]
[![Release date][release-date-image]][release-url]
[![semantic-release][semantic-image]][semantic-url]
[![npm license][license-image]][license-url]

GitHub Action for [Semantic Release][semantic-url].

## Usage
### Step1: Set any [Semantic Release Configuration](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#configuration) in your repository.

### Step2: [Add Secrets](https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets) in your repository for the [Semantic Release Authentication](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/ci-configuration.md#authentication) Environment Variables.

### Step3: Add a [Workflow File](https://help.github.com/en/articles/workflow-syntax-for-github-actions) to your repository to create custom automated processes.

#### Basic Usage:
```yaml
steps:
  - name: Checkout
    uses: actions/checkout@v7
  - name: Semantic Release
    uses: cycjimmy/semantic-release-action@v7
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

**IMPORTANT**: `GITHUB_TOKEN` does not have the required permissions to operate on protected branches.
If you are using this action for protected branches, replace `GITHUB_TOKEN` with [Personal Access Token](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line). If using the `@semantic-release/git` plugin for protected branches, avoid persisting credentials as part of `actions/checkout@v7` by setting the parameter `persist-credentials: false`. This credential does not have the required permission to operate on protected branches.

#### Private Packages

If you are using this action to publish to the npm [GitHub Packages Registry][github-packages-registry],
then make sure that you configure this in your `package.json` file:

```json
{
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  }
}
```

### Inputs
|  Input Parameter  | Required | Description                                                                                                              |
|:-----------------:|:--------:|--------------------------------------------------------------------------------------------------------------------------|
| semantic_version  |  false   | Specify version range for semantic-release (v16 or above required). [[Details](#semantic_version)]                       |
|     branches      |  false   | The branches on which releases should happen.[[Details](#branches)]<br>Requires **semantic-release v16 or above**.       |
|   extra_plugins   |  false   | Extra plugins for pre-install. [[Details](#extra_plugins)]                                                               |
|      dry_run      |  false   | Whether to run semantic release in `dry-run` mode. [[Details](#dry_run)]                                                 |
|        ci         |  false   | Whether to run semantic release with CI support. [[Details](#ci)]                                                        |
|   unset_gha_env   |  false   | Whether to unset the GITHUB_ACTIONS environment variable.                                                                |
|      extends      |  false   | Use a sharable configuration [[Details](#extends)]                                                                       |
| working_directory |  false   | Use another working directory for semantic release [[Details](#working_directory)]                                       |
|    tag_format     |  false   | Specify format of tag (useful for monorepos)                                                                             |
|  repository_url   |  false   | The Git repository url. If no repository url specified, current repository will be used by default.                      |
| skip_npm_plugin   |  false   | Whether to skip the @semantic-release/npm default plugin. [[Details](#skip_npm_plugin)]<br>Useful for non-Node.js projects. |

#### semantic_version
> {Optional Input Parameter} Specify version range for semantic-release.<br>The minimum supported semantic-release version is **v16**; older versions fail with an error.

```yaml
steps:
  - name: Checkout
    uses: actions/checkout@v7
  - name: Semantic Release
    uses: cycjimmy/semantic-release-action@v7
    with:
      semantic_version: 19.0.5  # It is recommended to specify a version range
                                # for semantic-release when using
                                # semantic-release-action lower than @v4
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

If no version range is specified with `cycjimmy/semantic-release-action@v7` then [semantic-release@latest](https://github.com/semantic-release/semantic-release/releases) is used.

#### branches
> {Optional Input Parameter} The branches on which releases should happen.<br>`branches` requires **semantic-release v16 or above**.

```yaml
steps:
  - name: Checkout
    uses: actions/checkout@v7
  - name: Semantic Release
    uses: cycjimmy/semantic-release-action@v7
    with:
      semantic_version: 16
      # you can set branches for semantic-release v16 or above.
      branches: |
        [
          '+([0-9])?(.{+([0-9]),x}).x',
          'master',
          'next',
          'next-major',
          {
            name: 'beta',
            prerelease: true
          },
          {
            name: 'alpha',
            prerelease: true
          }
        ]
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

`branches` will override the `branches` attribute in your configuration file. If the attribute is not configured on both sides, the default is:
```
[
  '+([0-9])?(.{+([0-9]),x}).x',
  'master',
  'next',
  'next-major',
  {name: 'beta', prerelease: true},
  {name: 'alpha', prerelease: true}
]
```

See [configuration#branches](https://semantic-release.gitbook.io/semantic-release/usage/configuration#branches) for more information.

**NOTE**: The `branches` input is evaluated as a JavaScript expression to support the array/object configuration above. Only pass content you trust — anyone able to edit the workflow file can already run arbitrary commands in your CI.

#### extra_plugins
> {Optional Input Parameter} Extra plugins for pre-install.

The action can be used with `extra_plugins` option to specify plugins which are not in the [default list of plugins of semantic release](https://semantic-release.gitbook.io/semantic-release/usage/plugins#default-plugins). When using this option, please make sure that these plugins are also mentioned in your [semantic release config's plugins](https://semantic-release.gitbook.io/semantic-release/usage/configuration#plugins) array.

For example, if you want to use `@semantic-release/git` and `@semantic-release/changelog` extra plugins, these must be added to `extra_plugins` in your actions file and `plugins` in your [release config file](https://semantic-release.gitbook.io/semantic-release/usage/configuration#configuration-file) as shown bellow:

Github Action Workflow:
```yaml
steps:
  - name: Checkout
    uses: actions/checkout@v7
  - name: Semantic Release
    uses: cycjimmy/semantic-release-action@v7
    with:
      # You can specify specifying version range for the extra plugins if you prefer.
      extra_plugins: |
        @semantic-release/changelog@6.0.0
        @semantic-release/git
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

Similar to parameter `semantic_version`. *It is recommended to manually specify a version of semantic-release plugins to prevent errors caused.*

**NOTE**: `extra_plugins` accepts npm package specs (e.g. `@semantic-release/git@10.0.0` or `@semantic-release/git@>=10.0.0`) separated by whitespace or newlines. Each spec is passed to `npm install` as a single argument without a shell; tokens starting with `-` or containing quotes or similar unsafe characters are ignored and reported as a warning. Because whitespace separates specs, version ranges containing spaces (e.g. `>=1.0.0 <2.0.0`) are not supported. The same rules apply to the `extends` input.

Release Config:
```diff
  plugins: [
    .
+   "@semantic-release/changelog"
+   "@semantic-release/git",
  ]
```

#### dry_run
> {Optional Input Parameter} Whether to run semantic release in `dry-run` mode.<br>It will override the dryRun attribute in your configuration file.

```yaml
steps:
  - name: Checkout
    uses: actions/checkout@v7
  - name: Semantic Release
    uses: cycjimmy/semantic-release-action@v7
    with:
      dry_run: true
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

#### ci
> {Optional Input Parameter} Whether to run semantic release with CI support (default true).

```yaml
steps:
  - name: Checkout
    uses: actions/checkout@v7
  - name: Semantic Release
    uses: cycjimmy/semantic-release-action@v7
    with:
      ci: false
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

`ci` can be used, e.g in combination with `dry_run` when generating the next release version in pull requests, where `semantic_release` would normally block the execution.

#### extends
The action can be used with `extends` option to extend an existing [sharable configuration](https://semantic-release.gitbook.io/semantic-release/usage/shareable-configurations) of semantic-release. Can be used in combination with `extra_plugins`.

```yaml
steps:
  - name: Checkout
    uses: actions/checkout@v7
  - name: Semantic Release
    uses: cycjimmy/semantic-release-action@v7
    with:
      # You can extend an existing shareable configuration.
      # And you can specify version range for the shareable configuration if you prefer.
      extends: |
        @semantic-release/apm-config@^9.0.0
        @mycompany/override-config
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

#### working_directory
This action run semantic release in the github provided workspace by default. You can override it by setting another working directory.

```yaml
steps:
  - name: Checkout
    uses: actions/checkout@v7
  - name: Semantic Release
    uses: cycjimmy/semantic-release-action@v7
    with:
      # You can select another working directory like a subdirectory for example.
      working_directory: ./code
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

#### tag_format
The default tag format on semantic-release is `v{version}`. You can override that behavior using this option (helpful when you are using monorepos)

```yaml
steps:
  - name: Checkout
    uses: actions/checkout@v7
  - name: Semantic Release
    uses: cycjimmy/semantic-release-action@v7
    with:
      tag_format: custom-v${version}
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

#### unset_gha_env
Setting this to true will unset the `GITHUB_ACTIONS` environment variable. This can be useful when wanting to validate things such as merging of a PR would create a valid release.

```yaml
steps:
  - name: Checkout
    uses: actions/checkout@v7
  - name: Temporarily merge PR branch
    if: ${{ github.event_name == 'pull_request' }}
    run: |
      git config --global user.name github-actions
      git config --global user.email github-actions@github.com
      git merge --no-ff origin/${{ github.event.pull_request.head.ref }} --message "${{ github.event.pull_request.title }}"
  - name: Semantic Release
    uses: cycjimmy/semantic-release-action@v7
    with:
      unset_gha_env: ${{ github.event_name == 'pull_request' }}
      ci: ${{ github.event_name == 'pull_request' && false || '' }}
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

#### skip_npm_plugin
> {Optional Input Parameter} Whether to skip the `@semantic-release/npm` default plugin.<br>Useful for running the action in a project that is not a Node.js project (i.e. without a `package.json` file).

```yaml
steps:
  - name: Checkout
    uses: actions/checkout@v7
  - name: Semantic Release
    uses: cycjimmy/semantic-release-action@v7
    with:
      skip_npm_plugin: true
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

The `@semantic-release/npm` default plugin requires a `package.json` file in the working directory. Without one, semantic-release fails with `SemanticReleaseError: Missing package.json file.` (ENOPKG) — even in `dry-run` mode. Set `skip_npm_plugin: true` to remove the npm plugin from the default plugins. The default plugins are then replaced with the following list (the [default plugins](https://semantic-release.gitbook.io/semantic-release/usage/plugins#default-plugins) of semantic-release without `@semantic-release/npm`):

- `@semantic-release/commit-analyzer`
- `@semantic-release/release-notes-generator`
- `@semantic-release/github`

Similar to the other options, it will override the `plugins` attribute in your configuration file. If you already maintain your own `plugins` array in your release configuration, you don't need this input — just omit `@semantic-release/npm` from your array.

**NOTE**: `NPM_TOKEN` is not required when the npm plugin is skipped. Also note that configuring `npmPublish: false` or `private: true` on the npm plugin does **not** avoid the ENOPKG error, as the plugin checks for a `package.json` file before taking those settings into account. The only way to release a project without a `package.json` file is to not use the npm plugin at all.

### Outputs
|     Output Parameter      | Description                                                                                                                       |
|:-------------------------:|-----------------------------------------------------------------------------------------------------------------------------------|
|   new_release_published   | Whether a new release was published. The return value is in the form of a string. (`"true"` or `"false"`)                         |
|    new_release_version    | Version of the new release. (e.g. `"1.3.0"`)                                                                                      |
| new_release_major_version | Major version of the new release. (e.g. `"1"`)                                                                                    |
| new_release_minor_version | Minor version of the new release. (e.g. `"3"`)                                                                                    |
| new_release_patch_version | Patch version of the new release. (e.g. `"0"`)                                                                                    |
|    new_release_channel    | The distribution channel on which the last release was initially made available (undefined for the default distribution channel). |
|     new_release_notes     | The release notes for the new release.                                                                                            |
| new_release_git_head      | The sha of the last commit being part of the new release |
| new_release_git_tag       | The Git tag associated with the new release. |
| last_release_version      | Version of the previous release, if there was one. (e.g. `1.2.0`) |
| last_release_git_head     | The sha of the last commit being part of the last release, if there was one. |
| last_release_git_tag      | The Git tag associated with the last release, if there was one. |                                                         |

#### Using Output Variables:
```yaml
steps:
  - name: Checkout
    uses: actions/checkout@v7
  - name: Semantic Release
    uses: cycjimmy/semantic-release-action@v7
    id: semantic   # Need an `id` for output variables
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}

  - name: Do something when a new release published
    if: steps.semantic.outputs.new_release_published == 'true'
    run: |
      echo ${{ steps.semantic.outputs.new_release_version }}
      echo ${{ steps.semantic.outputs.new_release_major_version }}
      echo ${{ steps.semantic.outputs.new_release_minor_version }}
      echo ${{ steps.semantic.outputs.new_release_patch_version }}
```

## Migration Notes

### The `branch` input has been removed
The `branch` input is no longer supported. Use the `branches` input instead:

```diff
  - name: Semantic Release
    uses: cycjimmy/semantic-release-action@v7
    with:
-     branch: your-branch
+     branches: your-branch
```

If the `branch` input is still passed, the action prints a deprecation warning and ignores it.

### semantic-release below v16 is no longer supported
This action now requires **semantic-release v16 or above**. If the installed semantic-release version is older (for example via `semantic_version: 15`), the action fails with an error. Update the `semantic_version` input to v16 or above, or remove it to use the latest version.

## Changelog
See [CHANGELOG][changelog-url].

## License
This project is released under the [MIT License][license-url].

<!-- Links: -->
[version-image]: https://img.shields.io/github/package-json/v/cycjimmy/semantic-release-action

[workflows-badge-image]: https://github.com/cycjimmy/semantic-release-action/workflows/Test%20Release/badge.svg

[release-date-image]: https://img.shields.io/github/release-date/cycjimmy/semantic-release-action
[release-url]: https://github.com/cycjimmy/semantic-release-action/releases

[semantic-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-url]: https://github.com/semantic-release/semantic-release

[license-image]: https://img.shields.io/npm/l/@cycjimmy/semantic-release-action.svg
[license-url]: https://github.com/cycjimmy/semantic-release-action/blob/main/LICENSE

[changelog-url]: https://github.com/cycjimmy/semantic-release-action/blob/main/docs/CHANGELOG.md

[github-packages-registry]: https://github.com/features/packages
