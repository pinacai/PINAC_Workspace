<div align="center">

<h1 style="border-bottom: none">
    <b><a href="https://github.com/pinacai">PINAC Workspace</a></b><br>
    Your Everyday AI Assistant
</h1>

<img src="https://github.com/pinacai/PINAC_Workspace/blob/main/assets/header.png" alt="header image">

<br>
<br>

![Star Badge](https://img.shields.io/static/v1?label=%F0%9F%8C%9F&message=If%20Useful&style=style=flat&color=BC4E99)
![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)
[![View Repositories](https://img.shields.io/badge/View-Our_Repositories-blue?logo=GitHub)](https://github.com/pinacai?tab=repositories)

A privacy-focused, cross-platform, user-first and open-source alternative for Copilot on Windows.  
One Next-Gen AI Chat for all your needs.
<br>
<br>

<img src="https://github.com/pinacai/PINAC_Workspace/blob/main/assets/tech.png" alt="">

</div>

<br />

## Why PINAC Workspace ?

Leveraging multiple AI tools for your workflow sounds smart. However, does the constant context switching between them slow you down?

Experience the **Next Gen AI Chat** —your all-in-one chat for text generation, document summarisation, web searching, code generation, a wide range of office tools and ultimately managing all Google Workspace apps without switching apps!

View our Roadmap & Progress: https://github.com/orgs/pinacai/projects/1  
> We are dedicatedly developing the app by introducing new features and optimising the user interface. Always keeping user in the first priority.


## System Design

<img src="https://github.com/pinacai/PINAC_Workspace/blob/main/assets/System%20Architecture.svg" alt="system architecture diagram">


## 🎨 Themes

Responsive design like never before, from the narrowest screen to the full screen or half-screen, it adopted smoothly...
<br />

<img src="https://github.com/pinacai/PINAC_Workspace/blob/main/assets/app_theme.png" alt="app screenshot">


## 📂 File Structure
The best file structure ever !

    .
    ├── server /               # Contains Python code
    |    ├── ai_models /
    |    ├── google /          # Google API automation files
    |    ├── configs /         # to store your secrets
    |    └── main.py           # final python script (communicate with electron's main.js)
    |
    ├── backend /              # Upcoming...
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
Here are two ways to get started !

### Contributing in Just Frontend

1. Clone the Repository
    ```bash
    git clone https://github.com/pinacai/PINAC_Workspace.git
    cd PINAC_Workspace
    ```

2. Install Node dependencies
    ```bash
    npm install
    ```

3. Start the App
    ```bash
    npm run dev
    ```
> It will show a popup error at the start, bcz of a missing Python server, Just ignore it. It will not affect your development !  

<br>
  
### Full Installation for Using the App

### _Prerequisites_

- Node.js
- Python
- OPENAI API Key or GOOGLE API KEY (which Model you want to use)
- Internet (for now)

### _Recommended IDE Setup_

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

### _Come to the Terminal_

1. Clone the Repository
    ```bash
    git clone https://github.com/pinacai/PINAC_Workspace.git
    cd PINAC_Workspace
    ```

2. Install Node dependencies
    ```bash
    npm install
    ```
3. Create virtualenv & activate it
    ```bash
    python -m venv .env && source .env/bin/activate
    ```
4. Install Python dependencies
    ```bash
    pip install -r requirements.txt
    ```
5. Get your Google secret token & API Key
  Follow the steps in <a href='https://github.com/pinacai/PINAC_Workspace/blob/main/Google%20API%20GUIDE.md'>Google API Guide</a> and get your Google secret key & place it in `server/configs` with the name exactly as `client_secret.json`.   
   
    Now to place your _OPENAI API Key_ and _GOOGLE API KEY_, create `.env` file in the folder `server/configs` and copy-paste the below line in `.env`:
    ```python
    OPENAI_API_KEY = "<Place your OPENAI API Key here>"
    GOOGLE_API_KEY = "<Place your OPENAI API Key here>"
    ```

6. Start the App
    ```bash
    npm run dev
    ```

> _No proper Google Sign-In button added, you will automatically directed to the SignIn page when you run a command related to a Google App task, for only once, for the first time._  
>
> **Soon we will add a Sign-In button...**

## 🎉 Contributing

We are looking for contributors, specially for frontend. Here is how you can contribute:

1. Star the repository
2. Fork the repository on GitHub.
3. Clone the project to your machine.
4. Commit changes to your own branch.
5. Push your work back up to your fork.
6. Submit a Pull request so that we can review your changes

## 📄 License

PINAC Workspace 2.0 is licensed under the **GPL-3.0 license**. See the <a href="https://github.com/pinacai/PINAC_Workspace/blob/main/LICENSE">LICENSE</a> file for more details.

## 🌐 Support

If you have any support questions or to report issues, please file an issue through the GitHub issue tracker associated with the repository.

## Author

**Rajesh Mondal** - @RajeshTechForge
