<img src="https://github.com/pinacai/pinac_workspace/blob/main/assets/header.png" alt="">

<div align="center">

<img src="https://github.com/pinacai/pinac_workspace/blob/main/assets/build-with-electron-&-react.svg" alt="Made By Electron & React">
<img src="https://github.com/pinacai/pinac_workspace/blob/main/assets/powered-by-python.svg" alt="Powered By Python">
<img src="https://github.com/pinacai/pinac_workspace/blob/main/assets/maintained-with-love.svg" alt="Maintained With Love">
<br>
<br>
PINAC Workspace is a comprehensive AI-integrated cross-platform desktop application designed to automate and streamline tasks within Google Workspace
</div>

## But what's different in it 🤔 ?
Our vision is to make one chat for all. For example, suppose you need to compose an email. In that case, you get your AI-powered template, edit it in the compose box within the chat and send it, or let you need to see your schedule, you can view it in calendar format within the chat, edit it or create a new event, all within the chat.

This minimizes window switching, boosting your productivity and saving time.

## Why should I contribute to this Project ?
We are seeking contributions for this project's development as we aim to take it to the big stage. We value all contributors and strive to make the contribution process easy for everyone.

## 🌟 Current Progress
### Google Integration:
|       |Task 1|    |Task 2|    |Task 3|    |
| ------|--------------------------------|----|-----------------|----|-----------------|----|
| Gmail | Receiving & Viewing email | ❌ | sending email & creating draft | ✅ | searching email | ❌ |
| Calendar | viewing events | 🏗️ | creating events | ❌ | searching event | ❌ |
| Task | viewing task | 🏗️ | creating task | ❌ | searching task | ❌ |
| Contact | --- |  | creating contact | ❌ | searching contact | ✅ |
| Drive | viewing files | ❌ | uploading & downloading files | 🏗️ | searching files | 🏗️ |
> _Other apps are coming soon..._

### App UI(overall) :
|       | status |
| ------|---------------------------|
| Home Page | ✅ Almost completed(functional) |
| Profile Page | 🏗️ Under development |
| About Page | ❌ Not started yet|
| Settings Page | ✅ Just theme style options added (functional) |

## 📸 Screenshot
<img src="https://github.com/pinacai/pinac_workspace/blob/main/assets/screenshot.png" alt="app screenshot">

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
                   ├── App.css                     # Common styles for the whole App
                   ├── assets /                    # App's assets
                   └── Components /                # App's components
                         ├── page_components /  
                         └── pages /

> **Note**:
  > - `App.jsx` contains code for initializing pages for a specific URL like `/home`.
  > - `pages/` contains Jsx file for specific pages
  > - Each `pages/` & `page_components/` has its own `style/` folder to store its styling.

##  🚀 Project Setup
Follow these steps to set up the PINAC-Workspace on your system:

### Prerequisites
- _Node.js_
- _Python_
- _npm (Node Package Manager)_
- _OPENAI API Key_
- _Your Sweet Internet Connection_

### Recommended IDE Setup
- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

### 1. Clone the Repository
  ```bash
  git clone https://github.com/pinacai/pinac_workspace.git
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

### 5. Get your Google secret token
  Follow the steps in <a href='https://github.com/pinacai/pinac_workspace/blob/6314b7e2a4e41bb72c699fad18343d43eee1a320/Google%20API%20Guide.md'>Google API Guide</a> and get your Google secret key & don't forget to place your _OPENAI API Key_ in a `.env` file in the folder `server/configs`.

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
PINAC Workspace is licensed under the GPL-3.0 license. See the <a href="https://github.com/pinacai/pinac_workspace/blob/main/LICENSE">LICENSE</a> file for more details.

## 🌐 Support
If you have any support questions or to report issues, please file an issue through the GitHub issue tracker associated with the repository.

## ✍️  Authors and Acknowledgement
Thank you to all the contributors who have helped build and optimise the PINAC Workspace from our previous repository `PINAC-Workspace`.
