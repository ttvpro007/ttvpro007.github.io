// This site's Loom configuration: the kit decides its collection, media types and sections.
export default {
  kit: '@loom/kit-portfolio',
  // Go live pushes master, then runs Atelier's release of that pushed commit (docs/release.md).
  // CI only lints, tests and builds; Atelier is the only deployer.
  release: {
    live: 'Atelier builds that pushed commit and publishes it to https://ttvpro007.github.io/.',
    liveUrl: 'https://ttvpro007.github.io/',
    liveLabel: 'Live site',
    liveCommand: {
      run: 'npm run atelier -- site release portfolio',
      cwd: '../../Business/atelier',
      secret: { env: 'ATELIER_PASSPHRASE', label: 'Atelier secret-store passphrase' },
    },
  },
};
