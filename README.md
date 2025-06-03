<div align="center">

<img src="https://github.com/pinacai/PINAC_Workspace/blob/main/assets/header_2.png" alt="header image">

<br>
<br>

<img alt="GitHub commit activity" src="https://img.shields.io/github/commit-activity/m/pinacai/PINAC_Workspace"/>
<img alt="Github Last Commit" src="https://img.shields.io/github/last-commit/pinacai/PINAC_Workspace"/>
<img alt="Github Contributors" src="https://img.shields.io/github/contributors/pinacai/PINAC_Workspace"/>
<img alt="GitHub closed issues" src="https://img.shields.io/github/issues-closed/pinacai/PINAC_Workspace"/>

[![View My Profile](https://img.shields.io/badge/View-My_Profile-green?logo=GitHub)](https://github.com/rajeshtechforge)

A privacy-first, cross-platform, open-source desktop AI assistant for all

<br>

![](https://skillicons.dev/icons?i=react,tailwindcss,typescript,vite,electron,python)

</div>

<br />

## PINAC Workspace

PINAC Workspace is a modern-looking _privacy-first_ AI chat for desktops, seamlessly blending Electron-React for a modern user experience with powerfully Python backend. Unlock the full potential of AI with unparalleled simplicity and user-friendliness, while enjoying ultimate freedom and privacy.

## ⭐ Features

- **Freedom:** Pinac Workspace supports both local (Ollama) and our pinac-cloud model, providing you with the freedom to choose how you want to utilize the platform. 

- **Privacy-first**: Use our app with complete peace of mind! We prioritize your privacy by ensuring that you can access all features without sharing any personal data. Plus, we do not store any data on our servers, making it a truly privacy-first experience.

- **Local RAG**: Easily document attachments in your chat using our lightweight local RAG model. You also have the option to integrate and use your own RAG model for enhanced flexibility.

- **Web Search**: Access real-time information with our web search feature, allowing you to quickly answer questions and stay updated. 

- **Authentication**: Experience a secure Sign-in with Firebase Authentication and Sign-out, ensuring that your identity and data are protected.

- **Chat History**: Easily access and review your chat history anytime, allowing you to revisit and refine your conversations. All chats are stored locally on your PC for enhanced privacy and convenience.

- **Modern UI/UX**: Modern-looking AI chat interface for desktops, seamlessly blending Electron-React for a modern user experience with powerfully Python backend.

## 🎨 UI-Design

<img src="https://github.com/pinacai/PINAC_Workspace/blob/main/assets/UI-Design.png" alt="app screenshot">

## 📂 File Structure

Overview of File Structure in Brief to Help You Get Started.

      .
      ├── index.html
      ├── public/
      ├── electron/
      |
      ├── backend/
      |   ├── auth/
      |   ├── utils/
      |   ├── models/
      |   ├── rag/
      |   ├── app.py
      |   ├── app.spec
      |   ├── build_app.py
      |   ├── custom_types.py
      |   └── requirements.txt
      |
      └── src/
          ├── App.tsx
          ├── index.css
          ├── index.tsx
          ├── components/
          │   ├── FrameHeader.tsx
          │   ├── GreetingText.tsx
          │   ├── MarkdownRenderer.tsx
          │   └── ModalBox.tsx
          │
          ├── context/
          │   ├── Attachment.tsx
          │   ├── Authentication.tsx
          │   ├── ChatMsg.tsx
          │   ├── EmbeddingSettings.tsx
          |   ├── ModalBox.tsx
          │   ├── ModelSettings.tsx
          │   ├── OllamaSettings.tsx
          │   ├── SettingsProvider.ts
          │   ├── StopTextGeneration.ts
          │   ├── themeManager.ts
          │   └── WelcomeText.tsx
          │
          ├── features/
          │   ├── appSettings/
          │   ├── sidebar/
          │   ├── chatHistory/
          │   ├── chatInput/
          │   ├── database/
          │   └── messageBubble/
          │
          └── pages/
              ├── Home.tsx
              └── SignIn.tsx

## 🚀 Getting Started

> [!NOTE]  
> Make sure Ollama is installed in your system

1. Clone the Repository

   ```bash
   git clone https://github.com/pinacai/PINAC_Workspace.git && cd PINAC_Workspace
   ```

2. Install Node dependencies

   ```bash
   npm install
   ```

3. Create a Python Env for running backend

   ```bash
   cd backend && python -m venv venv
   ```

4. Install Python dependencies

   ```bash
   # Activate the virtual environment
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate

   pip install -r requirements.txt
   ```

5. Start the App  
   (For regular time usage, no need to start the Python env or backend file separately)
   ```bash
   npm run dev
   ```
   
   If want to build the app for production, just run `npm run build`

## 🎉 Contributing

We highly welcome contributions! Please follow the steps if you're interested.

1. Star this repository
2. Fork the repository on GitHub.
3. Clone the project to your machine.
4. Create your own branch.
5. Commit changes to your branch.
6. Push your work back up to your fork.
7. Submit a Pull request so that we can review your changes

## 📄 License

PINAC Workspace is licensed under the **GPL-3.0 license**. See the <a href="https://github.com/pinacai/PINAC_Workspace/blob/main/LICENSE">LICENSE</a> file for more details.

## 🌏 Contributors

Thanks to our contributors, we have received huge support from the open-source community.

<a href="https://github.com/pinacai/PINAC_Workspace/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=pinacai/PINAC_Workspace" />
</a>
