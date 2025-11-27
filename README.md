<div align="center">
  <h1 align="center">BLACKSMITH</h1>
  <h3 align="center">Premium Workout Logger & Progress Tracker</h3>
</div>

<br/>

Blacksmith is a modern, high-performance workout logger designed to help you track your fitness journey with style and precision. Built with a focus on aesthetics and user experience, it offers a seamless way to log workouts, visualize progress, and manage multiple athlete profiles.

## Features

- **🏋️‍♂️ Workout Logging**: Easily log exercises with sets, reps, and weight. Support for custom exercises.
- **📊 Dashboard**: Get a high-level overview of your activity, including total volume lifted and weekly workout counts.
- **🔥 Muscle Heatmap**: Visual representation of the muscle groups you've targeted.
- **� Advanced Analytics**: Visualize progress with Volume, Max Weight, Estimated 1RM, and Frequency charts.
- **🆚 Session Comparison**: Compare your performance against previous sessions for specific muscle groups or exercises.
- **📅 History**: Review past workouts, edit logs, and delete entries.
- **👥 Multi-User Support**: Create and switch between multiple athlete profiles.
- **☁️ Cloud Sync**: Optional integration with Supabase to sync data across devices.
- **📱 Responsive Design**: Works great on both desktop and mobile.

## Tech Stack

- **Frontend**: [React](https://react.dev/) with [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Routing**: [React Router](https://reactrouter.com/)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1.  Clone the repository (if applicable) or download the source code.
2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Start the development server:

    ```bash
    npm run dev
    ```

4.  Open your browser and navigate to the local URL provided (usually `http://localhost:5173` or `http://localhost:3000`).

## Configuration

### Cloud Sync (Optional)

To enable cloud sync, you need a Supabase project.

1.  Create a project on [Supabase](https://supabase.com/).
2.  Run the following SQL in your Supabase SQL Editor to create the necessary table:

    ```sql
    create table app_data ( key text primary key, value jsonb );
    ```

3.  Create a `.env` file in the root directory (copy from `.env.example` if available).
4.  Add your Supabase credentials:

    ```env
    VITE_SUPABASE_URL=your_project_url
    VITE_SUPABASE_KEY=your_anon_key
    ```

5.  Restart the development server. The cloud icon in the header will turn green if connected.
