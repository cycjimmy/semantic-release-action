# Semantic Release Action
GitHub Action for [Semantic Release](https://github.com/semantic-release/semantic-release).

## Usage
* `branch`: [Optional] The branch for release. Default `"master"`.
* `extra_plugins`: [Optional] Extra plugins for pre-install. Default `""`.

```yaml
steps:
  - name: Semantic Release
    uses: cycjimmy/semantic-release-action@master
    with:
      branch: master
      extra_plugins: |
        @semantic-release/git
        @semantic-release/changelog
```

