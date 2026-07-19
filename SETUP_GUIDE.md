# WallBloom  - Complete Setup Guide

Complete guide to run the wallpaper generator (Python backend + React frontend).

## 📦 What You Have

### Backend (Python FastAPI)
- 10 + procedural patterns
- 12 + color palettes
- High-resolution image export
- No authentication required
- No database required
- Stateless design

### Frontend (React 18)
- Real-time preview
- Pattern selector
- Palette selector
- Shuffle button
- Download buttons
- Theme toggle

## 🚀 Quick Start (10 Minutes)

### Terminal 1: Start Backend

```bash
cd backend
pip install -r requirements.txt
python main.py
```

**Expected output**:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

✅ Backend running on http://localhost:8000

### Terminal 2: Start Frontend

```bash
cd frontend
npm install
npm run dev
```

**Expected output**:
```
VITE v4.4.0  ready in 123 ms

➜  Local:   http://localhost:3000/
```

✅ Frontend running on http://localhost:3000

### Open Browser

Visit **http://localhost:3000** 🎉

---

## ✨ Features

### Patterns (10 Total)
1. **Hills** - Sine wave based hills
2. **Waves** - Layered wave pattern
3. **Dunes** - Sand dune simulation
4. **Mountains** - Peak-based mountains
5. **Arcs** - Circular arc pattern
6. **Scribble** - Random line pattern
7. **Geometric** - Shapes (circles, rectangles, triangles)
8. **Noise** - Random colored squares
9. **Gradient** - Linear color gradient
10. **Cellular** - Grid-based cellular pattern

### Palettes (12 Total)
1. Charcoal
2. Stone
3. Ocean Blue
4. Sunrise
5. Fire
6. Purple
7. Neon
8. Arctic
9. Forest
10. Sunset
11. Deep Space
12. Tropical

### Export Resolutions
- **Desktop**: 3840×2160 (4K)
- **Mobile**: 1290×2796
- **Preview**: Custom size

---

## 🔧 Detailed Setup

### Backend Setup

#### Step 1: Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

**Required packages**:
- fastapi==0.104.1
- uvicorn==0.24.0
- pydantic==2.5.0
- pillow==10.1.0
- python-dotenv==1.0.0

#### Step 2: Run Backend

```bash
python main.py
```

The backend will start on http://0.0.0.0:8000

#### Step 3: Verify Backend

Open in browser or curl:
```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000000",
  "service": "AuraWall Backend"
}
```

### Frontend Setup

#### Step 1: Install Node Dependencies

```bash
cd frontend
npm install
```

#### Step 2: Configure Environment

```bash
cp .env .env
```

Verify `.env`:
```env
VITE_API_URL=http://localhost:8000
```

#### Step 3: Start Frontend

```bash
npm run dev
```

The frontend will start on http://localhost:3000

#### Step 4: Open in Browser

Visit http://localhost:3000

---

## 🎯 How to Use

1. **Select Pattern** - Click any pattern button
2. **Choose Palette** - Click any palette swatch
3. **Preview** - See real-time preview
4. **Shuffle** - Click shuffle for random variation
5. **Toggle Mode** - Click light/dark button
6. **Download** - Click download button

---

## 🔌 API Endpoints

### Health Check
```
GET /health
```

### List Patterns
```
GET /api/patterns
```

### List Palettes
```
GET /api/palettes
```

### Get Preview Image
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

## 📊 API Documentation

Interactive API docs available at:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## 🛠️ Troubleshooting

### Backend Won't Start

#### "Port 8000 already in use"
```bash
# Kill existing process
lsof -i :8000
kill -9 <PID>

# Or use different port
PORT=8001 python main.py
```

#### "Module not found"
```bash
pip install -r requirements.txt
```

#### "Python version error"
```bash
# Check Python version
python --version

# Should be 3.9+
# Install Python 3.11 if needed
```

### Frontend Won't Start

#### "Port 3000 already in use"
```bash
npm run dev -- --port 3001
```

