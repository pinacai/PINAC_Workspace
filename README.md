<img src="https://github.com/pinacai/pinac_workspace/blob/main/assets/Automate%20Your%20Workflow-modified.png" alt="">

<div align="center">

<img src="https://github.com/pinacai/pinac_workspace/blob/main/assets/build-with-electron-&-react.svg" alt="Made By Electron & React">
<img src="https://github.com/pinacai/pinac_workspace/blob/main/assets/powered-by-python.svg" alt="Powered By Python">
<img src="https://github.com/pinacai/pinac_workspace/blob/main/assets/maintained-with-love.svg" alt="Maintained With Love">
<br>
<br>
<b>PINAC Workspace is a comprehensive AI-integrated</b> desktop application designed to automate and streamline tasks within <b>Google Workspace</b>. Utilizing the combination of Electron with React for responsive, <b>cross-platform</b> app design, along with the capabilities of Python PINAC-Workspace offers functionality that enhances productivity for tasks such as sending emails, managing tasks, and checking events directly from the desktop. This tool is ideal for individuals and teams looking to achieve high efficiency in their workflow.
</div>

## 🌟 Present Features
Discover the Exciting Features of PINAC Workspace:

- **Email Automation:** Effortlessly Manage All Your Emails with a Single Command: Send, Receive, and Organize!
- **Task Management:** Effortlessly Monitor and Stay Current with Your Tasks Right from Your Desktop!
- **Event Scheduling:** Seamlessly View and Manage Your Calendar Events with Ease.
- **User-Friendly Interface:** Experience the sleek, intuitive design powered by React, enhancing your user interaction.
- **High Customizability:** Tailor the workspace to meet your specific needs with our easy-to-customize options.
- **Cross-Platform Compatibility:** Enjoy the flexibility to operate across various systems, courtesy of the Electron framework.

## 📸 Screenshot
<img src="https://github.com/pinacai/pinac_workspace/blob/main/assets/screenshot.png" alt="app screenshot">

##  🚀 Project Setup
Follow these steps to set up the PINAC-Workspace on your system:

### Prerequisites
- _Node.js_
- _Python_
- _npm (Node Package Manager)_
- _OPENAI API Key_

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
> _No proper Google Sign In button added, you will automatically directed to SignIn page when you run a command related to Google App task, for only once, for first time._  
>
> **Soon we will add a signIn button...**

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
For support inquiries or to report issues, please file an issue through the GitHub issue tracker associated with the repository.

## ✍️  Authors and Acknowledgement
Thank you to all the contributors who have helped in building and optimizing the PINAC Workspace from our previous repository `PINAC-Workspace`.
