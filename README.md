> [!NOTE]  
> This is the upcoming **v2.1** iteration of the application, which is currently in the development phase. At this time, certain functionalities are still in progress and may be missing from this version.

> We are working on _new powerfull python backend_, so, the cloud AI model is currently unavailable, so the app is operating on local **Ollama** models. Cloud models will be reinstated shortly.

<div align="center">

<h1 style="border-bottom: none">
    <b><a href="https://pinacworkspace.pages.dev">PINAC Workspace</a></b>
</h1>

<img src="https://github.com/pinacai/PINAC_Workspace/blob/main/assets/header.png" alt="header image">

<br>
<br>

![Star Badge](https://img.shields.io/static/v1?label=%F0%9F%8C%9F&message=If%20Useful&style=style=flat&color=BC4E99)
![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)
[![View My Profile](https://img.shields.io/badge/View-My_Profile-green?logo=GitHub)](https://github.com/rajeshtechforge)

A privacy-first, cross-platform, open-source desktop AI assistant for all

<br>

![](https://skillicons.dev/icons?i=react,tailwindcss,typescript,vite,electron,python)

</div>

<br />

PINAC Workspace is a modern-looking _privacy-first_ AI chat for desktops, seamlessly blending Electron and React for a modern user experience. Unlock the full potential of AI with unparalleled simplicity and user-friendliness, while enjoying ultimate freedom and privacy.

## Why PINAC Workspace ?

PINAC Workspace simplifies AI use for everyone, allowing users to get high-quality results without complex prompts. Our easy-to-use, beautiful desktop app allows you to express your needs in simple language and it applies the expert-level prompt on top of it after identifying the user's specific requirement so that users receive optimal outcomes. This empowers users to tap into powerful AI capabilities, saving time and boosting creativity across various fields.

## 📂 File Structure

Overview of File Structure in Brief to Help You Get Started.

      .
      ├── index.html
      ├── public/
      ├── backend/
      |   ├── app.py
      |   ├── models/
      |   ├── backend.spec
      |   └── requirements.txt
      ├── electron/
      └── src/
          ├── App.tsx
          ├── index.css
          ├── index.tsx
          ├── components/
          │   ├── FrameHeader.tsx
          │   ├── GreetingText.tsx
          │   ├── MarkdownRenderer.tsx
          │   ├── Modal.tsx
          │   ├── Sidebar.tsx
          │   └── ThemeToggle.tsx
          │
          ├── context/
          │   ├── Attachment.tsx
          │   ├── Authentication.tsx
          │   ├── ChatMsg.tsx
          │   ├── ModelSettings.tsx
          │   ├── StopTextGeneration.ts
          │   └── WelcomeText.tsx
          │
          ├── database/
          |
          ├── features/
          │   ├── aboutUs/
          │   ├── chatHistory/
          │   ├── chatInput/
          │   ├── header/
          │   ├── chatMessage/
          │   ├── profile/
          │   └── settings/
          │
          └── pages/
              ├── Home.tsx
              ├── SignIn.tsx
              └── styles/

## 🚀 Getting Started

<!-- > [!TIP]
> If you are facing any problem with authentication, you can switch to branch `minimal-version` to use the app without authentication(it uses a development server), provided for testing ui. -->

1. Clone the Repository

   ```bash
   git clone https://github.com/pinacai/PINAC_Workspace.git && cd PINAC_Workspace
   ```

2. Install Node dependencies

   ```bash
   npm install
   ```

3. Create Python Env for running backend

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
   (For regular time usage, No need to start the python env or backend file seperately)
   ```bash
   npm run dev
   ```

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

## 📢 Announcement

_We are also building the website for PINAC Workspace along with this app, where we are developing the backend api endpoints in it. If you want to contribute to it visit our repository <a href="https://github.com/pinacai/pinac_web">**PINAC Web**</a>_
