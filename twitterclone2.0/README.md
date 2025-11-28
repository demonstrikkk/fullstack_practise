# 📣 ClonyTweet 2.0 — A Modern Social Media Experience

> *A full-stack social media platform built for real-time interaction and scale.*

<!-- PROJECT BANNER -->

<p align="center">
  <img src="assets/banner-dark-placeholder.png" alt="ClonyTweet 2.0 Banner" width="100%" />
</p>

---

## 🎥 Screenshots (Add Yours Here)

> Replace placeholders with real UI screenshots (PNG/JPG recommended)

| Feature          |                         Preview                        |
| ---------------- | :----------------------------------------------------: |
| Home Feed        |    ![Feed Placeholder](assets/feed-placeholder.png)    |
| Chat / Messaging |    ![Chat Placeholder](assets/chat-placeholder.png)    |
| User Profile     | ![Profile Placeholder](assets/profile-placeholder.png) |
| Authentication   |    ![Auth Placeholder](assets/auth-placeholder.png)    |

> Create an **assets** folder in your repo and drop your images there.

---

## 🚀 Live Demo

> Deployment (Render): Add link in repo description or first comment

---

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


