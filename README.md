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

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) (based on Radix UI)
- **Diagramming**: [React Flow](https://reactflow.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)

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

You need to initialize the database tables. You can do this by running the provided SQL script in your Supabase SQL Editor.

The script is located at: `scripts/setup-funnels.sql`

Alternatively, if you have the Supabase CLI configured strings, you can run the migration script:

```bash
npm run migrate
```

### 5. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

```
funnel-builder-ui/
├── app/                    # Next.js App Router pages and API routes
│   ├── api/                # Backend API endpoints (funnels, nodes, edges)
│   ├── funnels/            # Funnel management and editor pages
│   └── page.tsx            # Landing page
├── components/             # React components
│   ├── nodes/              # Custom React Flow nodes (Upsell, Product, etc.)
│   ├── ui/                 # Reusable UI components (Shadcn)
│   ├── funnel-canvas.tsx   # Main editor canvas
│   └── properties-editor.tsx # Node configuration sidebar
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities and clients (Supabase)
├── public/                 # Static assets
├── scripts/                # Database setup and migration scripts
└── styles/                 # Global styles
```

## 🗄️ Database Schema

The project uses a relational schema to store funnel data:
- **funnels**: Stores metadata about each funnel (name, description).
- **funnel_nodes**: Stores individual nodes (type, position, data) linked to a funnel.
- **funnel_edges**: Stores connections between nodes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
