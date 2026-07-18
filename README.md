# 🎨 WallBloom  - Wallpaper Generator

Complete  wallpaper generator with Python backend and React frontend.


## ✨ Features

### 10 Procedural Patterns
- Hills, Waves, Dunes, Mountains, Arcs, Scribble, Geometric, Noise, Gradient, Cellular

### 12 Color Palettes
- Charcoal, Stone, Ocean Blue, Sunrise, Fire, Purple, Neon, Arctic, Forest, Sunset, Deep Space, Tropical

### High-Resolution Export
- **Desktop**: 3840×2160 (4K)
- **Mobile**: 1290×2796

### Real-Time Preview
- Desktop (16:9) and Mobile (9:19.5) side-by-side preview
- Live updates as you change patterns/palettes

### Easy to Use
- Select pattern
- Choose palette
- Shuffle for variations
- Toggle light/dark mode
- Download wallpaper

## 🚀 Quick Start (10 Minutes)

### Terminal 1: Backend

```bash
cd backend
pip install -r requirements.txt
python main.py
```

**Expected**: `INFO: Uvicorn running on http://0.0.0.0:8000`

### Terminal 2: Frontend

```bash
cd frontend
npm install
npm run dev
```

**Expected**: `Local: http://localhost:3000/`

### Open Browser

Visit **http://localhost:3000** 🎉

---

## 📁 Project Structure

```
aurawall-fixed/
├── backend/                          # Python FastAPI backend
│   ├── main.py                       # FastAPI application
│   ├── pattern_engine.py             # Pattern generation engine
│   ├── requirements.txt              # Python dependencies
│   ├── .env.example                  # Environment template
│   └── README.md                     # Backend documentation
│
├── frontend/                         # React 18 frontend
│   ├── src/
│   │   ├── pages/
│   │   │   └── Home.tsx             # Main page
│   │   ├── services/
│   │   │   └── api.ts               # API client
│   │   ├── App.tsx                  # Main component
│   │   ├── main.tsx                 # Entry point
│   │   └── index.css                # Global styles
│   ├── package.json                 # Dependencies
│   ├── vite.config.ts               # Vite configuration
│   ├── tsconfig.json                # TypeScript config
│   ├── tailwind.config.js           # Tailwind CSS config
│   ├── index.html                   # HTML entry
│   ├── .env.example                 # Environment template
│   └── README.md                    # Frontend documentation
│
├── SETUP_GUIDE.md                    # Complete setup guide
└── README.md                         # This file
```

---

## 🔧 Technology Stack

| Component | Technology |
|---|---|
| **Backend** | FastAPI, Uvicorn, Python 3.9+ |
| **Frontend** | React 18, TypeScript, Tailwind CSS, Vite |
| **Image Generation** | PIL/Pillow |
| **HTTP Client** | Axios |

---

## 📊 API Endpoints

### Health Check
```
GET /health
```

### Patterns
```
GET /api/patterns
```

### Palettes
```
GET /api/palettes
```

### Preview Image
```
GET /api/wallpapers/preview?pattern_type=hills&palette_index=0&seed=12345&inverted=false&width=800&height=600
```

### Download Desktop (4K)
```
GET /api/wallpapers/download/desktop?pattern_type=hills&palette_index=0&seed=12345&inverted=false
```

### Download Mobile
```
GET /api/wallpapers/download/mobile?pattern_type=hills&palette_index=0&seed=12345&inverted=false
```

---

## 🎯 How It Works

### Pattern Generation
1. User selects pattern type
2. User selects color palette
3. System generates unique seed
4. Backend renders pattern using PIL
5. Frontend displays preview
6. User can shuffle for variations
7. User downloads at desired resolution

### Deterministic Generation
- **Same seed + pattern + palette = Same image**
- Perfect for reproducibility
- Uses seeded random number generator

### Color Inversion
- Toggle between light and dark modes
- Inverts RGB values: `(255-R, 255-G, 255-B)`

---

## 🛠️ Development

### Backend Development

```bash
cd backend

# Start with auto-reload
python main.py

# Format code
pip install black
black main.py pattern_engine.py

# Type check
pip install mypy
mypy main.py pattern_engine.py
```

### Frontend Development

```bash
cd frontend

# Start with HMR
npm run dev

# Build for production
npm run build

# Preview build
npm run preview

# Lint code
npm run lint
```

---

## 🚀 Production Deployment

### Backend

```bash
# Docker
docker build -t aurawall-backend ./backend
docker run -p 8000:8000 aurawall-backend

# Gunicorn
pip install gunicorn
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker

# Cloud: Heroku, Railway, Render, AWS, Google Cloud, DigitalOcean
```

### Frontend

```bash
# Build
npm run build

# Vercel
vercel

# Netlify
netlify deploy --prod --dir=dist

# Any static host: upload dist/ folder
```

---

## 🐛 Troubleshooting

### Backend Issues

**Port 8000 already in use**
```bash
lsof -i :8000
kill -9 <PID>
```

**Module not found**
```bash
pip install -r requirements.txt
```

**Python version error**
```bash
python --version  # Should be 3.9+
```

### Frontend Issues

**Port 3000 already in use**
```bash
npm run dev -- --port 3001
```

**Module not found**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Backend connection error**
1. Verify backend running: `curl http://localhost:8000/health`
2. Check `.env`: `VITE_API_URL=http://localhost:8000`
3. Check browser console (F12)

---

## ✅ Verification

After setup, verify:

- [ ] Backend running on http://localhost:8000
- [ ] Frontend running on http://localhost:3000
- [ ] API docs at http://localhost:8000/docs
- [ ] Can see patterns
- [ ] Can see palettes
- [ ] Preview updates
- [ ] Shuffle works
- [ ] Mode toggle works
- [ ] Can download desktop
- [ ] Can download mobile

---

## 📚 Documentation

- **Setup**: See `SETUP_GUIDE.md`
- **Backend**: See `backend/README.md`
- **Frontend**: See `frontend/README.md`
- **API Docs**: http://localhost:8000/docs (after starting backend)

---

## 💡 Tips

### Customization

**Add New Pattern**
1. Edit `backend/pattern_engine.py`
2. Add function `generate_my_pattern()`
3. Add to `PatternType` enum
4. Add to pattern generation logic

**Add New Palette**
1. Edit `backend/pattern_engine.py`
2. Add to `PRESET_PALETTES` list
3. Frontend automatically picks it up

**Change UI Colors**
1. Edit `frontend/tailwind.config.js`
2. Modify theme colors
3. Frontend auto-reloads

### Performance

- Backend: ~50-100ms for preview, ~500-1000ms for 4K
- Frontend: Real-time with HMR
- Optimize: Use production build, enable caching

---

## 📄 License

MIT License - Free to use and modify

---

## 🎉 Success!

If you can:
1. ✅ Access http://localhost:3000
2. ✅ See wallpaper patterns
3. ✅ Generate wallpapers
4. ✅ Download wallpapers

**Congratulations! Your AuraWall setup is complete! 🚀**

---

## 📞 Support

- Check `SETUP_GUIDE.md` for detailed setup
- Check `backend/README.md` for backend details
- Check `frontend/README.md` for frontend details
- Check API docs at http://localhost:8000/docs

---

**Happy creating! 🎨✨**
