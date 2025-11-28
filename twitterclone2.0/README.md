# 📣 ClonyTweet 2.0 — A Modern Social Media Experience

> *A full-stack social media platform built for real-time interaction and scale.*

<!-- PROJECT BANNER -->

<p align="center">
  <img width="1911" height="870" alt="Screenshot 2025-11-28 201928" src="https://github.com/user-attachments/assets/324aed27-1343-4255-a847-0c7a4c1afc98" />
</p>

---

## 🎥 Screenshots (Add Yours Here)

> Replace placeholders with real UI screenshots (PNG/JPG recommended)

| Feature          |                         Preview                        |
| ---------------- | :----------------------------------------------------: |
| Home Feed        |    ![Feed Placeholder](<img width="1911" height="870" alt="Screenshot 2025-11-28 201928" src="https://github.com/user-attachments/assets/324aed27-1343-4255-a847-0c7a4c1afc98" />)    |

| Chat / Messaging |    ![Chat Placeholder](<img width="1918" height="864" alt="Screenshot 2025-11-28 202034" src="https://github.com/user-attachments/assets/b4286c76-3fdf-4135-8b8b-e6f509de830a" />)    |

| User Profile     | ![Profile Placeholder](<img width="1909" height="863" alt="Screenshot 2025-11-28 202113" src="https://github.com/user-attachments/assets/c1dc0d24-1ede-45dd-9d87-a9c0cc6661ab" />) |





## 🚀 Live Demo

> Deployment (Render): https://clonytweet2-0.onrender.com/


## 🧩 Features

### Core Social Experience

* Create, like, and comment on posts
* Real-time 1-to-1 messaging via **Supabase Realtime**
* View and edit user profile
* Clean dark UI for modern social feel

---

## 🏗️ Tech Stack

| Category   | Technologies                 |
| ---------- | ---------------------------- |
| Frontend   | Next.js, React, Tailwind CSS |
| Backend    | Next.js API Routes           |
| Database   | MongoDB Atlas                |
| Real-Time  | Supabase                     |
| Auth       | MongoDB Atlas                |
| Deployment | Render                       |

---

## 🛠️ Getting Started

```bash
git clone https://github.com/your-username/clonytweet-2.0.git
cd clonytweet-2.0
npm install
npm run dev
```

➡️ Visit `http://localhost:3000` in your browser

---

## 🔧 Environment Variables

Add `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
MONGODB_URI=your_mongodb_connection_string
```

> Never push actual secrets to GitHub — use `.gitignore` ✔

---

## 📚 Folder Structure

```
src/
 ├─ app/
 ├─ components/
 ├─ lib/
 ├─ server/
public/
assets/      # Add screenshots + banner here
```

---

## 🧠 Key Learnings

* Debugging deployment is where real backend learning happens
* Real-time state sync requires careful architecture decisions
* UI responsiveness directly improves engagement

---

## 🔮 Roadmap

* Media messaging (images & GIFs)
* Notifications
* Infinite scrolling + trending topics
* Following system + personalized feed

> Open for suggestions from the community 🤝

---

## 🤝 Contributing

Feedback and pull requests are always welcome!
Let’s build something bigger together 🚀





## 🧩 System Architecture Overview



```
[ Client: Next.js UI ]
        ⇅ Realtime
[ Supabase Realtime ]
        ⇅ Data
[ MongoDB Atlas Cloud ]
```


