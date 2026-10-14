# LuNo 🐱

A personal dashboard app with a few fun little tools in one place: a cat
"brag board," a workout timer, a calorie tracker, a movie watch list, and
meal idea generator.

## Features

- **Cat Board** — show off cat cards (name, age, description, location),
  add your own, mark favorites, and filter by location.
- **Timer** — a simple workout/countdown timer.
- **Calories Tracker** — log food you've eaten per day, build a pantry of
  reusable items/ingredients, and see your daily calorie total.
- **Watch List** — browse/search movies and add them to a watch list for a
  specific day, with a mini calendar view.
- **Meal Idea** — get meal suggestions.
- **About Me** — a small bio page.

## Tech Stack

- [React](https://react.dev/) + [Vite](https://vite.dev/)
- [react-router-dom](https://reactrouter.com/) (v5) for page navigation
- [dayjs](https://day.js.org/) for dates
- [lucide-react](https://lucide.dev/) for icons
- [Express](https://expressjs.com/) backend (used by the Watch List page)

## Project Structure

```
src/
  pages/          # one folder per feature/page (BragBoard, CalTracker, WatchList, ...)
  components/     # shared UI pieces (e.g. LeftNav)
  img/, audio/    # static assets
server/
  index.js        # small Express API that proxies movie data for Watch List
```

Each page generally has:
- `PageName.jsx` — the component/UI
- `PageName.helpers.jsx` — plain functions used by the component (data updates, etc.)
- `PageName.css` — styles for that page

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the app

```bash
npm run dev
```

This starts the Vite dev server (usually at `http://localhost:5173`).

### 3. (Optional) Run the backend server

The **Watch List** page talks to a small local server that proxies the
[Watchmode](https://api.watchmode.com/) API. To use it:

1. Copy `server/.env.example` to `server/.env`.
2. Add your own Watchmode API key:
   ```
   WATCHMODE_API_KEY=your_watchmode_api_key_here
   PORT=3001
   ```
3. Start the server in a separate terminal:
   ```bash
   npm run server
   ```

Without this running, every other page still works — only Watch List's
movie browsing/search will show a "could not reach the movie server" message.

## Other Scripts

| Command           | What it does                         |
|--------------------|---------------------------------------|
| `npm run build`    | Builds the app for production         |
| `npm run preview`  | Previews the production build locally |
| `npm run lint`     | Runs Oxlint on the codebase           |

## Data Storage

There's no database — the app saves your cats, pantry items, watch list,
etc. directly in your browser's `localStorage`. Clearing your browser data
will reset everything back to the defaults.
