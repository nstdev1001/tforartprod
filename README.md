# TFORART Media Company Website

![tforart-main](https://github.com/user-attachments/assets/1bef90cd-1ea4-4d0d-adb6-90d1379169ac)

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.13-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-11.0.1-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)

> Official website for **TFORART** - a professional media and communications company based in Vietnam.

---

## 📖 Introduction

The TFORART website is designed to showcase the company's information, business activities, display our portfolio, and create a channel for potential collaboration with clients. This project is built with modern frontend technology combined with cloud-based backend solutions.

---

## 🚀 Technologies Used

### Frontend

| Technology               | Version | Description                             |
| ------------------------ | ------- | --------------------------------------- |
| **React**                | 18.3.1  | UI library for building user interfaces |
| **TypeScript**           | 5.5.3   | Type-safe JavaScript superset           |
| **Vite**                 | 5.4.8   | Fast development and build tool         |
| **React Router DOM**     | 6.30.0  | Client-side routing                     |
| **Tailwind CSS**         | 3.4.13  | Utility-first CSS framework             |
| **Framer Motion**        | 12.5.0  | Animation library                       |
| **Tanstack React Query** | 5.59.20 | Data fetching & state management        |
| **React Hook Form**      | 7.53.1  | Form handling with Zod validation       |

### UI Components & Libraries

- **Radix UI** - Accessible component primitives (Dialog, Tabs, Popover, Select, etc.)
- **Shadcn UI** - Re-usable component library
- **Embla Carousel** - Carousel/slider component
- **DND Kit** - Drag-and-drop functionality
- **Lucide React** - Icon library
- **React Hot Toast** - Toast notifications
- **NProgress** - Page loading progress bar
- **React Type Animation** - Typing animation effects
- **React Markdown** - Markdown rendering support

### Backend & Services

| Service      | Version | Purpose                                           |
| ------------ | ------- | ------------------------------------------------- |
| **Firebase** | 11.0.1  | Authentication, Firestore Database, Cloud Storage |
| **EmailJS**  | 3.2.0   | Contact form email handling                       |

### Development Tools

- **ESLint v9** with React plugins for code quality
- **TypeScript v5** for type safety
- **Autoprefixer & PostCSS** for CSS processing
- **Prettier** for code formatting

---

## ✨ Key Features

### 🏠 Public Pages

| Page               | Route             | Description                                     |
| ------------------ | ----------------- | ----------------------------------------------- |
| **Home**           | `/`               | Landing page with company introduction          |
| **About Us**       | `/about-us`       | Company history, vision, and team profiles      |
| **Services**       | `/services`       | Media and communication services offered        |
| **Portfolio**      | `/portfolio`      | Showcase of videos, photos, and graphic designs |
| **Contact**        | `/contact`        | Contact form with EmailJS integration           |
| **Company Info**   | `/company-info`   | Official company information                    |
| **FAQ**            | `/support/faq`    | Frequently asked questions                      |
| **Privacy Policy** | `/privacy-policy` | Privacy policy page                             |

### 🎨 Portfolio Section

- **Videos** (`/portfolio/videos`) - Video production showcase
- **Photos** (`/portfolio/photos`) - Photography albums with gallery view
- **Graphics** (`/portfolio/graphics`) - Graphic design projects

### 🔐 Authentication & Admin

- **Login** (`/login`) - Firebase authentication
- **Admin Panel** - Content management for authorized users
- **Drag & Drop** - Intuitive image/content reordering

### 🛠️ Technical Features

- ⚡ **Fast Performance** - Vite-powered development and optimized builds
- 📱 **Responsive Design** - Mobile-first, fully responsive layout
- 🎭 **Smooth Animations** - Framer Motion powered transitions
- 🖼️ **Image Optimization** - Automatic compression with browser-image-compression
- 🌤️ **Weather Widget** - Integrated weather information (`/support/weather`)
- 🤖 **AI Chatbot** - AI-powered assistant (`/ai-chatbot`)
- 🛡️ **Error Boundary** - Graceful error handling
- 🔧 **Maintenance Mode** - Built-in maintenance page toggle

---

## 📦 Installation

### Prerequisites

- **Node.js** v18.0.0 or higher (LTS recommended)
- **npm** v9+ or **yarn** v1.22+
- **Git** for version control

### Quick Start

1. **Clone the repository**

```bash
git clone https://github.com/your-username/tforart-website.git
cd tforart-website
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Configure environment variables**

Create a `.env` file in the root directory:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_USER_ID=your_user_id
```

4. **Start development server**

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Available Scripts

| Command            | Description                                          |
| ------------------ | ---------------------------------------------------- |
| `npm run dev`      | Start development server with HMR                    |
| `npm run build`    | Build for production (TypeScript check + Vite build) |
| `npm run preview`  | Preview production build locally                     |
| `npm run lint`     | Run ESLint for code quality check                    |
| `npm run lint:fix` | Auto-fix ESLint issues                               |

