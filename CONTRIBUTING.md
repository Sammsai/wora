<p align="center">
  <img src="https://github.com/playwora/wora/blob/main/renderer/public/github/Header.png?raw=true" alt="wora Logo" />
</p>

<p align="center">
  <a href="https://github.com/playwora/wora"><img alt="GitHub Actions Workflow Status" src="https://img.shields.io/github/actions/workflow/status/playwora/wora/release.yml"></a>
  <a href="https://github.com/playwora/wora"><img src="https://img.shields.io/github/last-commit/playwora/wora/main?commit" alt="Last Commit" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/playwora/wora?license" alt="License" /></a>
  <a href="https://discord.gg/CrAbAYMGCe"><img src="https://dcbadge.limes.pink/api/server/https://discord.gg/CrAbAYMGCe?style=flat" alt="Discord" /></a>
  <a href="https://github.com/playwora/wora/stargazers"><img src="https://img.shields.io/github/stars/playwora/wora?style=flat&stars" alt="GitHub Stars" /></a>
  <a href="https://github.com/playwora/wora/network"><img src="https://img.shields.io/github/forks/playwora/wora?style=flat&forks" alt="GitHub Forks" /></a>
  <a href="https://github.com/playwora/wora/watchers"><img src="https://img.shields.io/github/watchers/playwora/wora?style=flat&watchers" alt="GitHub Watchers" /></a>
</p>

## 🤝 Contributing to wora

Thank you for considering contributing to **wora**! 🎉 We welcome contributions from everyone. We have prepared some guidelines for you to get started ✅

## 🛠️ Project Setup

wora is an Electron app built with Next.js and TailwindCSS, using BetterSQLite3 with Drizzle ORM for database management. Here's an overview of the database schema:

```mermaid
erDiagram
    settings {
        int id
        string name
        string profilePicture
        string musicFolder
    }

    songs {
        int id
        string filePath
        string name
        string artist
        int duration
        int albumID
    }

    albums {
        int id
        string name
        string artist
        int year
        string coverArt
    }

    playlists {
        int id
        string name
        string description
        string coverArt
    }

    playlistSongs {
        int playlistId
        int songId
    }

    albums ||--|{ songs : ""
    playlists ||--o{ playlistSongs : ""
    songs ||--o{ playlistSongs : ""
```

## 🎯 **How to Contribute**

Once you get hold of the DB, please check out the file structure in the main branch to get yourself more familiar with the project. If you encounter any issues, support for developers is available through our discord server 🛠️

<a href="https://discord.gg/CrAbAYMGCe"><img src="https://dcbadge.limes.pink/api/server/https://discord.gg/CrAbAYMGCe?style=flat" alt="Discord" /></a>

1. **Fork the Repository**

Fork the [repository](https://github.com/playwora/wora) and clone it locally:

```sh
git clone https://github.com/your-username/wora.git
cd wora
```

2. **Create a New Branch**

Create a new branch for your feature or bugfix:

```sh
git checkout -b feature-branch
```

3. **Install Dependencies**

Install the required dependencies:

```sh
yarn install
```

4. **Start Development Server**

Run the development server to see your changes:

```sh
yarn dev
```

5. **Commit Your Changes**

Commit your changes with a meaningful message:

```sh
git commit -am 'Add new feature ✅'
```

6. **Push to Your Branch**

Push the changes to your branch on GitHub:

```sh
git push origin feature-branch
```

7. **Create a Pull Request**

Go to the original repository on GitHub and create a new pull request. Please also read our [Code of Conduct](CODE_OF_CONDUCT.md) to understand the expectations for behavior within our community 🙏

## 💬 Join the Community

Join our [Discord server](https://discord.gg/CrAbAYMGCe) to connect with other users and developers 🤝

<a href="https://discord.gg/CrAbAYMGCe"><img src="https://dcbadge.limes.pink/api/server/https://discord.gg/CrAbAYMGCe?style=flat" alt="Discord"></a>

---

MIT License. Made with ❤️ by [hiaaryan](https://github.com/hiaaryan) and contributors.
