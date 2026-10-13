// This site's Loom configuration: the kit decides its collection, media types and sections.
export default {
  kit: '@loom/kit-portfolio',
  // Go live pushes master, then runs Atelier's release of that pushed commit; Stage pushes the
  // staging branch, then runs Atelier's preview deploy (docs/release.md).
  // CI only lints, tests and builds; Atelier is the only deployer.
  release: {
    live: 'Atelier builds that pushed commit and publishes it to https://ttvpro007.github.io/.',
    liveUrl: 'https://ttvpro007.github.io/',
    liveLabel: 'Live site',
    liveCommand: {
      // node, not `npm run atelier --`: npm's PowerShell shim can drop `--` and swallow flags
      run: 'node packages/cli/bin/atelier.js site release portfolio',
      cwd: '../../Business/atelier',
      secret: { env: 'ATELIER_PASSPHRASE', label: 'Atelier secret-store passphrase' },
    },
    stage: 'Atelier builds it and publishes it to the staging site, https://ttvpro007.github.io/portfolio-staging/.',
    stageCommand: {
      run: 'node packages/cli/bin/atelier.js site deploy portfolio preview',
      cwd: '../../Business/atelier',
      secret: { env: 'ATELIER_PASSPHRASE', label: 'Atelier secret-store passphrase' },
    },
  },
};
