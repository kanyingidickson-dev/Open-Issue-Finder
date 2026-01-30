# Changelog

All notable changes to IssueFinder will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> Note: Tags for versions prior to v2.0.0 were not created in Git.

## [2.1.1] - 2026-01-30

### Fixed
- Resolved missing dark-mode alpha background variable used by glass/sticky header surfaces
- Added missing UI animations and styles used by skeleton loading and spinning loaders
- Improved resilience of local state by safely parsing corrupted localStorage values
- Improved clipboard copy robustness (graceful failure handling)
- Improved repo avatar icon fallback rendering

### Security
- Remediated dev dependency advisory by pinning `esbuild` via `npm overrides` and confirming `npm audit` is clean

## [2.1.0] - 2026-01-21

### Added
- URL-synced filters for shareable and persistent state
- Saved searches for quick reuse
- Repository health scoring

### Technical / Dev
- Vitest setup with initial GitHub API tests
- CI workflows and contribution templates
- Fixed GitHub Pages asset paths and improved environment typings

### Documentation
- Polished README
- Added backend roadmap

### Notes
- No breaking changes
- Builds on v2.0.0 features

## [2.0.0] - 2026-01-14

### Added
- **Saved Collections**: Bookmark interesting issues locally using localStorage for later review
- **View Modes**: Switch between "Discovery Pipeline" and "Saved Collection" views
- **Status Filter**: Filter issues by Open, Closed, or All states
- **Sort Options**: Sort results by Newest, Most Commented, or Recently Updated
- **Keyboard Shortcuts**: Power-user navigation with `D` (Discovery), `S` (Saved), `T` (Theme), `/` (Search)
- **Toast Notifications**: Visual feedback for save/remove actions
- **Data Export**: Export saved issues as JSON from Settings
- **100 Issues Per Page**: Added option for power users who want more results
- **API Rate Limit Warning**: Prominent warning in Guide modal about GitHub API limits
- **Debounced Search**: 300ms debounce on API calls to prevent excessive requests

### Changed
- **Quick Guide Modal**: Complete redesign with card-based layout, keyboard shortcuts section, and rate limit warning
- **Settings Modal**: Enhanced with Appearance, Display, and Data Management sections
- Version bump from 1.0.0 to 2.0.0

### Fixed
- Added missing `state` property to GitHubIssue type for proper closed issue handling
- Fixed missing icon imports causing TypeScript errors
- Removed unused imports to clean up codebase

---

## [1.0.0] - 2026-01-13

### Added
- **Real-time Discovery**: Direct integration with GitHub Search API for finding open issues
- **Language Filter**: Filter issues by programming language (TypeScript, JavaScript, Python, Rust, Go, Java, C++, C#, PHP, Ruby, Swift, Kotlin, Dart, Scala, Elixir, and more)
- **Focus Labels**: Filter by common labels like "good first issue", "help wanted", "bug", "documentation", "enhancement"
- **Keyword Search**: Search issues by keyword
- **Dark Mode First**: Premium dark theme with light mode toggle
- **Responsive Design**: Mobile-first layout with collapsible sidebar drawer
- **Copy to Clipboard**: Quick copy issue URL functionality
- **External Links**: Direct links to GitHub issues
- **Loading States**: Skeleton loading for better UX
- **Error Handling**: Graceful error states with retry capability
- **Infinite Scroll**: "Load More" pagination for browsing more results

### Technical
- Built with React 19 + Vite 7
- TypeScript for type safety
- Vanilla CSS with CSS variables for theming
- Octokit REST client for GitHub API
- Framer Motion for animations
- Lucide React for icons

---

## [0.1.0] - Initial Development

### Added
- Initial project setup with Vite + React + TypeScript
- Basic GitHub API integration
- Core UI components
