> **Hello everyone**,
> 
> We are currently checking whether the app is functioning smoothly. If anyone encounters an error in the backend or from the server, please report the bug in the Issue.

<div align="center">

<h1 style="border-bottom: none">
    <b><a href="https://github.com/pinacai">PINAC Workspace</a></b><br>
    Personal Intelligent Network Assistant Companion
</h1>

<img src="https://github.com/pinacai/PINAC_Workspace/blob/main/assets/header.png" alt="header image">

<br>
<br>

![Star Badge](https://img.shields.io/static/v1?label=%F0%9F%8C%9F&message=If%20Useful&style=style=flat&color=BC4E99)
![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)
[![View Repositories](https://img.shields.io/badge/View-Our_Repositories-blue?logo=GitHub)](https://github.com/pinacai?tab=repositories)

A privacy-focused, cross-platform and open-source alternative for Copilot on Windows.  
One Next-Gen AI Chat for all your needs.
<br>
<br>

![](https://skillicons.dev/icons?i=react,typescript,vite,electron)

</div>

<br />

## Why PINAC Workspace ?

Leveraging multiple AI tools for your workflow sounds smart. However, does the constant context switching between them slow you down?

Experience the **Next Gen AI Chat** —your all-in-one chat for text generation, document summarization, web searching, code generation, and a wide range of office tools.

> View our Roadmap & Progress: https://github.com/orgs/pinacai/projects/1  

## 🎨 Themes

Responsive design like never before, from the narrowest screen to the full screen or half-screen, it adopted smoothly...
<br />

<img src="https://github.com/pinacai/PINAC_Workspace/blob/main/assets/app_theme.png" alt="app screenshot">


## 📂 File Structure
The best file structure ever!

    .
    ├── backend /              # medium between frontend & server
    |    ├── main.ts
    |    ├── server /          # Python server
    |    └── user data /       # for storing user data
    |
    ├── electron /
    |    ├── main.ts
    |    └── preload.ts
    |
    └── frontend /
         ├── App.tsx
         ├── App.css           # All Theme's colours
         ├── assets /          # Img, Icons, Fonts
         ├── Components /      # Page's components 
         └── pages /


##  🚀 Project Setup

### _Recommended IDE Setup_

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

### Setup the backend

1. Clone the Repository
    ```bash
    git clone https://github.com/pinacai/PINAC_Workspace.git && cd PINAC_Workspace
    ```

2. create virtualenv and activate it
    ```bash
    python -m venv env && source env/bin/activate
    ```

3. install the python dependencies with
    ```bash
    pip install -r requirements.txt
    ```

### Install the App

1. Install Node dependencies
    ```bash
    npm install
    ```

2. Start the App
    ```bash
    npm run dev
    ```
> **NOTICE**: Currently you have to give both OPENAI & GEMINI API otherwise server will through error, if you have one key, put other one randomly anything, but don't select that Model to use.

> **Remember**: Always activate the python virtual env with the command `source env/bin/activate` before starting the app with command `npm run dev`. Otherwise server will not start.

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

## Contributors

Our project had come a long way from starting, thanks to our contributors for shaping our project beautifully.

## Author

**Rajesh Mondal** - @RajeshTechForge
