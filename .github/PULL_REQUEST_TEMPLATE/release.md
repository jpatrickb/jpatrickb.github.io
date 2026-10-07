## Release `release/x.y` into `main`

Merging deploys to prod (https://jpatrickbeal.com) and tags the release. Roll back by running the
Roll back prod workflow on the previous tag.

### What's in this release

<!-- Paste or link the merged PRs. -->

### Checked on dev (https://dev.jpatrickbeal.com)

- [ ] `develop` is deployed to dev at the commit this release was cut from, and smoke tests passed
- [ ] Click through: home, projects, work, lab, search (`/`), theme switch, mobile width
- [ ] No console errors

### Before merging

- [ ] Merge with a **merge commit**, never squash. The prod deploy refuses a squashed release.
- [ ] Terraform changes (if any) were planned and applied before this merge
- [ ] No open fixes still waiting to land in this release

### Sign-off

Checked by: @<!-- whoever cut the release -->
