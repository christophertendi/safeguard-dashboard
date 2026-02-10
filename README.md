# 🛡️ SafeGuard AI - Content Moderation Platform

**Live Demo:** https://safeguard-dashboard-three.vercel.app/  
**API:** https://safeguard-ai.safeguardai.workers.dev

## 🎯 Overview
SafeGuard AI uses a hybrid moderation approach:
rule-based keyword detection for deterministic enforcement,
combined with ML-based inference (Cloudflare Workers AI) for contextual understanding.

## ✨ Features
- ✅ Text toxicity detection (keyword-based)
- ✅ Image moderation (coming soon)
- ✅ Real-time analysis (<200ms)
- ✅ Global edge deployment
- ✅ Modern responsive UI

## 🚀 Tech Stack
- **Frontend:** React, Vercel
- **Backend:** Cloudflare Workers
- **AI:** Cloudflare Workers AI (Llama 2, ResNet-50)
- **Cost:** $0/month (100% free tier)

## 📊 Performance
- **Latency:** 100-200ms globally
- **Uptime:** 99.9%

## 🔧 Local Development
```bash
# Frontend
npm install
npm start

# Backend (Worker)
cd ../safeguard-ai
npx wrangler dev
```

## 🌐 Deployment
- Frontend auto-deploys to Vercel on push to `main`
- Backend: `npx wrangler deploy`

## 📸 Screenshots

![SafeGuard AI Demo](screenshots/text%20moderation%20-%20flagged.png)

## 👨‍💻 Author
**Christopher Samuel Tendi**
- [LinkedIn](https://linkedin.com/in/christopher-tendi)
- [Portfolio](https://tinyurl.com/Christophers-Portfolio)
- Email: chris.samuelten@gmail.com