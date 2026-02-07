# TerraSight 🌍🛰️

<img width="1460" height="720" alt="TerraSight Dashboard" src="https://github.com/user-attachments/assets/719d0203-f1c8-4e1c-8080-0d31c8cf33d5" />


**TerraSight** is a cutting-edge visualization platform that turns space data into ground-level decisions. It provides an immersive 3D experience to monitor, analyze, and govern satellite data through an automated end-to-end pipeline—from acquisition to blockchain-verified accountability.

## 🚀 Overview

TerraSight leverages the power of 3D graphics and modern web technologies to visualize complex geospatial data pipelines. It features a futuristic Head-Up Display (HUD) interface, interactive maps, and real-time system monitoring, making it an ideal tool for looking at satellite data ingestion, processing, and output.

## ✨ Key Features

- **3D Immersive Environment**: Built with **Three.js** and **React Three Fiber**, offering a stunning 3D scene that reacts to user interactions and scrolling.
- **Real-Time Satellite Fusion**:
  - **Multi-Source Ingest**: Integreted with **Sentinel Hub (Sentinel-1 SAR + Optical)** for real-time earth observation.
  - **Fusion Engine**: Client-side neuro-symbolic logic to fuse spectral data (ported to `src/lib/engine`).
  - **Live Scanning**: Simulates sector scans with auto-detection logic.
- **Automated Legal Compliance**:
  - **Smart Governance**: Automatically maps detected violations to specific laws (e.g., Environmental Protection Act).
  - **Instant Legal Notices**: Generates official PDF notices with **Satyamev Jayate** watermark, case details, and blockchain hash.
  - **Evidence Locking**: Simulates blockchain immutability for digital evidence.
- **Interactive Dashboard**:
  - **Mission Control HUD**: Sleek, sci-fi inspired interface with absolute positioning overlays.
  - **Live Map**: Real-time visualization of geospatial alerts and zones.
  - **Compliance Dossier**: Detailed view of specific violations with action buttons.
- **Modern UI/UX**: Smooth animations using **Framer Motion** and **GSAP**, with a custom "Glassmorphism" and "Neon" design system.

## 🛠️ Technology Stack

### Core Framework
- **Frontend**: [React v19](https://react.dev/) (Latest Features)
- **Build System**: [Vite](https://vitejs.dev/) (Ultra-fast HMR)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Type Safety)

### Geospatial & Visualization
- **3D Engine**: [Three.js](https://threejs.org/) & [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- **Map Rendering**: [MapLibre GL](https://maplibre.org/) & [React Map GL](https://visgl.github.io/react-map-gl/)
- **Data Layers**: [Deck.gl](https://deck.gl/) (High-performance large dataset visualization)
- **Spatial Analysis**: [Turf.js](https://turfjs.org/) (Client-side geospatial engine)
- **Satellite Data**: [Sentinel Hub API](https://www.sentinel-hub.com/) (SAR + Optical Imagery)

### State & Logic
- **Real-Time Database**: [Supabase](https://supabase.com/) (PostgreSQL + Realtime Subscriptions)
- **Blockchain Simulation**: [Ethers.js](https://docs.ethers.org/) (Cryptographic hashing & immutability logs)
- **PDF Generation**: [pdf-lib](https://pdf-lib.js.org/) (Client-side legal notice generation)

### UI & Aesthetics
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (Utility-first design)
- **Animations**: 
  - [Framer Motion](https://www.framer.com/motion/) (Layout transitions)
  - [GSAP](https://greensock.com/gsap) (High-performance sequencing)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Utilities**: `clcx`, `tailwind-merge`, `date-fns`

## 📦 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/TerraSight.git
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory and add the following keys:
    ```bash
    VITE_MAPTILER_KEY=your_maptiler_key
    VITE_SENTINEL_CLIENT_ID=your_sentinel_client_id
    VITE_SENTINEL_CLIENT_SECRET=your_sentinel_client_secret
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_key
    ```
    *Note: Sentinel Hub API requests are proxied via Vite configuration to avoid CORS issues.*

### Running the App

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### Building for Production

To build the app for production:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## 📂 Project Structure

```bash
TerraSight/
├── public/              # Static assets
├── src/
│   ├── components/      # React components (3D Scene, Overlay, HUD, etc.)
│   ├── pages/           # Application pages (Dashboard, Alerts, Maps, etc.)
│   ├── layouts/         # Layout components
│   ├── context/         # React Context (Auth, Theme, MissionContext)
│   ├── lib/             # Core Logic (The Brain)
│   │   ├── engine/      # Ported Backend Logic (Fusion, Orchestrator)
│   │   ├── governance/  # PDF Generation (FIR, Legal Notices)
│   │   └── supabase/    # Database Client
│   ├── hooks/           # Custom Hooks (useRealtimeAlerts, etc.)
│   ├── services/        # API services
│   ├── App.tsx          # Main application component
│   └── index.css        # Global styles (Tailwind imports)
├── index.html           # HTML template
├── package.json         # Project dependencies and scripts
└── vite.config.ts       # Vite configuration (includes Proxy)
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the project.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.


## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Made with ❤️ by the TerraSight Team*
