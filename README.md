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
    uses: actions/checkout@v3
  - name: Semantic Release
    uses: cycjimmy/semantic-release-action@v3
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

**IMPORTANT**: `GITHUB_TOKEN` does not have the required permissions to operate on protected branches.
If you are using this action for protected branches, replace `GITHUB_TOKEN` with [Personal Access Token](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line). If using the `@semantic-release/git` plugin for protected branches, avoid persisting credentials as part of `actions/checkout@v3` by setting the parameter `persist-credentials: false`. This credential does not have the required permission to operate on protected branches.

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
| semantic_version  |  false   | Specify version range for semantic-release. [[Details](#semantic_version)]                                               |
|     branches      |  false   | The branches on which releases should happen.[[Details](#branches)]<br>Support for **semantic-release above v16**.       |
|      branch       |  false   | The branch on which releases should happen.[[Details](#branch)]<br>Only support for **semantic-release older than v16**. |
|   extra_plugins   |  false   | Extra plugins for pre-install. [[Details](#extra_plugins)]                                                               |
|      dry_run      |  false   | Whether to run semantic release in `dry-run` mode. [[Details](#dry_run)]                                                 |
|      extends      |  false   | Use a sharable configuration [[Details](#extends)]                                                                       |
| working_directory |  false   | Use another working directory for semantic release [[Details](#working_directory)]                                       |
|     tag_format    |  false   | Specify format of tag (useful for monorepos)                                                                             |

#### semantic_version
> {Optional Input Parameter} Specify version range for semantic-release.

```yaml
steps:
  - name: Checkout
    uses: actions/checkout@v3
  - name: Semantic Release
    uses: cycjimmy/semantic-release-action@v3
    with:
      semantic_version: 19.0.5  # It is recommended to specify a version range
                                # for semantic-release when using
                                # semantic-release-action lower than @v3
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

If no version range is specified with `cycjimmy/semantic-release-action@v3` then [semantic-release](https://github.com/semantic-release/semantic-release/) version [19.0.5](https://github.com/semantic-release/semantic-release/releases/tag/v19.0.5) is used. Earlier versions of `cycjimmy/semantic-release-action` default to using the latest version of [semantic-release](https://github.com/semantic-release/semantic-release/), so in this case it is recommended to specify version 19 or lower to avoid compatibility issues.

*Note: [Version 20.0.0](https://github.com/semantic-release/semantic-release/releases/tag/v20.0.0) of [semantic-release](https://github.com/semantic-release/semantic-release/) and later is currently incompatible with `cycjimmy/semantic-release-action`, since it requires Node.js 18. GitHub does not provide this environment yet for [JavaScript actions](https://docs.github.com/en/actions/creating-actions/metadata-syntax-for-github-actions#runs-for-javascript-actions).*

#### branches
> {Optional Input Parameter} The branches on which releases should happen.<br>`branches` supports for **semantic-release above v16**.

```yaml
steps:
  - name: Checkout
    uses: actions/checkout@v3
  - name: Semantic Release
    uses: cycjimmy/semantic-release-action@v3
    with:
      semantic_version: 16
      # you can set branches for semantic-release above v16.
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

#### branch
> {Optional Input Parameter} Similar to parameter `branches`. The branch on which releases should happen.<br>`branch` only supports for **semantic-release older than v16**.

```yaml
steps:
  - name: Checkout
    uses: actions/checkout@v3
  - name: Semantic Release
    uses: cycjimmy/semantic-release-action@v3
    with:
      semantic_version: 15.13.28
      # you can set branch for semantic-release older than v16.
      branch: your-branch
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

It will override the `branch` attribute in your configuration file. If the attribute is not configured on both sides, the default is `master`.

#### extra_plugins
> {Optional Input Parameter} Extra plugins for pre-install.

The action can be used with `extra_plugins` option to specify plugins which are not in the [default list of plugins of semantic release](https://semantic-release.gitbook.io/semantic-release/usage/plugins#default-plugins). When using this option, please make sure that these plugins are also mentioned in your [semantic release config's plugins](https://semantic-release.gitbook.io/semantic-release/usage/configuration#plugins) array.

For example, if you want to use `@semantic-release/git` and `@semantic-release/changelog` extra plugins, these must be added to `extra_plugins` in your actions file and `plugins` in your [release config file](https://semantic-release.gitbook.io/semantic-release/usage/configuration#configuration-file) as shown bellow:

Github Action Workflow:
```yaml
steps:
  - name: Checkout
    uses: actions/checkout@v3
  - name: Semantic Release
    uses: cycjimmy/semantic-release-action@v3
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
    uses: actions/checkout@v3
  - name: Semantic Release
    uses: cycjimmy/semantic-release-action@v3
    with:
      dry_run: true
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

#### extends
The action can be used with `extends` option to extend an existing [sharable configuration](https://semantic-release.gitbook.io/semantic-release/usage/shareable-configurations) of semantic-release. Can be used in combination with `extra_plugins`.

```yaml
steps:
  - name: Checkout
    uses: actions/checkout@v3
  - name: Semantic Release
    uses: cycjimmy/semantic-release-action@v3
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
    uses: actions/checkout@v3
  - name: Semantic Release
    uses: cycjimmy/semantic-release-action@v3
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
    uses: actions/checkout@v3
  - name: Semantic Release
    uses: cycjimmy/semantic-release-action@v3
    with:
      tag_format: custom-v{version}
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

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
    uses: actions/checkout@v3
  - name: Semantic Release
    uses: cycjimmy/semantic-release-action@v3
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
