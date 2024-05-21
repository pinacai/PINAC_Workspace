<img src="https://github.com/pinacai/PINAC_Workspace-2.0/blob/main/assets/header.png" alt="">

<div align="center">

<img src="https://github.com/pinacai/PINAC_Workspace-2.0/blob/main/assets/build-with-electron-&-react.svg" alt="Made By Electron & React">
<img src="https://github.com/pinacai/PINAC_Workspace-2.0/blob/main/assets/powered-by-python.svg" alt="Powered By Python">
<img src="https://github.com/pinacai/PINAC_Workspace-2.0/blob/main/assets/maintained-with-love.svg" alt="Maintained With Love">
<br>
<br>
PINAC Workspace is a comprehensive, AI-integrated cross-platform desktop application designed to manage all your tasks in Google Workspace Apps. It also includes AI web searching, office work management, and friendly conversations with AI. Build with Electron and React, with a powerful backend using Python.  
</div>


## 🔮 Vision and Objectives

In today's world, **AI has become ubiquitous and indispensable**. However, managing various tasks often requires **separate applications**: one app for AI writing, another for enhancing content, and then reverting to the original app to complete the task. This constant switching between windows consumes excessive time and reduced productivity.

**Imagine a world where everything you need is in one chat**. We have created the **Next Gen AI Chat**, allowing you to ditch the app switching! With this innovative feature, you can effortlessly manage your Google Workspace tasks, perform AI powered web searches, engage in friendly conversations with AI, tackle coding problems, and access a wide range of office tools – all within a single, convenient application.

### Key Objectives
- **Effortless Gmail Management**: Create official or personalized email templates using AI, modify or improve them within the chat, and then create drafts or send emails directly from the chat. Additionally, search any email and receive notifications for priority emails.
- **Schedule Master:** Optimize your schedule effortlessly with AI assistance! Simply communicate your needs, and the AI will craft personalized timetables, vacation plans, or task lists that seamlessly integrate with your existing commitments. Easily add events or tasks to Google Calendar via voice commands directly from the chat.
- **Google Drive Integration:** You can summarize, modify, take notes, or ask questions from Google Drive files, even without downloading them! Additionally search for files, download or upload documents.
- **Contact Search:** Effortlessly manage your Google contacts with ease. Instantly search for existing contacts or seamlessly create new ones, all simply by asking!
- **Google Form Designer:** Create professional-looking Google Forms by simply describing your needs to the AI, which will generate the form for you.
- **AI Web Searching:** Elevate your online research with AI-powered precision! Dive into internet searches or product research with AI as your guide, streamlining every step. Experience tailored search results, meticulously filtered by content relevance rather than mere titles, ensuring that you find exactly what you’re looking for with ease
- **Automate Office Works:** Unleash the power of AI with PINAC Workspace to craft compelling content! Effortlessly generate professional letters, engaging articles, detailed product descriptions, and more.
- **Friendly Conversation:**  Whether you need advice or want to engage in casual conversation during breaks, the AI is here to assist you.

With its comprehensive feature set and AI-driven capabilities, PINAC Workspace aims to streamline your workflow, boost productivity, and provide a seamless experience for managing your Google Workspace tasks and beyond.


## 💠 Current Progress
- Craft and send emails seamlessly with the assistance of AI. Modify or enhance your drafts within the chat, and send them directly from the chat interface.
- View your upcoming events and due tasks from Google Calendar by simply asking the AI in the chat. We are currently working on implementing the calendar view feature.
- search for contacts from your Google Contacts directory and retrieve it immediately,
- Easily locate and download your files stored in Google Drive. While the backend functionality is already in place, we are actively working on integrating the Google Drive features into the app's frontend.
-  You can engage in conversations with an AI to tap into LLM's extensive knowledge and receive assistance on a wide range of topics.  


## 🎨 UI Design
<img src="https://github.com/pinacai/PINAC_Workspace-2.0/blob/main/assets/app_theme.png" alt="app screenshot">

## 📁 File Structure
Just the important part you need to get started

    .
    ├── server /               # Contains Python code for the backend
    |    ├── ai_models /
    |    ├── google /          # Google API automation files
    |    ├── configs /         # to store your secrets
    |    └── main.py           # final python script (communicate with electron's main.js)
    |
    └── src /                  # Client side files
         ├── main /            # Contains main.js file of Electron
         ├── preload /         
         └── renderer /                    # Stores React frontend files
              └── src /
                   ├── App.jsx
                   ├── App.css                     # All Theme's colors
                   ├── assets /                    # Img, Icons, Fonts
                   └── Components /                # App's components
                         ├── page_components /  
                         └── pages /

> **Note**:
  > - `App.jsx` contains code for initializing pages for a specific URL like `/home`.
  > - `pages/` contains Jsx file for particular pages
  > - Each `pages/` & `page_components/` has its own `style/` folder to store its styling.

##  🚀 Project Setup
Follow these steps to set up the PINAC-Workspace on your system:

### Prerequisites
- _Node.js_
- _Python_
- _npm (Node Package Manager)_
- _OPENAI API Key_
- _Internet Connection_

### Recommended IDE Setup
- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

### 1. Clone the Repository
  ```bash
  git clone https://github.com/pinacai/PINAC_Workspace-2.0.git
  cd pinac_workspace
  ```

### 2. Install
  ```bash
  $ npm install
  ```
### 3. Create virtualenv & activate it
  ```bash
  $ python -m venv .env
  ```
  ```bash
  $ source .env/bin/activate
  ```
### 4. Install python dependencies
  ```bash
  $ pip install -r requirements.txt
  ```

### 5. Get your Google secret token & OPENAI API Key
  Follow the steps in <a href='https://github.com/pinacai/PINAC_Workspace-2.0/blob/main/Google%20API%20GUIDE.md'>Google API Guide</a> and get your Google secret key & place it in `server/configs` with the name exactly as `client_secret.json`.  
    
  Now to place your _OPENAI API Key_ create `.env` file in the folder `server/configs` and copy-paste the below line in `.env`:
  ```python
  OPENAI_API_KEY = "<Place your OPENAI API Key here>"
  ```

### 6. Start the App
  ```bash
  $ npm run dev
  ```

### Build (optional) // Not tested
  ```bash
  # For windows
  $ npm run build:win

  # For macOS
  $ npm run build:mac

  # For Linux
  $ npm run build:linux
  ```

> ### ⚠️ Warning
> _No proper Google Sign-In button added, you will automatically directed to the SignIn page when you run a command related to a Google App task, for only once, for the first time._  
>
> **Soon we will add a Sign-In button...**

## 💁 Contributing
Contributions to PINAC Workspace are welcome! Here’s how you can contribute:

1. Star the repository
2. Fork the repository on GitHub.
3. Clone the project to your machine.
4. Commit changes to your own branch.
5. Push your work back up to your fork.
6. Submit a Pull request so that we can review your changes
7. Please ensure your commits adhere to the project's coding style and all tests pass.

## 📄 License
PINAC Workspace 2.0 is licensed under the **GPL-3.0 license**. See the <a href="https://github.com/pinacai/PINAC_Workspace-2.0/blob/main/LICENSE">LICENSE</a> file for more details.

## 🌐 Support
If you have any support questions or to report issues, please file an issue through the GitHub issue tracker associated with the repository.

## ✍️  Authors and Acknowledgement
Thank you to all the contributors who have helped build and optimise the PINAC Workspace from our previous repository '<a href="https://github.com/pinacai/PINAC_Workspace">PINAC_Workspace</a>'.
