# ChatBox AI

A secure, session-based AI chat application with user authentication, responsive UI, and clean code.  
This project features a React + Vite frontend and an Express backend with session authentication.

---

## 🚀 Setup Commands

```bash
# 1. Clone the repository
git clone https://github.com/<your-handle>/zerocode-fe-assignment.git
cd zerocode-fe-assignment

# 2. Install dependencies (frontend & backend)
npm install

# 3. Start the app (runs both frontend and backend)
npm run dev
```

- The frontend runs on [http://localhost:5173](http://localhost:5173)
- The backend API runs on [http://localhost:4000](http://localhost:4000)

---

## 🏗️ Architecture Diagram


- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Express + express-session + bcrypt
- **AI:** Together API (Llama-3-70b)
- **Session:** In-memory (for demo; use Redis in production)

---

## 🖼️ Screenshots / GIF Demo

### Login & Register

![Login Screenshot](./screenshots/login.png)

### Chat UI

![Chat Screenshot](./screenshots/chat.png)

### Mobile Responsive

![Mobile Screenshot](./screenshots/mobile.png)



---

## 📄 Features

- Secure session-based authentication (register, login, logout)
- Passwords hashed with bcrypt
- Responsive chat UI with auto-scroll and input history
- Loading indicators for AI responses
- One-command startup (`npm run dev`)

---

## 📬 Contact

For questions, open an issue or contact [manoharmr1234@example.com](mailto:manoharmr1234@example.com).
