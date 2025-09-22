## CI Pipeline Error: Resource not accessible by integration

### Summary

During the CI pipeline run, the following error occurred: **'Resource not accessible by integration'** when attempting to upload SARIF results. This issue is primarily caused by insufficient token permissions for code scanning uploads, particularly when the pipeline is executed from forks or with the default `GITHUB_TOKEN`.

### Recommendation

To resolve this issue, please update the `.github/workflows/ci.yml` file to include the following permissions:

```yaml
permissions:
  contents: read
  security-events: write
```

Additionally, conditionally run the SARIF upload step only in trusted contexts by modifying the step condition as follows:

```yaml
if: github.event_name != 'pull_request' || github.event.pull_request.head.repo.full_name == github.repository
```

### Reference

For more details, please refer to the job log at commit [9f4dc90ca0ea2beb3877390d1ef02fa73b6091fa](https://github.com/timothy-y-yuan/center-div-game/commit/9f4dc90ca0ea2beb3877390d1ef02fa73b6091fa).
