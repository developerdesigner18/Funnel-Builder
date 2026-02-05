# Visual Funnel Builder

A powerful, drag-and-drop visual editor for designing and optimizing sales funnels. Built with Next.js, React Flow, and Supabase, this application provides an intuitive interface for marketers and developers to create complex funnel flows without writing code.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-3.4-38bdf8)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e)

## 🚀 Features

- **Visual Drag & Drop Canvas**: Intuitive interface powered by React Flow for arranging funnel steps with smooth drag feedback and precise placement.
- **Smart Validation System**: Real-time "soft" validation that guides you toward building logical funnel paths:
  - **Sales Page Logic**: Enforces exactly one primary outgoing path to ensure a clear starting journey.
  - **Thank You Protection**: Prevents invalid outgoing connections from the final funnel step.
  - **Orphan Detection**: Automatically identifies disconnected nodes with visual warnings and tooltips.
- **Intelligent Persistence**:
  - **Auto-Save**: Debounced background syncing (3s) ensures your work is always safe in Supabase.
  - **Undo/Redo**: Full history stack to experiment freely with layout and properties.
  - **Manual Commit**: One-click save for immediate synchronization.
- **Data Portability**:
  - **JSON Export**: Download your entire funnel architecture as a portable JSON file.
  - **JSON Import**: Restore exact funnel states from file with automatic validation and sync.
- **Sequential Auto-Naming**: Smart labeling for "Upsell" and "Downsell" nodes that increments automatically (e.g., Upsell 1, Upsell 2).
- **Refined UI/UX**: Premium styling with Tailwind CSS, animated connections, and a responsive properties editor.

## ⌨️ Accessibility & Shortcuts

The editor is built with a focus on inclusion and speed:
- **Keyboard Navigation**: Full `Tab` order support for all header controls, sidebar templates, and canvas nodes.
- **Visual Focus**: High-contrast, theme-aware focus rings for all interactive elements.
- **Keyboard Shortcuts**:
  - `Ctrl + S`: Save funnel instantly.
  - `Ctrl + Z` / `Ctrl + Y`: Undo and Redo changes.
  - `Ctrl + D`: Duplicate the currently selected node.
  - `Delete` / `Backspace`: Remove the focused node or edge.
  - `?`: Open the interactive keyboard shortcuts help dialog.
  - `Esc`: Close the properties sidebar or help modal.
- **Screen Reader Support**: Semantic HTML, ARIA labels, and descriptive roles for all non-textual elements.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) (based on Radix UI)
- **Diagramming**: [React Flow 11](https://reactflow.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Storage & Auth**: [Supabase](https://supabase.com/) (PostgreSQL + RLS)

## 🏗️ Architectural Decisions

### 1. Why Supabase?
Supabase was chosen as the backend-as-a-service (BaaS) for several key reasons:
- **Instant Persistence**: Its real-time capabilities allow for seamless auto-saving (implemented via debounced hooks).
- **Relational Integrity**: Managing nodes and edges requires a relational structure (PostgreSQL) to ensure that deleting a funnel correctly cascades to its associated nodes and edges.
- **Row Level Security (RLS)**: Provides a production-ready security layer out of the box, allowing us to define fine-grained access policies directly in SQL.

### 2. State Management Strategy
The application uses a **hybrid state management** approach:
- **React Flow Internal State**: Handles high-frequency visual updates (dragging, zooming) for maximum performance.
- **Custom React Hooks (`useUndoRedo`, `useFunnelStorage`)**: Manage the "source of truth" and persistent history. By decoupling high-frequency dragging from the history stack, we avoid performance bottlenecks and ensure that only meaningful changes (interaction-end) are recorded in the undo/redo stack.

### 3. "Soft" Validation vs. "Hard" Constraints
We implemented a "Soft Validation" system. Instead of blocking the user from creating "broken" funnels (which can be frustrating during the creative phase), we provide real-time visual warnings (orange borders, tooltips) on invalid nodes. This balance preserves user flow while ensuring the final output is logical.

## ⚖️ Tradeoffs & Considerations

### What was prioritized:
- **Performance**: Heavy use of `React.memo` and decoupled history updates to ensure zero lag even with 50+ nodes.
- **Developer Experience**: A robust SQL setup script and clear directory structure for easy extension.
- **Accessibility**: Reaching WCAG standards for keyboard and screen-reader users was a non-negotiable requirement.

### What was skipped (and why):
- **Complex Edge Logic (e.g., Cyclical detection)**: While we prevent self-connections, we allowed generalized loops. In advanced marketing funnels, users sometimes create circular re-engagement paths.
- **Collaborative Editing (CRDTs)**: While Supabase supports real-time, we focused on a robust single-editor experience first to ensure state stability before introducing multi-user conflict resolution.

## 📦 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18.0.0 or higher)
- npm or pnpm
- A Supabase account (for database)

## ⚡ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/developerdesigner18/Funnel-Builder.git
cd funnel-builder-ui
```

### 2. Install Dependencies

```bash
npm install --legacy-peer-deps
# or
pnpm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
DATABASE_URL=your_postgresql_connection_string
```

### 4. Database Setup

You need to initialize the database tables and security policies. You can do this by running the provided SQL script in your Supabase SQL Editor.

The script is located at: `scripts/setup-funnels.sql`

This script will:
1. Create the `funnels`, `funnel_nodes`, and `funnel_edges` tables.
2. Enable **Row Level Security (RLS)**.
3. Establish public access policies (to be customized for production auth).

### 5. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

```
funnel-builder-ui/
├── app/                    # Next.js App Router (Pages & API)
├── components/             # UI Components
│   ├── nodes/              # Custom React Flow Node Definitions
│   ├── funnel-canvas.tsx   # Core Editor Interface
│   └── properties-editor.tsx # Configuration Sidebar
├── hooks/                  # Logic for Persistence, Undo/Redo, and Validation
├── lib/                    # Supabase Client & Utilities
├── scripts/                # Database Migrations & SQL Setup
└── styles/                 # Tailwind Config & Global CSS
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
