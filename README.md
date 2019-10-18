# Semantic Release Action
![](https://github.com/cycjimmy/semantic-release-action/workflows/Test%20Release/badge.svg)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

GitHub Action for [Semantic Release](https://github.com/semantic-release/semantic-release). 

## Usage
#### Step1: Set any [Semantic Release Configuration](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#configuration) in your repository.

#### Step2: [Add Secrets](https://help.github.com/en/articles/virtual-environments-for-github-actions#creating-and-using-secrets-encrypted-variables) in your repository for the [Semantic Release Authentication](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/ci-configuration.md#authentication) Environment Variables.

#### Step3: Add a [Workflow File](https://help.github.com/en/articles/workflow-syntax-for-github-actions) to your repository to create custom automated processes.
* inputs:
  * `branch`: [Optional] The branch for release. Default `"master"`.
  * `extra_plugins`: [Optional] Extra plugins for pre-install. Default `""`.
  * `dry_run`: [Optional] Whether to run semantic release in "dry-run" mode. It will override the dryRun attribute in your configuration file. Default `""`.
* outputs:
  * `new-release-published`: Whether a new release was published. `true` or `false`

A simple example
```yaml
steps:
  - name: Semantic Release
    uses: cycjimmy/semantic-release-action@v1.1.0
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

An advanced example
```yaml
steps:
  - name: Semantic Release
    uses: cycjimmy/semantic-release-action@v1.1.0
    id: semantic   # Need an `id` for output variables
    with:
      branch: master
      extra_plugins: |
        @semantic-release/git
        @semantic-release/changelog
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
      
  - name: Do something when a new release published
    if: steps.semantic.outputs.new-release-published == 'true'
    run: ...
```

