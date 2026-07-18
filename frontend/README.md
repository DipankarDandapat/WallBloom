# AuraWall Frontend - React

Modern React 18 + TypeScript frontend for the  wallpaper generator.

## Installation

### Prerequisites
- Node.js 16+
- npm or pnpm

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Configure Environment

```bash
cp .env .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:8000
```

### Step 3: Start Development Server

```bash
npm run dev
```

**Expected output**:
```
VITE v4.4.0  ready in 123 ms

➜  Local:   http://localhost:3000/
```

### Step 4: Open in Browser

Visit http://localhost:3000

## Features

✅ **Real-time Preview** - Desktop and mobile preview
✅ **10 Patterns** - Hills, Waves, Mountains, etc.
✅ **12 Palettes** - Beautiful color combinations
✅ **Shuffle** - Generate infinite variations
✅ **Theme Toggle** - Light/dark mode
✅ **High-Resolution Downloads** - 4K desktop and mobile
✅ **No Authentication** - Open access

## Available Scripts

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Project Structure

```
src/
├── pages/
│   └── Home.tsx           # Main page
├── services/
│   └── api.ts             # API client
├── App.tsx                # Main component
├── main.tsx               # Entry point
└── index.css              # Styles
```

## API Integration

The frontend connects to the Python backend at `http://localhost:8000`.

**Ensure the backend is running**:
```bash
cd ../backend
python main.py
```

## Troubleshooting

### Backend Connection Error
1. Verify backend is running on http://localhost:8000
2. Check `VITE_API_URL` in `.env`
3. Check browser console for errors

### Module Not Found
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port 3000 Already in Use
```bash
npm run dev -- --port 3001
```

