# 📲 WhatsApp Reminder Bot

A smart and extensible unofficial WhatsApp chatbot built with modern tools including [`whatsapp-web.js`](https://github.com/pedroslopez/whatsapp-web.js), [`Agenda`](https://github.com/agenda/agenda), [`MongoDB`](https://www.mongodb.com/), [`chrono-node`](https://github.com/wanasit/chrono), and [`AssemblyAI`](https://www.assemblyai.com/).  
This bot allows users to create, manage, and transcribe reminders using natural language via text or voice messages — directly from WhatsApp.

---

## ✨ Features

- 🧠 **Natural Language Understanding**  
  Understands expressions like `in 10 minutes`, `tomorrow at 9 AM`, or `next Friday`.

- 🗓️ **Smart Reminders**  
  - Create one-time or recurring reminders  
  - Cancel or delete reminders  
  - List all upcoming scheduled reminders

- 🎹 **Voice-to-Reminder**  
  Transcribe voice messages into reminders using the free tier of [AssemblyAI](https://www.assemblyai.com/)

- 📂 **Persistent Storage**  
  MongoDB stores all reminders and job metadata for durability

- 🔐 **Secure WhatsApp Integration**  
  Uses `whatsapp-web.js` for authenticated messaging via QR code

---

## 🧱 Tech Stack

| Tool              | Purpose                                 |
|-------------------|-----------------------------------------|
| `whatsapp-web.js` | WhatsApp Web client automation          |
| `Agenda`          | Background job scheduler with MongoDB   |
| `MongoDB`         | Persistent NoSQL data storage           |
| `chrono-node`     | Natural language date parsing           |
| `Node.js`         | JavaScript runtime                      |
| `Node.js`         | JavaScript runtime                      |

---

## 📦 Installation

### 1. Clone the Repository

```bash
git https://github.com/Azharkoivila/wwebjs-WhatsApp-Reminder-Bot.git
cd wwebjs-WhatsApp-Reminder-Bot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
MONGODB_URI=mongodb://localhost:27017/wwebjs-reminder-bot
ASSEMBLY_API=Your Api key
```

> 🔑 Replace `your_assemblyai_api_key` with your actual API key from [AssemblyAI](https://app.assemblyai.com/).

### 4. Run the Bot

```bash
npm start
```

Scan the QR code using WhatsApp on your phone to authenticate.

---

## 🧠 How It Works

### 📝 Text Reminder

User sends a message like:

```
Remind me on [date] at [time] to [message]
```

✅ The bot uses `chrono-node` to parse the date/time, and `Agenda` to schedule the reminder.

---

### 🔊 Voice Reminder

1. User sends a voice note:  
   “Remind me on [date] at [time] to [message].”

2. Bot workflow:
   - Downloads the `.ogg` audio
   - Sends to `AssemblyAI` for transcription
   - Parses the transcribed text using `chrono-node`
   - Schedules a reminder via `Agenda`

---

### ⏰ Reminder Delivery

At the scheduled time, the bot sends the reminder directly to the user on WhatsApp.

---

## 💬 Example Commands

| Command                                     | Description                            |
|--------------------------------------------|----------------------------------------|
| `Remind me on [date] at [time] to [message]`   | Schedule a reminder using text         |
| `Remind me on [today..] at [time] to [message]  | Natural language date parsing          |
| `cancel reminder`                        | Cancel to call mom              |
| `show reminders`                        | Display list of upcoming reminders     |
| *(Send a voice message)*                   | Transcribes and creates a reminder     |

---
/**
 * Converts the given date and time to Indian Standard Time (IST).
 *
 * @param {Date|string|number} inputDate - The date and time to be converted. Can be a Date object, ISO string, or timestamp.
 * @returns {Date} The converted date and time in IST.
 *
 * @note This function only supports Indian Standard Time (IST, UTC+5:30).
 */


## 🔊 AssemblyAI Integration

- 🎧 Accepts `.ogg` voice messages from WhatsApp
- ♻️ Converts speech to text using AssemblyAI API
- 🗕 Parses text and schedules as a new reminder
- 🌁 Free tier allows up to 5 hours of transcription per month



---


## 🌐 Links

- [AssemblyAI API Docs](https://docs.assemblyai.com/)
- [whatsapp-web.js GitHub](https://github.com/pedroslopez/whatsapp-web.js)
- [Agenda GitHub](https://github.com/agenda/agenda)
- [chrono-node GitHub](https://github.com/wanasit/chrono)

