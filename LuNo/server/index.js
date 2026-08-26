import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3001;
const WATCHMODE_API_KEY = process.env.WATCHMODE_API_KEY;
const WATCHMODE_BASE_URL = 'https://api.watchmode.com/v1';

app.use(cors());

// Search for movies/shows by title. The Watchmode API key stays on this
// server and is never sent to the browser.
app.get('/api/search-movies', async (req, res) => {
    const query = req.query.q;

    if (!query || !query.trim()) {
        return res.status(400).json({ error: 'Missing required query parameter "q"' });
    }

    if (!WATCHMODE_API_KEY) {
        return res.status(500).json({ error: 'Server is missing WATCHMODE_API_KEY. Set it in server/.env' });
    }

    try {
        const url = `${WATCHMODE_BASE_URL}/search/?apiKey=${WATCHMODE_API_KEY}&search_field=name&search_value=${encodeURIComponent(query)}`;
        const watchmodeRes = await fetch(url);

        if (!watchmodeRes.ok) {
            return res.status(watchmodeRes.status).json({ error: 'Watchmode API request failed' });
        }

        const data = await watchmodeRes.json();
        res.json(data);
    } catch (err) {
        console.error('Watchmode search failed:', err);
        res.status(502).json({ error: 'Failed to reach Watchmode API' });
    }
});

// The full movie catalog, browsable alphabetically, 35 (7x5) titles per page.
// Watchmode sorts server-side (sort_by=title_asc) so pages tile cleanly
// through the alphabet with no client-side re-sorting needed.
const CATALOG_PAGE_SIZE = 35;

app.get('/api/movie-catalog', async (req, res) => {
    if (!WATCHMODE_API_KEY) {
        return res.status(500).json({ error: 'Server is missing WATCHMODE_API_KEY. Set it in server/.env' });
    }

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);

    try {
        const url = `${WATCHMODE_BASE_URL}/list-titles/?apiKey=${WATCHMODE_API_KEY}&types=movie&sort_by=title_asc&limit=${CATALOG_PAGE_SIZE}&page=${page}`;
        const watchmodeRes = await fetch(url);

        if (!watchmodeRes.ok) {
            return res.status(watchmodeRes.status).json({ error: 'Watchmode API request failed' });
        }

        const data = await watchmodeRes.json();
        res.json(data);
    } catch (err) {
        console.error('Watchmode catalog fetch failed:', err);
        res.status(502).json({ error: 'Failed to reach Watchmode API' });
    }
});

// Title details, used to get a poster image for a specific title. Called
// once per title and cached client-side (localStorage) to avoid re-spending
// quota on repeat views.
app.get('/api/title-details/:id', async (req, res) => {
    const { id } = req.params;

    if (!WATCHMODE_API_KEY) {
        return res.status(500).json({ error: 'Server is missing WATCHMODE_API_KEY. Set it in server/.env' });
    }

    try {
        const url = `${WATCHMODE_BASE_URL}/title/${encodeURIComponent(id)}/details/?apiKey=${WATCHMODE_API_KEY}`;
        const watchmodeRes = await fetch(url);

        if (!watchmodeRes.ok) {
            return res.status(watchmodeRes.status).json({ error: 'Watchmode API request failed' });
        }

        const data = await watchmodeRes.json();
        res.json({ id: data.id, title: data.title, poster: data.poster || null });
    } catch (err) {
        console.error('Watchmode title details fetch failed:', err);
        res.status(502).json({ error: 'Failed to reach Watchmode API' });
    }
});

app.listen(PORT, () => {
    console.log(`Watchmode proxy server running on http://localhost:${PORT}`);
});
