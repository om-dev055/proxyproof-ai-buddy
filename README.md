# ProxyProof AI

ProxyProof AI is a smart attendance system designed to eliminate proxy attendance in classrooms.
It ensures that attendance can only be marked during a live class session, preventing misuse of shared QR codes or remote check-ins.


Web App URL:- https://proxyproof-ai-buddy.vercel.app

## 🚨 Problem
Traditional QR-based attendance systems are vulnerable to proxy attendance.
Students can share QR codes via messaging apps or reuse old codes to mark attendance without being physically present.


## 💡 Solution
ProxyProof AI enforces real-time validation using:
- Live class sessions controlled by the teacher
- Dynamic QR codes linked to backend sessions
- Selfie verification to confirm physical presence
- Secure server-side validation
- AI-powered insights for teachers


## ✨ Key Features
- **Teacher Live Sessions** – Only one active class session at a time
- **Dynamic QR Codes** – Expire automatically after session ends
- **Student Selfie Verification** – Ensures classroom presence
- **Secure Backend Validation** – Attendance accepted only for active sessions
- **AI Chat Assistant (Google Gemini)** – Explains attendance patterns and anomalies
- **Analytics Dashboard** – Monthly trends and students below attendance threshold
- **Privacy-First Design** – Selfies auto-deleted within 24 hours


## 🧠 How It Works
1. Teacher starts a class session
2. Backend generates a live session with a dynamic QR code
3. Students scan the QR and submit a live selfie
4. Attendance is validated and stored securely
5. Gemini AI analyzes data and provides explainable insights


## 🏗 Architecture Overview
Teacher → Live Session → Dynamic QR  
Student → QR Scan + Selfie → Supabase Backend  
Gemini AI → Insights & Alerts for Teachers


## 🛠 Tech Stack
- **Frontend:** React, TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Row Level Security)
- **AI:** Google Gemini (chat assistant & explainable analytics)
- **Hosting:** Vercel


## 🚀 Live Demo
https://proxyproof-ai-buddy.vercel.app


## 🔮 Future Enhancements
- Google OAuth authentication for students and teachers
- Face match verification
- Institution-wide dashboards
- Automated reports for academic compliance


## 📄 License
MIT
