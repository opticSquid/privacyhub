# 🔒 PrivacyHub.in - Privacy Policy Analyser

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

**Professional AI-powered privacy policy analyser helping users understand how websites handle their personal data.**

[🌐 Live Demo](https://privacyhub.in) · [📖 Documentation](DEPLOYMENT.md) · [🐛 Report Bug](https://github.com/alokemajumder/privacyhub/issues) · [✨ Request Feature](https://github.com/alokemajumder/privacyhub/issues)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Architecture](#-architecture)
- [Contributing](#-contributing)
- [Deployment](#-deployment)
- [Roadmap](#-roadmap)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)

---

## 🎯 About

PrivacyHub is an open-source privacy policy analyser that empowers users to understand how websites and applications handle their personal data. Using AI-powered analysis, we provide comprehensive privacy assessments including GDPR, CCPA, and DPDP Act compliance checks.

### Why PrivacyHub?

- 🔍 **Transparency**: Clear, jargon-free explanations of privacy policies
- 🤖 **AI-Powered**: Advanced AI analysis using OpenRouter and DeepSeek
- 📊 **Comprehensive Scoring**: Multi-dimensional privacy assessment
- 🌍 **Regulatory Compliance**: GDPR, CCPA, and DPDP Act compliance checks
- 🚀 **Community-Driven**: Open-source and seeking contributions
- 💾 **Historical Data**: Track privacy policy changes over time

---

## ✨ Features

### Core Features

- **🔐 Privacy Policy Analysis**
  - AI-powered analysis of privacy policies
  - GDPR, CCPA, and DPDP Act compliance scoring
  - Risk level assessment (High, Moderate, Low)
  - Privacy grade (A+ to F)
  - Detailed category breakdowns

- **📊 Analysis Dashboard**
  - Visual score representation
  - Regulatory compliance indicators
  - Key findings and recommendations
  - Executive summary for stakeholders

- **🗂️ Community Database**
  - Browse previously analyzed policies
  - Domain-specific analysis pages (`/domain.com`)
  - Automatic caching (30-day validity)
  - Content change detection with MD5 hashing

- **🔒 Enterprise-Grade Security**
  - Rate limiting (5 requests/15min per IP)
  - SSRF protection (blocks private IPs, localhost, metadata endpoints)
  - Input validation and sanitization
  - Security headers (HSTS, CSP, X-Frame-Options)
  - XSS prevention

- **⚡ Performance Optimizations**
  - In-memory caching (60s for history)
  - Firestore caching (30 days for analysis)
  - Image optimization (AVIF/WebP)
  - Static asset caching (1 year)
  - First Load JS: ~130-166 kB

### Additional Features

- Digital fingerprint checker
- Privacy education resources
- Methodology transparency
- Mobile-responsive design
- Dark mode support (coming soon)

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.5.2 (App Router)
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 3.4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React

### Backend
- **API Routes**: Next.js API Routes
- **AI**: OpenRouter (DeepSeek Chat)
- **Web Scraping**: Firecrawl + Puppeteer (fallback)
- **Database**:
  - Firebase Firestore (cloud)
  - SQLite (local fallback)

### Infrastructure
- **Hosting**: Vercel
- **Database**: Firebase Firestore
- **CDN**: Vercel Edge Network
- **Analytics**: Vercel Analytics (optional)

### Security & Performance
- Rate limiting with sliding window algorithm
- Input validation and SSRF protection
- In-memory caching with TTL
- Error handling with exponential backoff retry
- Security headers middleware

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase account (for Firestore)
- OpenRouter API key
- Firecrawl API key (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/alokemajumder/privacyhub.git
   cd privacyhub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your credentials:
   ```env
   # Firebase Client (Public)
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Firebase Admin (Sensitive)
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

   # API Keys (Sensitive)
   OPENROUTER_API=your_openrouter_api_key
   FIRECRAWL_API_KEY=your_firecrawl_api_key
   ```

4. **Set up Firebase**
   ```bash
   # Login to Firebase
   firebase login

   # Deploy Firestore rules and indexes
   firebase deploy --only firestore:rules
   firebase deploy --only firestore:indexes
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

---

## 🏗️ Architecture

### Project Structure

```
privacyhub/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── [domain]/          # Dynamic domain routes
│   │   ├── api/               # API endpoints
│   │   │   ├── analyze/       # Privacy analysis endpoint
│   │   │   └── history/       # Analysis history endpoint
│   │   ├── layout.tsx         # Root layout with metadata
│   │   └── page.tsx           # Homepage
│   ├── components/            # React components
│   │   ├── ui/                # shadcn/ui components
│   │   ├── Header.tsx         # Navigation header
│   │   ├── Footer.tsx         # Footer with links
│   │   └── PrivacyAnalyzer.tsx # Main analysis component
│   ├── lib/                   # Utility libraries
│   │   ├── cache.ts           # In-memory caching
│   │   ├── rate-limiter.ts    # Rate limiting
│   │   ├── error-handler.ts   # Error handling with retry
│   │   ├── input-validation.ts # Input sanitization
│   │   ├── firestore-service.ts # Firestore operations
│   │   ├── firebase-admin.ts  # Firebase Admin SDK
│   │   └── logo-service.ts    # Logo fetching
│   └── middleware.ts          # Security headers middleware
├── public/                    # Static assets
├── firestore.rules           # Firestore security rules
├── firestore.indexes.json    # Firestore indexes
├── firebase.json             # Firebase configuration
└── next.config.ts            # Next.js configuration
```

### Data Flow

1. **User submits URL** → Input validation → SSRF protection
2. **Rate limiting check** → IP-based sliding window
3. **Content check** → MD5 hash comparison → Firestore lookup
4. **If cached** → Return cached analysis (if <30 days old)
5. **If new/changed** → Firecrawl scraping → AI analysis → Save to Firestore
6. **Return results** → Display with logo and compliance scores

### Security Layers

1. **Input Validation** (`input-validation.ts`)
   - URL validation and sanitization
   - Private IP blocking
   - Protocol restriction (HTTP/HTTPS only)

2. **Rate Limiting** (`rate-limiter.ts`)
   - IP-based tracking
   - Sliding window algorithm
   - Automatic cleanup

3. **Middleware** (`middleware.ts`)
   - Security headers (HSTS, CSP, X-Frame-Options)
   - Content Security Policy
   - Referrer Policy

4. **Firestore Rules** (`firestore.rules`)
   - Public read access
   - Server-only writes (Admin SDK)

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Ways to Contribute

- 🐛 **Report Bugs**: [Open an issue](https://github.com/alokemajumder/privacyhub/issues/new?template=bug_report.md)
- ✨ **Request Features**: [Submit a feature request](https://github.com/alokemajumder/privacyhub/issues/new?template=feature_request.md)
- 📝 **Improve Documentation**: Fix typos, add examples, clarify instructions
- 💻 **Submit Code**: Fix bugs, add features, improve performance
- 🎨 **Design**: Improve UI/UX, create graphics, enhance accessibility
- 🌍 **Translate**: Help make PrivacyHub multilingual

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
   - Write clean, documented code
   - Follow existing code style
   - Add tests if applicable
4. **Commit your changes**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Test additions or changes
- `chore:` Build process or auxiliary tool changes

### Code Style

- TypeScript for all new code
- ESLint and Prettier for formatting
- Meaningful variable and function names
- Comments for complex logic
- Component documentation with JSDoc

---

## 🚢 Deployment

### Vercel (Recommended)

1. **Connect to GitHub**
   - Import repository in Vercel Dashboard
   - Configure environment variables

2. **Add Environment Variables**
   - See `.env.example` for required variables
   - Mark sensitive variables as "Sensitive"

3. **Deploy**
   ```bash
   vercel --prod
   ```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

### Self-Hosting

Requirements:
- Node.js 18+ server
- Firebase Firestore database
- Reverse proxy (nginx/Apache)
- SSL certificate

See [DEPLOYMENT.md](DEPLOYMENT.md) for self-hosting guide.

---

## 🗺️ Roadmap

### Version 1.1 (Q1 2025)
- [ ] Multi-language support (Hindi, Spanish, French)
- [ ] Privacy policy comparison tool
- [ ] Email alerts for policy changes
- [ ] Export analysis as PDF
- [ ] Browser extension

### Version 1.2 (Q2 2025)
- [ ] Mobile app (React Native)
- [ ] Advanced filtering and search
- [ ] Privacy score trends over time
- [ ] API for third-party integration
- [ ] Collaborative annotations

### Version 2.0 (Q3 2025)
- [ ] AI-powered privacy recommendations
- [ ] Automated privacy policy generation
- [ ] Enterprise features (teams, SSO)
- [ ] Custom compliance frameworks
- [ ] White-label solution

See [Issues](https://github.com/alokemajumder/privacyhub/issues) for detailed feature requests and discussions.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

### Built With

- [Next.js](https://nextjs.org/) - React framework
- [Firebase](https://firebase.google.com/) - Cloud database
- [OpenRouter](https://openrouter.ai/) - AI API gateway
- [Firecrawl](https://firecrawl.dev/) - Web scraping
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Vercel](https://vercel.com/) - Hosting platform

### Inspired By

- [ToS;DR](https://tosdr.org/) - Terms of Service; Didn't Read
- [Privacy Guides](https://www.privacyguides.org/) - Privacy tools and services
- [GDPR.eu](https://gdpr.eu/) - GDPR compliance resources

### Contributors

Thanks to all our contributors! 🎉

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- This section is auto-generated. Please maintain this format -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

Want to be listed here? [Start contributing!](#-contributing)

---

## 📬 Contact & Support

- **Website**: [privacyhub.in](https://privacyhub.in)
- **Issues**: [GitHub Issues](https://github.com/alokemajumder/privacyhub/issues)
- **Discussions**: [GitHub Discussions](https://github.com/alokemajumder/privacyhub/discussions)
- **Twitter**: [@PrivacyHubIn](https://twitter.com/PrivacyHubIn) *(if available)*

---

## ⭐ Star History

If you find this project useful, please consider giving it a star! It helps the project grow and reach more users who care about privacy.

[![Star History Chart](https://api.star-history.com/svg?repos=alokemajumder/privacyhub&type=Date)](https://star-history.com/#alokemajumder/privacyhub&Date)

---

<div align="center">

**Made with ❤️ for privacy awareness**

[⬆ Back to Top](#-privacyhubin---privacy-policy-analyser)

</div>
