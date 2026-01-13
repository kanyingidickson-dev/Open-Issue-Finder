# Open Issue Finder

A production-grade discovery tool for finding beginner-friendly open-source issues. Built with performance, accessibility, and developer experience in mind.

![License](https://img.shields.io/github/license/kanyingidickson-dev/Open-Issue-Finder)
![Stars](https://img.shields.io/github/stars/kanyingidickson-dev/Open-Issue-Finder)
![Issues](https://img.shields.io/github/issues/kanyingidickson-dev/Open-Issue-Finder)

## Features

- **Real-time Discovery**: Directly interfaces with the GitHub API to find the latest issues.
- **Smart Filtering**: Filter by language, labels (e.g., `good first issue`, `help wanted`), and custom search queries.
- **Premium UI/UX**: Dark-mode first design with glassmorphism aesthetics and smooth transitions.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop viewing.

## Tech Stack

- **Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Styling**: [Vanilla CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) (using modern CSS variables and glassmorphism)
- **Icons**: [Lucide React](https://lucide.dev/)
- **API**: [@octokit/rest](https://github.com/octokit/rest.js/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:kanyingidickson-dev/Open-Issue-Finder.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Set up a GitHub Personal Access Token for higher rate limits:
   Create a `.env` file in the root directory:
   ```env
   VITE_GITHUB_TOKEN=your_token_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
