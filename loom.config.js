// This site's Loom configuration: the kit decides its collection, media types and sections.
export default {
  kit: '@loom/kit-portfolio',
  // Go live only pushes master; CI lints, tests and builds it, and Atelier deploys it (docs/release.md).
  release: {
    live: 'CI then lints, tests and builds it, but does not deploy: deploy from Business/atelier with npm run atelier -- site deploy portfolio (docs/release.md).',
  },
};
