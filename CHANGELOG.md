# [1.0.0](https://github.com/tripp-horbinski/sportviz/compare/v0.2.1...v1.0.0) (2026-04-27)


* feat(packages)!: rebrand to [@basketball-ceo](https://github.com/basketball-ceo), ship core standalone ([#1](https://github.com/tripp-horbinski/sportviz/issues/1)) ([e20c14c](https://github.com/tripp-horbinski/sportviz/commit/e20c14c5030c371d17bb2441d28eb812f08061a6))


### BREAKING CHANGES

* package renamed from @tripp-horbinski/sportviz to
@basketball-ceo/charts. Core engine (previously unpublished as @sportviz/core)
is now published as @basketball-ceo/core.

- Rename @sportviz/core → @basketball-ceo/core (now published to npm)
- Rename @tripp-horbinski/sportviz → @basketball-ceo/charts
- Fix exports map ordering so TypeScript resolves "types" first
- Drop README copy hack at publish time; each package owns its README
- Basketball-only focus: drop multi-sport language and keywords, tie
  branding to basketball.ceo for authority
- Update demo app workspace deps and header to point at basketball.ceo
- Dedupe duplicate 0.2.0 CHANGELOG entries from prior double-release race

Co-authored-by: Claude Opus 4.7 (1M context) <noreply@anthropic.com>

# [0.3.0](https://github.com/tripp-horbinski/sportviz/compare/v0.2.1...v0.3.0) (unreleased)


### BREAKING CHANGES

* **Package renamed.** `@tripp-horbinski/sportviz` → `@basketball-ceo/charts`. `@sportviz/core` (unpublished) → `@basketball-ceo/core`. Update imports accordingly. The first publish under the new names is `@basketball-ceo/{core,charts}@0.2.0`.


### Features

* publish `@basketball-ceo/core` standalone for non-React consumers
* drop README copy hack at publish time; each package owns its own README
* fix `exports` map ordering so TypeScript resolves `types` first
* basketball-only focus: drop multi-sport keywords and language

## [0.2.1](https://github.com/tripp-horbinski/sportviz/compare/v0.2.0...v0.2.1) (2026-04-25)


### Bug Fixes

* include README.md in published npm package ([2b8268a](https://github.com/tripp-horbinski/sportviz/commit/2b8268a091b90359a8287185df4b66575f05b3fa))

# [0.2.0](https://github.com/tripp-horbinski/sportviz/compare/v0.1.10...v0.2.0) (2026-04-25)


### Bug Fixes

* add persist-credentials: false for semantic-release git push ([7512c38](https://github.com/tripp-horbinski/sportviz/commit/7512c3865383dacd1f2be13a9e30b4b7971b3765))
* remove workspace:* from react package.json for npm compat ([4fd1c6b](https://github.com/tripp-horbinski/sportviz/commit/4fd1c6bb3a191f6b4b9ed3038cb16bfc40a07a75))
* replace workspace:* with file:../core for npm compatibility ([42013b0](https://github.com/tripp-horbinski/sportviz/commit/42013b0821289245dc141abe7d7f3e086092c26a))
* restore workspace:*, use bunx semantic-release ([1948e58](https://github.com/tripp-horbinski/sportviz/commit/1948e5865aab84ec8ed316dd68c6df80666dec81))
* use @semantic-release/exec to avoid npm version workspace:* conflict ([a93508e](https://github.com/tripp-horbinski/sportviz/commit/a93508eef7be07864cc452ee62882cffb67478cb))


### Features

* add semantic-release for automated versioning and publishing ([538dc9b](https://github.com/tripp-horbinski/sportviz/commit/538dc9b01e92569f570a9ea0f85f01519ce5a67e))
