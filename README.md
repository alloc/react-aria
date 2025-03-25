I found it difficult to use [react-spectrum](https://github.com/adobe/react-spectrum)'s repository locally, so I copied over everything except `react-spectrum` (which I don't use) and updated the build scripts to use the following tools:

- [Rolldown](https://rolldown.rs/guide/) for bundling
- [Buildc](https://github.com/aklinker1/buildc) for build caching

Sourcemaps are enabled for all packages.

## Development

```sh
# Build all packages. Only rebuilds changed packages.
pnpm build

# Watch all packages and rebuild on changes.
pnpm dev
```
