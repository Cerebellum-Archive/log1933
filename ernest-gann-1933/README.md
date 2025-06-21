# Ernest K. Gann 1933 World Tour - Website

A modern, interactive website showcasing Ernest K. Gann's 1933 world tour, built with Next.js, TypeScript, and Tailwind CSS.

## 🎯 About the Project

This website tells the story of Ernest K. Gann's 1933 world tour, when his father (a telephone company executive) sent him around the world to review telephone companies in Europe and Asia. This journey would later influence his career as one of aviation's greatest storytellers.

## 🚀 Features

- **Interactive Timeline**: Explore Ernest's journey through Europe and Asia
- **Historical Context**: Learn about the world in 1933 and the places he visited
- **Responsive Design**: Beautiful, modern interface that works on all devices
- **Future Logbook Integration**: Coming soon - digitized pages from the original logbook

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
- **Database**: Supabase (for future features)

## 📁 Project Structure

```
ernest-gann-1933/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Homepage
│   │   ├── journey/page.tsx      # World tour timeline
│   │   ├── about/page.tsx        # About Ernest K. Gann
│   │   ├── logbook/page.tsx      # Logbook viewer (coming soon)
│   │   ├── globals.css           # Global styles
│   │   └── layout.tsx            # Root layout
│   └── components/               # Reusable components (future)
├── public/                       # Static assets
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository:**
```bash
git clone <your-repo-url>
cd ernest-gann-1933
```

2. **Install dependencies:**
```bash
npm install
```

3. **Run the development server:**
```bash
npm run dev
```

4. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Pages

### Homepage (`/`)
- Hero section with Ernest's story
- Overview of the 1933 world tour
- Call-to-action to explore the journey

### Journey (`/journey`)
- Interactive timeline of the world tour
- Detailed information about each location
- Historical context for each stop

### About (`/about`)
- Comprehensive biography of Ernest K. Gann
- His early life, aviation career, and literary achievements
- Legacy and impact on aviation literature

### Logbook (`/logbook`)
- Coming soon: Digitized pages from the original logbook
- OCR text extraction and historical context
- Interactive viewer with zoom capabilities

## 🎨 Design System

### Colors
- **Primary**: Blue (#3b82f6) - Aviation theme
- **Background**: Dark slate gradient
- **Text**: White and blue variations
- **Accents**: Blue-300 for highlights

### Typography
- **Headings**: Bold, large scale
- **Body**: Clean, readable fonts
- **Special**: Courier New for aviation feel

### Components
- Cards with hover effects
- Timeline with dots and lines
- Responsive grid layouts
- Custom buttons with animations

## 🔮 Future Features

### Phase 2: Logbook Integration
- [ ] High-resolution logbook page scans
- [ ] OCR text extraction with AI enhancement
- [ ] Interactive page viewer with zoom
- [ ] Search functionality across all entries
- [ ] Historical context for each entry

### Phase 3: Enhanced Interactivity
- [ ] Interactive world map
- [ ] Photo galleries for each location
- [ ] Audio narrations of logbook entries
- [ ] User accounts and favorites
- [ ] Social sharing features

### Phase 4: Advanced Features
- [ ] Timeline visualization with animations
- [ ] Integration with aviation history databases
- [ ] Mobile app companion
- [ ] Educational resources for students
- [ ] API for third-party integrations

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
3. Deploy automatically on push to main branch

### Environment Variables
Create a `.env.local` file for local development:
```bash
# Add any environment variables here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is dedicated to preserving the legacy of Ernest K. Gann and is available for educational and historical research purposes.

## 🙏 Acknowledgments

- Ernest K. Gann family for preserving these historical documents
- The aviation and historical communities
- Next.js and Tailwind CSS teams for excellent tools

## 📞 Contact

For questions about the website or Ernest K. Gann's legacy, please open an issue in this repository.

---

*"The sky is not the limit, it's just the beginning." - Ernest K. Gann*
