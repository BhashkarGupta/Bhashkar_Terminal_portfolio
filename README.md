# 📟 Bhashkar's Terminal Portfolio

> **System Status:** [ONLINE]  
> **Kernel:** React + TypeScript + Vite  
> **Theme:** Dual-Boot (Bash/PowerShell)

![License](https://img.shields.io/github/license/BhashkarGupta/Bhashkar_Terminal_portfolio?style=flat-square&color=00ff00)

An interactive, terminal-themed personal portfolio designed for the modern **SysAdmin** and **Security Researcher**. It bridges the gap between a standard web experience and a developer's CLI, featuring a unique **Dual-Shell Environment Switcher**.

---

## ⚡ Key Features

* **🔀 Dual-Shell Toggle:** Instantly switch between **Linux (Bash)** and **Windows (PowerShell)** environments.
    * *Bash Mode:* Uses `root@techfixerlab:~$` prompt with matrix-green accents.
    * *PowerShell Mode:* Uses `PS C:\Users\Administrator>` prompt with classic blue/yellow accents.
* **📂 "Simulated" Navigation:** Clickable commands that mimic terminal execution (`cat about.txt`, `Get-Command Skills`).
* **🔒 Secure "Handshake" Contact:** Contact section styled as opening network ports and secure channels.
* **📄 JSON-Configured Content:** All data (Experience, Projects, Skills) is separated from logic, mimicking a system config dump.
* **📱 Responsive Design:** Fully optimized mobile view that collapses the terminal window into a touch-friendly interface.

---

## 🛠️ Tech Stack

This project is engineered with modern frontend tooling to ensure performance and type safety.

* **Core:** [React](https://react.dev/) (v18)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Styling:** Custom CSS Variables (No heavy UI frameworks)
* **Icons:** Lucide React

---

## 🚀 Installation & Local Development

To inspect the source code or run this locally:

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/BhashkarGupta/Bhashkar_Terminal_portfolio.git](https://github.com/BhashkarGupta/Bhashkar_Terminal_portfolio.git)
    cd Bhashkar_Terminal_portfolio
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Start the Development Server**
    ```bash
    npm run dev
    ```
    Access the terminal at `http://localhost:5173`.

---

## ⚙️ Configuration

The portfolio content is decoupled from the UI logic. You can modify the data in `src/constants.ts` (or `metadata.json` depending on your build):

* **`User Profile`**: Update name, role, and uptime.
* **`Prompt Strings`**: Customize the Bash/PS prompt text.
* **`Theme Colors`**: Adjust CSS variables in `index.css` for custom syntax highlighting.

---

## 🚢 Deployment

This project is configured for **GitHub Pages**.

1.  Update `vite.config.ts` with your base URL:
    ```typescript
    base: "/Bhashkar_Terminal_portfolio/",
    ```
2.  Build the project:
    ```bash
    npm run build
    ```
3.  Deploy the `dist` folder to the `gh-pages` branch.

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

> **Built by [Bhashkar Gupta](https://github.com/BhashkarGupta)** > *Accelerated by AI | Driven by Coffee*