# Semantic Release Action
![][workflows-badge-image]
[![semantic-release][semantic-image]][semantic-url]
![npm license][license-image]

[workflows-badge-image]: https://github.com/cycjimmy/semantic-release-action/workflows/Test%20Release/badge.svg
[semantic-url]: https://github.com/semantic-release/semantic-release
[semantic-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[license-image]: https://img.shields.io/npm/l/@cycjimmy/semantic-release-action.svg?style=flat-square

GitHub Action for [Semantic Release](https://github.com/semantic-release/semantic-release). 

## Usage
#### Step1: Set any [Semantic Release Configuration](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#configuration) in your repository.

#### Step2: [Add Secrets](https://help.github.com/en/articles/virtual-environments-for-github-actions#creating-and-using-secrets-encrypted-variables) in your repository for the [Semantic Release Authentication](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/ci-configuration.md#authentication) Environment Variables.

#### Step3: Add a [Workflow File](https://help.github.com/en/articles/workflow-syntax-for-github-actions) to your repository to create custom automated processes.
* inputs:
  * `branch`: [Optional] The branch on which releases should happen. It will override the branch attribute in your configuration file. If the attribute is not configured on both sides, the default is master.
  * `semantic_version`: [Optional] Specify specifying version range for semantic-release. If no version range is specified, latest version will be used by default.
  * `extra_plugins`: [Optional] Extra plugins for pre-install. You can also specify specifying version range for the extra plugins if you prefer.
  * `dry_run`: [Optional] Whether to run semantic release in `dry-run` mode. It will override the dryRun attribute in your configuration file.
* outputs:
  * `new_release_published`: Whether a new release was published. `true` or `false`
  * `new_release_version`: Version of the new release
  * `new_release_major_version`: Major version of the new release
  * `new_release_minor_version`: Minor version of the new release
  * `new_release_patch_version`: Patch version of the new release
  
### Examples

#### A simple example

```yaml
steps:
  - name: Checkout
    uses: actions/checkout@v2
  - name: Semantic Release
    uses: cycjimmy/semantic-release-action@v3
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

#### Passing Extra Plugins with `extra_plugins`

The action can be used with `extra_plugins` option to specify plugins which are not in the [default list of plugins of semantic release](https://semantic-release.gitbook.io/semantic-release/usage/plugins#default-plugins). When using this option, please make sure that these plugins are also mentioned in your [semantic release config's plugins](https://semantic-release.gitbook.io/semantic-release/usage/configuration#plugins) array. For example, if you want to use `@semantic-release/git` and `@semantic-release/changelog` extra plugins, these must be added to `extra_plugins` in your actions file and `plugins` in your [release config file](https://semantic-release.gitbook.io/semantic-release/usage/configuration#configuration-file) as shown bellow:

_github-action_
```yaml
steps:
  - name: Checkout
    uses: actions/checkout@v2
  - name: Semantic Release
    uses: cycjimmy/semantic-release-action@v3
    with:
      # You can specify specifying version range for the extra plugins if you prefer.
      extra_plugins: |
        @semantic-release/git
        @semantic-release/changelog@3.0.0
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

_release-config_

```diff
  plugins: [
    .
    .
+   "@semantic-release/git",
+   "@semantic-release/changelog"
  ]
```

#### Manually Specify a Version of Semantic-release and Its Plugins

It is recommended to manually specify a version of semantic-release and its plugins to prevent errors caused during the official semantic-release upgrade.

```yaml
steps:
  - name: Checkout
    uses: actions/checkout@v2
  - name: Semantic Release
    uses: cycjimmy/semantic-release-action@v3
    with:
      semantic_version: 15.14.0
      extra_plugins: |
        @semantic-release/git@7.0.18
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

#### Using Output Variables

```yaml
steps:
  - name: Checkout
    uses: actions/checkout@v2
  - name: Semantic Release
    uses: cycjimmy/semantic-release-action@v3
    id: semantic   # Need an `id` for output variables
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
      
  - name: Do something when a new release published
    if: steps.semantic.outputs.new_release_published == 'true'
    run: ...
```

## [CHANGELOG](./docs/CHANGELOG.md)

