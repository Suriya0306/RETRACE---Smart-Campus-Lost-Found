# Call Analytics Dashboard

A modern web application for analyzing call center conversations using AI-powered transcription and sentiment analysis. Features a React frontend with a Flask backend, supporting audio file uploads and real-time processing.

## Project Structure

```
├── frontend/          # React + TypeScript frontend
│   ├── src/          # Source code
│   ├── public/       # Static assets
│   ├── dist/         # Built files
│   └── package.json  # Frontend dependencies
├── backend/          # Flask + Python backend
│   ├── app.py        # Main Flask application
│   ├── tasks/        # Celery tasks for processing
│   └── requirements.txt # Python dependencies
├── API_SPEC.md       # API documentation
├── DEPLOYMENT_GUIDE.md # Deployment instructions
├── setup.ps1         # Environment setup script
└── start-app.ps1     # Multi-server startup script
```

## Features

- **Audio Upload** - Support for MP3 files and direct URL uploads
- **AI Transcription** - OpenAI Whisper integration for accurate speech-to-text
- **Sentiment Analysis** - Google Gemini AI for conversation insights
- **Real-time Processing** - Asynchronous task processing with progress tracking
- **Modern UI** - Responsive React interface with Tailwind CSS
- **RESTful API** - Well-documented Flask API with CORS support

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite 7** for development and building
- **Tailwind CSS 3** with shadcn/ui components
- **Lucide React** for icons

### Backend
- **Flask 3** with Python 3.12
- **OpenAI Whisper** for transcription
- **Google Gemini AI** for analysis
- **Celery + Redis** for async processing
- **SQLite** for data storage

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.12+
- Redis (optional, falls back to sync processing)

### Setup and Run

1. **Clone and setup environment:**
   ```bash
   .\setup.ps1
   ```

2. **Start both servers:**
   ```bash
   .\start-app.ps1
   ```

   Or manually:
   ```bash
   # Terminal 1 - Backend
   cd backend
   python app.py

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

3. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## API Usage

### Upload Audio File
```bash
POST /api/upload
Content-Type: multipart/form-data

Form data:
- audio: File (MP3)
- agent: string (optional)
```

### Upload Audio URL
```bash
POST /api/upload
Content-Type: application/json

{
  "audio_url": "https://example.com/audio.mp3",
  "agent": "Agent Name"
}
```

### Check Task Status
```bash
GET /api/task/{task_id}
```

## Development

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### Backend Development
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

## Environment Variables

Create `.env` file in backend directory:
```
GEMINI_API_KEY=your_gemini_api_key
REDIS_URL=redis://localhost:6379/0
API_KEY=sk_track3_987654321
FLASK_ENV=development
```

## Deployment

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for production deployment instructions.

## License

MIT License
npm run dev
```

## Configuration

All site content is managed through `src/config.ts`. Each section has its own configuration object with TypeScript interfaces for type safety. When a config object has empty values, the corresponding section returns `null` and is not rendered.

### Config Objects

- `siteConfig` - Global site title, description, language
- `navigationConfig` - Logo text, nav links, contact button
- `heroConfig` - Name, roles (displayed on left/right sides), background image path
- `aboutConfig` - Label, description, experience badge, stats array, images array
- `servicesConfig` - Label, heading, services array (each with iconName, title, description, image)
- `portfolioConfig` - Label, heading, description, projects array, CTA card, view all label
- `testimonialsConfig` - Label, heading, testimonials array (each with quote, author, role, company, image, rating)
- `ctaConfig` - Tags, heading, description, button text/href, email, background image
- `footerConfig` - Logo, description, link columns, social links, newsletter, copyright, credit

### Icon Names

Service and social icons use Lucide icon names (PascalCase). Examples: `Compass`, `PenTool`, `Layout`, `Code`, `Dribbble`, `Twitter`, `Linkedin`, `Instagram`.

## Required Images

Place images in `public/images/`:

- `hero-bg.jpg` - Hero section background (full-screen, high resolution)
- `about-1.jpg` to `about-4.jpg` - About section image grid (portrait 4:5 ratio)
- `service-1.jpg` to `service-4.jpg` - Service hover preview images
- `portfolio-1.jpg` to `portfolio-5.jpg` - Portfolio project thumbnails
- `testimonial-1.jpg` to `testimonial-3.jpg` - Testimonial author photos (portrait)
- `cta-bg.jpg` - CTA section background image

## Design System

- **Colors**: Black (#131313), White (#FFFFFF), Base Black (#1D1D1D), Subtle (#EAEAEA), Border (#EFEFF2), Blue (#0082F3), Focus (#4D65FF)
- **Typography**: Geist (400, 500) for body, GeistMono (500) for labels and monospace text
- **Animations**: Custom easing curves (out-quad, out-cubic, out-quart, out-circ, in-out-quad)
- **Layout**: Full-width sections with container-large (80rem max) inner content

## Project Structure

```
src/
  config.ts          # All site content configuration
  App.tsx            # Main app with page load overlay
  App.css            # Base Vite styles
  index.css          # Global styles, fonts, animations, utilities
  main.tsx           # React entry point
  components/
    Navigation.tsx   # Fixed navbar with mobile menu
    AnimatedButton.tsx  # Hover-animated button component
    PageOverlay.tsx  # Loading screen overlay
  sections/
    Hero.tsx         # Full-screen hero with mouse-tracking image reveal
    About.tsx        # Two-column about with image grid
    Services.tsx     # Service cards with hover parallax images
    Portfolio.tsx    # Bento grid project showcase
    Testimonials.tsx # Auto-advancing testimonial carousel
    CTA.tsx          # Call-to-action with background image
    Footer.tsx       # Multi-column footer with newsletter
  hooks/
    useMouseParallax.ts  # Mouse parallax for hero and services
    usePageLoad.ts       # Page load state management
    useScrollAnimation.ts # Intersection Observer scroll reveals
    use-mobile.ts        # Mobile breakpoint detection
  lib/
    utils.ts         # cn() utility for class merging
```
