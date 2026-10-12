// Set SKIP_NPM_AUTH=true to skip npm credential verification (e.g. dry-run
// jobs that never publish). See @semantic-release/npm's `npmPublish` option.
const npmPlugin = process.env.SKIP_NPM_AUTH === "true"
  ? ["@semantic-release/npm", {"npmPublish": false}]
  : "@semantic-release/npm";

export default {
  "dryRun": false,
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/changelog",
      {
        "changelogFile": "docs/CHANGELOG.md"
      }
    ],
    npmPlugin,
    "@semantic-release/github",
    [
      "@semantic-release/git",
      {
        "assets": [
          "docs/CHANGELOG.md",
          "package.json",
          "package-lock.json"
        ],
        "message": "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
      }
    ]
  ]
};
