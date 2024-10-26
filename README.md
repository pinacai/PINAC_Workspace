<div align="center">

**Note**: _Image generation models still not implemented, just the UI elements added._

<h1 style="border-bottom: none">
    <b><a href="https://github.com/pinacai">PINAC Workspace</a></b>
</h1>

<img src="https://github.com/pinacai/PINAC_Workspace/blob/main/assets/header 2.png" alt="header image">

<br>
<br>

![Star Badge](https://img.shields.io/static/v1?label=%F0%9F%8C%9F&message=If%20Useful&style=style=flat&color=BC4E99)
![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)
[![View Repositories](https://img.shields.io/badge/View-Our_Repositories-blue?logo=GitHub)](https://github.com/pinacai?tab=repositories)

A privacy-first, cross-platform, open-source desktop AI assistant for all

One Next-Gen AI Chat for all your needs.
<br>
<br>

![](https://skillicons.dev/icons?i=react,typescript,vite,electron)

</div>

<br />

PINAC Workspace is a modern-looking _privacy-first_ AI chat for desktops, seamlessly blending Electron and React for a modern user experience. Unlock the full potential of AI with unparalleled simplicity and user-friendliness, while enjoying ultimate freedom and privacy.

## Why PINAC Workspace ?

PINAC Workspace simplifies AI use for everyone, allowing users to get high-quality results without complex prompts. Our easy-to-use beautiful desktop app allows you to express your needs in simple language and it applies the expert-level prompt on top of it after identifying the user's specific requirement so that users receive optimal outcomes. This empowers users to tap into powerful AI capabilities, saving time and boosting creativity across various fields.

## 🎨 App Interface

Introducing our distraction-free, user-friendly app interface with three stunning themes. It is designed to help you stay focused and productive. it comes with three themes,
<br />

<img src="https://github.com/pinacai/PINAC_Workspace/blob/main/assets/Dawn_%26_Dusk.jpg" alt="Dawn & Dusk Screenshot">
<img src="https://github.com/pinacai/PINAC_Workspace/blob/main/assets/Cyber Tech 01.jpg" alt="Cyber Tech 01 Screenshot">
<img src="https://github.com/pinacai/PINAC_Workspace/blob/main/assets/Aesthetic_Unbound.jpg" alt="Aesthetic Unbound Screenshot">

## 📂 File Structure

Overview of File Structure to Help You Get Started.

    .
    ├── public /
    ├── index.html
    |
    ├── electron /
    |    ├── main.ts
    |    ├── preload.ts
    |    ├── prompts.ts
    |    └── model /
    |
    └── src /
         ├── App.tsx
         ├── App.css           # All element's colors theme-wise
         |
         ├── components /      # common components
         |    ├── styles /
         |    ├── MarkdownStyle.tsx
         |    ├── Menubar.tsx
         |    ├── Sidebar.tsx
         |    └── ThemeToggle.tsx
         |
         ├── context /
         |    ├── StopTextGeneration.ts
         |    ├── SubPage.tsx
         |    ├── ThemeMode.tsx
         |    └── ThemeStyle.tsx
         |
         ├── features /
         |    ├── aboutUs /
         |    ├── authentication /
         |    ├── header /
         |    ├── inputPanel /
         |    ├── msgBubble /
         |    ├── profile /
         |    ├── settings /
         |    ├── authentication /
         |    └── welcomeText /
         |
         └── pages /
              ├── styles /
              ├── Home.tsx
              └── Login.tsx

## 🚀 Getting Started

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

We highly welcome contributions! Please follow the steps if you're interested.

1. Star the repository
2. Fork the repository on GitHub.
3. Clone the project to your machine.
4. create you own branch.
5. Commit changes to your branch.
6. Push your work back up to your fork.
7. Submit a Pull request so that we can review your changes

## 📄 License

PINAC Workspace is licensed under the **GPL-3.0 license**. See the <a href="https://github.com/pinacai/PINAC_Workspace/blob/main/LICENSE">LICENSE</a> file for more details.

# Contributors

Thanks to our contributors, we have received huge support from the open-source community.

<a href="https://github.com/pinacai/PINAC_Workspace/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=pinacai/PINAC_Workspace" />
</a>

# other

_We are also building the official website for our Organization and PINAC_Workspace. If you want to contribute to it visit our repository <a href="https://github.com/pinacai/PINAC_Web">**PINAC-Web**</a>_