---

## 📁 Project Structure

```
tforart-dev/
├── public/                     # Static assets
│   ├── graphics/               # Graphic design assets
│   ├── image-test/             # Test images
│   ├── logobrand/              # Brand logos
│   ├── Profile_TFORART_design/ # Profile design assets
│   └── weather-icon/           # Weather icons
│
├── src/
│   ├── components/             # Reusable components
│   │   ├── ui/                 # Shadcn UI components
│   │   │   ├── button.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── form.tsx
│   │   │   └── ...
│   │   ├── Admin/              # Admin-specific components
│   │   ├── ErrorBoundary/      # Error handling component
│   │   ├── Footer/             # Site footer
│   │   ├── Layout/             # Page layout wrapper
│   │   ├── Loading/            # Loading indicators
│   │   ├── Navbar/             # Navigation bar
│   │   ├── NoData/             # Empty state component
│   │   └── NotFound/           # 404 page
│   │
│   ├── config/                 # App configurations
│   │   ├── loadingBar_config.tsx
│   │   ├── motion_config.ts    # Framer Motion presets
│   │   ├── navbar_config.tsx   # Navigation configuration
│   │   ├── route_config.tsx    # React Router configuration
│   │   └── toaster_config.tsx  # Toast notifications config
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAuth.ts          # Authentication hook
│   │   ├── useControlAlbum.ts  # Album CRUD operations
│   │   ├── useControlEmail.ts  # Email handling
│   │   ├── useControlGraphicProject.ts
│   │   ├── useControlVideo.ts  # Video CRUD operations
│   │   ├── useFullScreenGallery.ts
│   │   └── useSelectImages.ts  # Image selection logic
│   │
│   ├── lib/                    # Utility functions
│   │   └── utils.ts            # Common utilities (cn, etc.)
│   │
│   ├── pages/                  # Page components
│   │   ├── AboutUs/            # About page
│   │   ├── AIchatbot/          # AI chatbot page
│   │   ├── CompanyInfo/        # Company information
│   │   ├── CompanyServices/    # Services page
│   │   ├── Contact/            # Contact form page
│   │   ├── DeveloperInfo/      # Developer credits
│   │   ├── FAQ/                # FAQ page
│   │   ├── Home/               # Landing page
│   │   ├── Login/              # Authentication page
│   │   ├── Portfolio/          # Portfolio pages
│   │   ├── PrivacyPolicy/      # Privacy policy
│   │   └── Weather/            # Weather widget page
│   │
│   ├── schema/                 # Zod validation schemas
│   │   ├── albumSchema.ts
│   │   ├── emailSchema.ts
│   │   ├── graphicProjectSchema.ts
│   │   ├── loginSchema.ts
│   │   └── videoSchema.ts
│   │
│   ├── services/               # External service configs
│   │   ├── emailJsConfig.ts    # EmailJS setup
│   │   └── firebaseConfig.ts   # Firebase initialization
│   │
│   ├── types/                  # TypeScript type definitions
│   │   ├── albumDataType.d.ts
│   │   ├── graphicDataType.d.ts
│   │   ├── videoDataType.d.ts
│   │   └── weatherDataType.d.ts
│   │
│   ├── App.tsx                 # Main application component
│   ├── index.css               # Global styles
│   └── main.tsx                # Application entry point
│
├── .env                        # Environment variables (not in git)
├── .gitignore
├── components.json             # Shadcn UI configuration
├── eslint.config.js            # ESLint configuration
├── firebase.json               # Firebase hosting config
├── index.html                  # HTML entry point
├── package.json
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── vercel.json                 # Vercel deployment config
└── vite.config.ts              # Vite configuration
```

---

## 🚀 Deployment

### Firebase Hosting (Recommended)

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Build the application
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

### Vercel

1. Import your GitHub repository to [Vercel](https://vercel.com)
2. Configure environment variables in project settings
3. Vercel will auto-detect Vite and configure:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Deploy automatically on push

### Manual Deployment

```bash
# Build for production
npm run build

# The 'dist' folder contains the production-ready files
# Upload to any static hosting service
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit** your changes
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push** to the branch
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open** a Pull Request

### Code Style Guidelines

- Follow TypeScript best practices
- Use ESLint and Prettier for formatting
- Write meaningful commit messages
- Add comments for complex logic

---

## 📄 License

This project is distributed under the **MIT License**. See the [LICENSE](LICENSE) file for more information.

---

## 📞 Contact

**TFORART COMPANY LIMITED**

- 📧 Email: [tforartprod@gmail.com](mailto:tforartprod@gmail.com)
- 🌐 Website: [https://tforart.vn](https://tforart.vn)
- 👨‍💻 Developer: [Nguyen Tung](https://www.facebook.com/nguyen.tung.1001/)

---

<p align="center">
  Made with ❤️ by <strong>TFORART Team</strong>
</p>
