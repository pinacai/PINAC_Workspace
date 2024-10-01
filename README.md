<div align="center">

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
    ├── backend /
    |    ├── model /
    |    ├── prompts /
    |    ├── user data /
    |    └── main.ts
    |
    ├── electron /
    |    ├── main.ts
    |    └── preload.ts
    |
    └── frontend /
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

## 🔥 Available Prompts

<details>
<summary>
Currently, we have a collection of 27+ expert-level prompts
</summary>

|     | Prompt                                                                                                                                                                                           |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | <a href="https://github.com/pinacai/PINAC_Workspace/blob/main/backend/prompts/Summarize/Summarize.md">Summarize</a>                                                                              |
| 2   | <a href="https://github.com/pinacai/PINAC_Workspace/blob/main/backend/prompts/Summarize/Summarize%20In%20Micro.md">Summarize in Micro</a>                                                        |
| 3   | <a href="https://github.com/pinacai/PINAC_Workspace/blob/main/backend/prompts/Summarize/Summarize%20Lengthy%20Documents.md">Summarize Lengthy Documents</a>                                      |
| 4   | <a href="https://github.com/pinacai/PINAC_Workspace/blob/main/backend/prompts/Improve%20Writing/Improve%20Writing.md">Improve Writing</a>                                                        |
| 5   | <a href="https://github.com/pinacai/PINAC_Workspace/blob/main/backend/prompts/Improve%20Writing/Improve%20Academic%20Writing.md">Improve Academic Writing</a>                                    |
| 6   | <a href="https://github.com/pinacai/PINAC_Workspace/blob/main/backend/prompts/Code/Write%20Code.md">Write Code</a>                                                                               |
| 7   | <a href="https://github.com/pinacai/PINAC_Workspace/blob/main/backend/prompts/Code/Explain%20Complete%20Code.md">Explain Complete Code</a>                                                       |
| 8   | <a href="https://github.com/pinacai/PINAC_Workspace/blob/main/backend/prompts/Code/Explain%20Code%20as%20Require%20by%20User.md">Explain Code as Require by User</a>                             |
| 9   | <a href="https://github.com/pinacai/PINAC_Workspace/blob/main/backend/prompts/Writing/Write%20Essay.md">Write Essay</a>                                                                          |
| 10  | <a href="https://github.com/pinacai/PINAC_Workspace/blob/main/backend/prompts/Writing/Write%20Micro%20Essay.md">Write Micro Essay</a>                                                            |
| 11  | <a href="https://github.com/pinacai/PINAC_Workspace/blob/main/backend/prompts/Email/General%20Purpose%20Formal%20Email.md">General Purpose Formal Email</a>                                      |
| 12  | <a href="https://github.com/pinacai/PINAC_Workspace/blob/main/backend/prompts/Email/General%20Purpose%20Personal%20Email.md">General Purpose Informal Email</a>                                  |
| 13  | <a href="https://github.com/pinacai/PINAC_Workspace/blob/main/backend/prompts/Email/Acceptance%20Email.md">Acceptance Email</a>                                                                  |
| 14  | <a href="https://github.com/pinacai/PINAC_Workspace/blob/main/backend/prompts/Email/Acknowledgment%20Email.md">Acknowledgement Email</a>                                                         |
| 15  | <a href="https://github.com/pinacai/PINAC_Workspace/blob/main/backend/prompts/Email/Business%20Email%20(B2B%2C%20B2Employee%2C%20B2Investor).md">Business Email(B2B, B2Employee, B2Investor)</a> |
| 16  | <a href="https://github.com/pinacai/PINAC_Workspace/blob/main/backend/prompts/Email/Confirmation%20Email.md">Confirmation Email</a>                                                              |
| 17  | <a href="https://github.com/pinacai/PINAC_Workspace/blob/main/backend/prompts/Email/Effective%20Complaint%20Email.md">Effective Complaint Email</a>                                              |
| 18  | <a href="https://github.com/pinacai/PINAC_Workspace/blob/main/backend/prompts/Email/Effective%20Inquiry%20Email.md">Inquiry Email</a>                                                            |
| 19  | <a href="https://github.com/pinacai/PINAC_Workspace/blob/main/backend/prompts/Email/Formal%20Congratulation%20Email.md">Formal Congratulation Email</a>                                          |
| 20  | <a href="backend/prompts/Email/Formal Proposal Submission Email.md">Formal Proposal Submission Email</a>                                                                                         |
| 21  | <a href="https://github.com/pinacai/PINAC_Workspace/blob/main/backend/prompts/Email/Formal%20Thank%20You%20Email.md">Formal Thank You Email</a>                                                  |
| 22  | <a href="https://github.com/pinacai/PINAC_Workspace/blob/main/backend/prompts/Email/Formal%20Welcome%20Email.md">Formal Welcome Email</a>                                                        |
| 23  | <a href="https://github.com/pinacai/PINAC_Workspace/blob/main/backend/prompts/Email/Formal%20and%20Polite%20Apology%20Email.md">Polite Apology Email</a>                                         |
| 24  | <a href="https://github.com/pinacai/PINAC_Workspace/blob/main/backend/prompts/Email/General%20Purpose%20Academic%20Email.md">General Purpose Academic Email</a>                                  |
| 25  | <a href="https://github.com/pinacai/PINAC_Workspace/blob/main/backend/prompts/Email/Official%20Announcement%20Email.md">Official Announcement Email</a>                                          |
| 26  | <a href="https://github.com/pinacai/PINAC_Workspace/blob/main/backend/prompts/Email/Professional%20Recommendation%20Email.md">Professional Recommendation Email</a>                              |
| 27  | <a href="https://github.com/pinacai/PINAC_Workspace/blob/main/backend/prompts/Email/Professional%20Resignation%20Email.md">Professional Resignation Email</a>                                    |

</details>

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
4. Commit changes to your branch.
5. Push your work back up to your fork.
6. Submit a Pull request so that we can review your changes

## 📄 License

PINAC Workspace is licensed under the **GPL-3.0 license**. See the <a href="https://github.com/pinacai/PINAC_Workspace/blob/main/LICENSE">LICENSE</a> file for more details.

# Contributors

Thanks to our contributors, we have received huge support from the open-source community.

<a href="https://github.com/pinacai/PINAC_Workspace/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=pinacai/PINAC_Workspace" />
</a>

# other

_We are also building the official website for our Organization and PINAC_Workspace. If you want to contribute to it visit our repository <a href="https://github.com/pinacai/PINAC_Web">**PINAC-Web**</a>_