#### "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

#### "Node version error"
```bash
# Check Node version
node --version

# Should be 16+
```

### Backend Connection Error

#### "Cannot connect to backend"
1. Verify backend is running: `curl http://localhost:8000/health`
2. Check `.env` in frontend: `VITE_API_URL=http://localhost:8000`
3. Check browser console (F12) for errors
4. Check network tab for failed requests

---

## 📁 Directory Structure

```
aurawall-fixed/
├── backend/
│   ├── main.py                    # FastAPI app
│   ├── pattern_engine.py          # Pattern generation
│   ├── requirements.txt           # Dependencies
│   ├── .env.example               # Environment template
│   └── README.md                  # Backend docs
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   └── Home.tsx          # Main page
│   │   ├── services/
│   │   │   └── api.ts            # API client
│   │   ├── App.tsx               # Main component
│   │   ├── main.tsx              # Entry point
│   │   └── index.css             # Styles
│   ├── package.json              # Dependencies
│   ├── vite.config.ts            # Vite config
│   ├── tsconfig.json             # TypeScript config
│   ├── tailwind.config.js        # Tailwind config
│   ├── index.html                # HTML entry
│   ├── .env.example              # Environment template
│   └── README.md                 # Frontend docs
│
└── SETUP_GUIDE.md                # This file
```

---

## 🚀 Development Workflow

### Backend Development

```bash
cd backend

# Start development (auto-reload)
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

# Start development (HMR enabled)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## 📦 Production Deployment

### Backend

```bash
# Using Gunicorn
pip install gunicorn
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000

# Using Docker
docker build -t aurawall-backend ./backend
docker run -p 8000:8000 aurawall-backend

# Cloud platforms: Heroku, Railway, Render, AWS, Google Cloud, DigitalOcean
```

### Frontend

```bash
# Build
npm run build

# Deploy to Vercel
vercel

# Deploy to Netlify
netlify deploy --prod --dir=dist

# Deploy to any static host
# Upload dist/ folder
```

---

## 🐛 Common Issues

| Issue | Solution |
|---|---|
| Backend won't start | Check Python 3.9+, kill port 8000, install dependencies |
| Frontend won't start | Check Node 16+, kill port 3000, install dependencies |
| Can't connect to backend | Verify backend running, check VITE_API_URL, check network tab |
| Images not downloading | Check browser download settings, check network tab |
| Patterns look wrong | Verify seed is consistent, check pattern type |
| Colors inverted unexpectedly | Check inverted toggle, try different palette |

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Backend running on http://localhost:8000
- [ ] Frontend running on http://localhost:3000
- [ ] API docs at http://localhost:8000/docs
- [ ] Can see patterns in frontend
- [ ] Can see palettes in frontend
- [ ] Preview updates when pattern changes
- [ ] Shuffle generates different images
- [ ] Mode toggle inverts colors
- [ ] Can download desktop wallpaper
- [ ] Can download mobile wallpaper
- [ ] Downloaded image matches preview

---

## 💡 Tips

### Development
- Backend auto-restarts on file changes
- Frontend has HMR (Hot Module Reload)
- Use browser DevTools (F12) for debugging
- Check console for errors

### Performance
- Use production build for frontend
- Enable caching in backend
- Monitor network requests
- Check image generation times

### Customization
- Add new patterns in `pattern_engine.py`
- Add new palettes in `PRESET_PALETTES`
- Modify UI in `frontend/src/pages/Home.tsx`
- Change colors in `tailwind.config.js`

---

## 📞 Support

### Documentation
- Backend: `backend/README.md`
- Frontend: `frontend/README.md`
- Setup: This file

### API Docs
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Debugging
1. Check browser console (F12)
2. Check network tab for API calls
3. Check backend logs in terminal
4. Check frontend logs in terminal

---

## 🎉 Success!

If you can:
1. ✅ Access http://localhost:3000
2. ✅ See wallpaper patterns
3. ✅ Generate wallpapers
4. ✅ Download wallpapers

