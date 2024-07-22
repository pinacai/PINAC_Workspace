<div align="center">

<h1 style="border-bottom: none">
    <b><a href="https://github.com/pinacai">PINAC</a></b><br>
    Personal Intelligent Network Assistant Companion
</h1>

<img src="https://github.com/pinacai/PINAC_Workspace/blob/main/assets/header.png" alt="header image">

<br>
<br>

![Star Badge](https://img.shields.io/static/v1?label=%F0%9F%8C%9F&message=If%20Useful&style=style=flat&color=BC4E99)
![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)
[![View Repositories](https://img.shields.io/badge/View-Our_Repositories-blue?logo=GitHub)](https://github.com/pinacai?tab=repositories)

A user-first, cross-platform, open-source desktop AI assistant for all

One Next-Gen AI Chat for all your needs.
<br>
<br>

![](https://skillicons.dev/icons?i=react,typescript,vite,electron)

</div>

<br />

## What is PINAC Workspace ?

PINAC Workspace simplifies AI use for everyone, allowing users to get high-quality results without complex prompts. Our easy-to-use beautiful desktop app allows you to express your needs in simple language and receive optimal outcomes. This empowers users to tap into powerful AI capabilities, saving time and boosting creativity across various fields.

## 🎨 App Interface

Introducing our distraction-free, user-friendly app interface with three stunning themes. Designed to help you stay focused and productive.
<br />

<img src="https://github.com/pinacai/PINAC_Workspace/blob/main/assets/Dawn_%26_Dusk.jpg" alt="Dawn & Dusk Screenshot">
<img src="https://github.com/pinacai/PINAC_Workspace/blob/main/assets/Cyber_Tech_01.jpg" alt="Cyber Tech 01 Screenshot">
<img src="https://github.com/pinacai/PINAC_Workspace/blob/main/assets/Aesthetic_Unbound.jpg" alt="Aesthetic Unbound Screenshot">


## 🏛️ Architecture

<img src="https://github.com/pinacai/PINAC_Workspace/blob/main/assets/rchitecture_diagram.svg" alt="App Architecture Diagram">


## 📂 File Structure

<details>
<summary>
Overview of File Structure to Help You Get Started
</summary>

    .
    ├── backend /
    |    ├── main.ts           # medium between frontend & server
    |    └── user data /       # for storing user data
    |
    ├── electron /
    |    ├── main.ts
    |    └── preload.ts
    |
    └── frontend /
         ├── App.tsx
         ├── App.css           # All element's colors theme-wise
         ├── assets /          # Img, Icons, Fonts
         |
         ├── Components /      # common components
         |    ├── style /      # all css files component-wise
         |    ├── ui /         # for small ui elements
         |    ├── Header.tsx
         |    └── Sidebar.tsx
         |         
         └── pages /
              |
              ├── Home /
              |    ├── index.tsx       # main file
              |    ├── components /    # for elements only used here
              |    ├── context /       # if required
              |    └── style /         # all css component-wise
              |
              ├── About Us /           # same as HomePage
              ├── Settings /           # same as HomePage
              ├── Profile /            # same as HomePage
              └── Login /              # same as HomePage

</details>


## 🚀 Project Setup

### _Recommended IDE Setup_

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

### _Notice_

We have added a cloud development server to facilitate faster development. Now, developers unfamiliar with using LLMs can easily run and test this app with AI responses from the server without setting up any local server.

### _Setup the App_

1. Clone the Repository

   ```bash
   git clone https://github.com/pinacai/PINAC_Workspace.git && cd PINAC_Workspace
   ```

2. Install Node dependencies

   ```bash
   npm install
   ```

3. Start the App
   ```bash
   npm run dev
   ```

## 🎉 Contributing

1. Star the repository
2. Fork the repository on GitHub.
3. Clone the project to your machine.
4. Commit changes to your branch.
5. Push your work back up to your fork.
6. Submit a Pull request so that we can review your changes

## 📄 License

PINAC Workspace is licensed under the **GPL-3.0 license**. See the <a href="https://github.com/pinacai/PINAC_Workspace/blob/main/LICENSE">LICENSE</a> file for more details.

## 🌐 Support

If you have any support questions or to report issues, please file an issue through the GitHub issue tracker associated with the repository.


![Line](https://user-images.githubusercontent.com/85225156/171937799-8fc9e255-9889-4642-9c92-6df85fb86e82.gif)

<div align="center">
  <h1>Tip from us 😇</h1>
  <p>It always takes time to understand and learn. So, don't worry at all. We know <b>you have got this</b>! 💪</p>
  <h3>Show some &nbsp;❤️&nbsp; by &nbsp;🌟&nbsp; this repository!</h3>
</div>
