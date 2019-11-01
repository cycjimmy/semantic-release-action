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
  * `semantic_version`: [Optional] Specify specifying version range for semantic-release. If no version range is specified, semantic-release@^15 will be used by default.
  * `extra_plugins`: [Optional] Extra plugins for pre-install. You can also specify specifying version range for the extra plugins if you prefer.
  * `dry_run`: [Optional] Whether to run semantic release in `dry-run` mode. It will override the dryRun attribute in your configuration file.
* outputs:
  * `new_release_published`: Whether a new release was published. `true` or `false`
  * `new_release_version`: Version of the new release
  * `new_release_major_version`: Major version of the new release
  * `new_release_minor_version`: Minor version of the new release
  * `new_release_patch_version`: Patch version of the new release

A simple example
```yaml
steps:
  - name: Semantic Release
    uses: cycjimmy/semantic-release-action@v2
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

An advanced example
```yaml
steps:
  - name: Semantic Release
    uses: cycjimmy/semantic-release-action@v2
    id: semantic   # Need an `id` for output variables
    with:
      branch: master
      semantic_version: 15.13.28
      # You can specify specifying version range for the extra plugins if you prefer.
      extra_plugins: |
        @semantic-release/git
        @semantic-release/changelog@3.0.0
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
      
  - name: Do something when a new release published
    if: steps.semantic.outputs.new_release_published == 'true'
    run: ...
```

## [CHANGELOG](./docs/CHANGELOG.md)

