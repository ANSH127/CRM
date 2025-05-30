# 📣 CRM Campaign Platform

This is a full-stack CRM application that allows users to:
- Upload and manage customer data
- Create personalized marketing campaigns
- Use AI to auto-generate segments, messages,summary and tags
- Simulate delivery via dummy vendor
- Implements consumer-driven batching and pub-sub architecture using Redis

---
### ⏱ Time Tracked with WakaTime

[![wakatime](https://wakatime.com/badge/user/660ccb93-e9f4-453a-9f0b-b32ccfa4a93d/project/5966943a-50d5-40c0-b73d-f4d2544c0984.svg)](https://wakatime.com/badge/user/660ccb93-e9f4-453a-9f0b-b32ccfa4a93d/project/5966943a-50d5-40c0-b73d-f4d2544c0984)


---
## 🔧 Tech Stack

- **Frontend**: React, Tailwind CSS, Material UI
- **Backend**: Node.js, Express
- **Database**: MongoDB (Mongoose)
- **Authentication**: Google OAuth 2.0
- **AI**: Gemini AI API
- **Message Broker**: Redis Cloud (Streams & Lists)

---

## 🔐 Features Overview

| Feature | Description |
|--------|-------------|
| 🔑 Google OAuth Login | Only authenticated users can access the app |
| 📥 Customer Upload | Via manual form or Excel import |
| 🧠 AI Features | Segment rule generation, message suggestions, auto-tagging |
| 🎯 Campaign Builder | Rule-based audience targeting |
| 📈 Campaign History | View audience size, delivery stats, filters |
| 📨 Simulated Delivery | Dummy API with 90% sent, 10% failed |
| 🛠 Brownie #1 | Batch delivery log saving using Redis list + worker |
| ⚙️ Brownie #2 | Pub-sub architecture for customer ingestion using Redis streams |

---

## 🤖 AI Features Powered by Gemini

| Feature | Description |
|--------|-------------|
| 🧠 Natural Language → Segment Rule | Converts plain text into MongoDB-style filters |
| 💬 Message Suggestions | Generates promotional messages with `{name}` placeholder |
| 🏷️ Auto Tagging | Suggests a campaign tag like "Win-back", "High Value", etc. |
| 📊 Campaign Summary | AI summarizes campaign performance in plain English |

---

## 🛠 How It Works

### Campaign Flow:
1. User creates campaign using custom rules
2. Preview shows audience size (based on rules)
3. Message/Rules can be AI-generated
4. Campaign is submitted → delivery is simulated
5. Delivery receipts are batched via Redis and stored later

### Async Architecture:
- `POST /delivery-response` → pushed to Redis List (FIFO queue)
- Batch worker reads entries using `RPOP` and saves via `bulkWrite()`
- `POST /create` → added to Redis Stream via `XADD`
- Redis `XREAD` (not consumer group) is used to pull new entries and save

---

## 🖼 Architecture Diagram
```bash

┌──────────────────────────────┐
│          Frontend            │
│      (React + Tailwind)      │
│ ──────────────────────────── │
│  User actions (API calls)    │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│          Backend             │
│   (Node.js + Express)        │
│ ──────────────────────────── │
│ Controllers:                 │
│  - CustomerController        │
│  - CampaignController        │
│  - VendorController          │
│                              │
│ On customer/campaign create: │
│   └─► Push to Redis Stream   │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│         Redis Streams        │
│  (customer_stream, etc.)     │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│           Workers            │
│ ──────────────────────────── │
│  - customerStream.js         │
│  - batchWorker.js            │
│                              │
│  Read from Redis Streams     │
│  Write to MongoDB            │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│           MongoDB            │
│ ──────────────────────────── │
│  - Customers                 │
│  - Campaigns                 │
│  - CommunicationLogs         │
└──────────────────────────────┘
```

---

## 🚀 Setup Instructions

### 1. Clone the repo
```bash
git clone https://github.com/ANSH127/CRM.git
cd CRM
```

### 2.Install dependencies
```bash

cd frontend && npm install
cd backend && npm install
```


### 3. Create .env files
```bash
# (Backend)

JWT_SECRET=...
MONGO_URI=mongodb+srv://...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# (Frontend)
REDDIS_PASSWORD=...
VITE_GOOGLE_CLIENT_ID=...
VITE_GEMINI_API_KEY=...
```

### 4. Start the app
```bash
# Terminal 1 (Backend)
cd backend && npm run dev

# Terminal 2 (Frontend)
cd frontend && npm run dev
```

---

## 🧪 Test Features

- Upload customers via form or drag-and-drop Excel sheet
- Create a campaign using rule-based filters
- Try Gemini AI-generated messages, tags, segment rules, and summary
- Observe delivery logs being saved in batches via Redis FIFO queue
- Add customers → processed through Redis Stream consumer using XREAD

---

## 📽 Demo Video

[Watch here →](https://your-demo-video-link.com)

---

## 🧹 Known Limitations

- SMS/email sending is simulated, not real
- No stream-level deduplication or retry mechanism
- Consumer does not use `XACK` or consumer groups
- Minimal analytics on dashboard
- Basic error handling on some frontend forms

---

## ✨ Bonus Implementations

✅ Consumer-driven delivery logging via FIFO queue  
✅ Pub-sub ingestion using Redis Streams and `XREAD`  
✅ 4 AI features powered by Gemini:
  - Segment rule generation  
  - Message suggestions  
  - Auto-tagging  
  - Campaign summary  
✅ Drag-and-drop Excel import  
✅ Deployed using Redis Cloud  
✅ Frontend styled with Material UI + Tailwind CSS

---

## 🙌 Author

**Ansh Agarwal**  
Frontend + Backend Developer | Passionate about scalable, intelligent systems  
📧 anshagrawal48568@gmail.com  
🌐 [LinkedIn](https://www.linkedin.com/in/ansh-agarwal-390797253/) | [GitHub](https://github.com/ANSH127) | [Portfolio](https://anshdev.vercel.app/)




