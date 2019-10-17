# Semantic Release Action
GitHub Action for [Semantic Release](https://github.com/semantic-release/semantic-release).

## Usage
* inputs:
  * `branch`: [Optional] The branch for release. Default `"master"`.
  * `extra_plugins`: [Optional] Extra plugins for pre-install. Default `""`.
* outputs:
  * `new-release-published`: Whether a new release was published. `true` or `false`

A simple example
```yaml
steps:
  - name: Semantic Release
    uses: cycjimmy/semantic-release-action@master
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

An advanced example
```yaml
steps:
  - name: Semantic Release
    uses: cycjimmy/semantic-release-action@master
    id: semantic
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

