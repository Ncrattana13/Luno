import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import catImage from '../../img/cat-nobg.png';
import catClock from '../../img/cat-clock.png';
import catBrag from '../../img/cat-brag.png';
import catWorkout from '../../img/workout.png';
import catRecipe from '../../img/cat-recipe.png';
import { useHistory } from "react-router-dom";
import LeftNav from "../../components/LeftNav";
import MiniCalendar from "./MiniCalendar";
import "./WatchList.css";

const API_BASE_URL = "http://localhost:3001";

const CATALOG_CACHE_KEY = "movieCatalogCacheV2"; // v2: page size 25 -> 35
const CATALOG_CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours
const POSTER_CACHE_KEY = "posterCache";

// search endpoint caps results, no pagination
const SEARCH_RESULT_CAP = 35;

function WatchList(){
    const history = useHistory();
    const [selectedDate, setSelectedDate] = useState(dayjs());

    const [watchList, setWatchList] = useState(() => {
        const saved = localStorage.getItem("watchList");
        if (!saved || saved === "undefined") return [];
        return JSON.parse(saved);
    });

    useEffect(() => {
        localStorage.setItem("watchList", JSON.stringify(watchList));
    }, [watchList]);

    // browse catalog, paged 25 at a time, cached per page
    const [catalog, setCatalog] = useState([]);
    const [catalogPage, setCatalogPage] = useState(1);
    const [totalPages, setTotalPages] = useState(null);
    const [catalogLoading, setCatalogLoading] = useState(true);
    const [catalogError, setCatalogError] = useState(null);

    useEffect(() => {
        setCatalogLoading(true);
        setCatalogError(null);

        const allCached = JSON.parse(localStorage.getItem(CATALOG_CACHE_KEY) || '{}');
        const cached = allCached[catalogPage];
        if (cached && Date.now() - cached.fetchedAt < CATALOG_CACHE_TTL_MS) {
            setCatalog(cached.titles);
            setTotalPages(cached.totalPages);
            setCatalogLoading(false);
            return;
        }

        // abort if page changes again before this resolves
        const controller = new AbortController();

        fetch(`${API_BASE_URL}/api/movie-catalog?page=${catalogPage}`, { signal: controller.signal })
            .then((res) => {
                if (!res.ok) throw new Error('Catalog request failed');
                return res.json();
            })
            .then((data) => {
                const titles = data.titles || [];
                setCatalog(titles);
                setTotalPages(data.total_pages || null);

                const nextCache = JSON.parse(localStorage.getItem(CATALOG_CACHE_KEY) || '{}');
                nextCache[catalogPage] = { fetchedAt: Date.now(), titles, totalPages: data.total_pages || null };
                localStorage.setItem(CATALOG_CACHE_KEY, JSON.stringify(nextCache));
            })
            .catch((err) => {
                if (err.name === 'AbortError') return;
                console.error('Movie catalog fetch failed:', err);
                setCatalogError('Could not reach the movie server. Is it running? (npm run server)');
            })
            .finally(() => setCatalogLoading(false));

        return () => controller.abort();
    }, [catalogPage]);

    // debounced full-catalog search, replaces browse view while active
    const [filterQuery, setFilterQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [searchError, setSearchError] = useState(null);
    const searchCache = useRef(new Map());

    useEffect(() => {
        const q = filterQuery.trim();

        if (!q) {
            setSearchResults([]);
            setSearchError(null);
            setSearching(false);
            return;
        }

        const cached = searchCache.current.get(q.toLowerCase());
        if (cached) {
            setSearchResults(cached);
            setSearchError(null);
            setSearching(false);
            return;
        }

        setSearching(true);
        setSearchError(null);

        const controller = new AbortController();
        const debounce = setTimeout(() => {
            fetch(`${API_BASE_URL}/api/search-movies?q=${encodeURIComponent(q)}`, { signal: controller.signal })
                .then((res) => {
                    if (!res.ok) throw new Error('Search failed');
                    return res.json();
                })
                .then((data) => {
                    // normalize to same shape as catalog items
                    const results = (data.title_results || []).map((r) => ({
                        id: r.id,
                        title: r.name,
                        year: r.year,
                        type: r.type,
                    }));
                    searchCache.current.set(q.toLowerCase(), results);
                    setSearchResults(results);
                })
                .catch((err) => {
                    if (err.name === 'AbortError') return;
                    console.error('Movie search failed:', err);
                    setSearchError('Could not reach the movie search server. Is it running? (npm run server)');
                    setSearchResults([]);
                })
                .finally(() => setSearching(false));
        }, 450);

        return () => {
            clearTimeout(debounce);
            controller.abort();
        };
    }, [filterQuery]);

    const isSearching = filterQuery.trim().length > 0;
    const visibleItems = isSearching ? searchResults : catalog;

    // poster cache, fetched lazily per title, kept forever
    const [posterCache, setPosterCache] = useState(() => {
        const saved = localStorage.getItem(POSTER_CACHE_KEY);
        return saved ? JSON.parse(saved) : {};
    });
    const fetchedPosterIds = useRef(new Set());

    // mirrors posterCache so the effect below reads the latest without re-running
    const posterCacheRef = useRef(posterCache);
    useEffect(() => {
        posterCacheRef.current = posterCache;
        localStorage.setItem(POSTER_CACHE_KEY, JSON.stringify(posterCache));
    }, [posterCache]);

    useEffect(() => {
        // abort when visible set changes so old requests don't pile up
        const controller = new AbortController();

        visibleItems.forEach((item) => {
            if (item.id in posterCacheRef.current) return;
            if (fetchedPosterIds.current.has(item.id)) return;
            fetchedPosterIds.current.add(item.id);

            fetch(`${API_BASE_URL}/api/title-details/${item.id}`, { signal: controller.signal })
                .then((res) => (res.ok ? res.json() : null))
                .then((data) => {
                    setPosterCache((prev) => ({ ...prev, [item.id]: data?.poster || null }));
                })
                .catch((err) => {
                    if (err.name === 'AbortError') {
                        // let a later revisit retry
                        fetchedPosterIds.current.delete(item.id);
                        return;
                    }
                    setPosterCache((prev) => ({ ...prev, [item.id]: null }));
                });
        });

        return () => controller.abort();
    }, [visibleItems]);

    const addToWatchList = (item) => {
        const newEntry = {
            id: crypto.randomUUID(),
            watchmodeId: item.id,
            title: item.title,
            year: item.year,
            type: item.type,
            poster: posterCache[item.id] || null,
            date: selectedDate.format("ddd, MM/DD/YYYY"),
            watched: false,
            timeStamp: Date.now(),
        };
        setWatchList([...watchList, newEntry]);
    };

    const toggleWatched = (id) => {
        setWatchList(watchList.map((item) =>
            item.id === id ? { ...item, watched: !item.watched } : item
        ));
    };

    const removeFromList = (id) => {
        setWatchList(watchList.filter((item) => item.id !== id));
    };

    const todaysWatchList = watchList.filter(
        (item) => item.date === selectedDate.format("ddd, MM/DD/YYYY")
    );

    const goToPage = (page) => {
        const clamped = Math.max(1, totalPages ? Math.min(page, totalPages) : page);
        setFilterQuery('');
        setCatalogPage(clamped);
    };

    const isFirstPage = catalogPage <= 1;
    const isLastPage = totalPages != null && catalogPage >= totalPages;
    const skipAheadPage = totalPages ? Math.min(catalogPage + 5, totalPages) : catalogPage + 5;
    const canSkipAhead = skipAheadPage > catalogPage && (!totalPages || catalogPage + 5 <= totalPages);

    return (
        <>
            <LeftNav
                icon={catImage}
                buttons={[
                    { label: "Timer", icon: catClock, onClick: () => history.push("/test-timer") },
                    { label: "Board", icon: catBrag, onClick: () => history.push("/brag-board") },
                    { label: "Calories Tracker", icon: catWorkout, onClick: () => history.push("/cal-tracker") },
                    { label: "Watch List", icon: catImage, selected: true },
                    { label: "Meal Idea", icon: catRecipe, onClick: () => history.push("/meal-idea") },
                ]}
            />

            <div className='right-container'>
                <div className="watch-list-date-row">
                    <div className="watch-list-date-left">
                        <h2>Date: {selectedDate.format("ddd, MMM DD YYYY")}</h2>
                        <div className='right-container-header'>
                            <input
                                type="date"
                                value={selectedDate.format("YYYY-MM-DD")}
                                onChange={(e) => setSelectedDate(dayjs(e.target.value))}
                            />
                        </div>

                        <div className="watch-list-day-nav">
                            <button onClick={() => setSelectedDate(selectedDate.subtract(1, "day"))}> ◀ </button>

                            <div className="watch-list-container">
                                {todaysWatchList.length === 0 && <p>Nothing for this day yet.</p>}
                                {todaysWatchList.map((item) => (
                                    <div key={item.id} className="watch-list-item">
                                        {item.poster && <img src={item.poster} alt="" className="watch-list-item-poster" />}
                                        <input
                                            type="checkbox"
                                            checked={item.watched}
                                            onChange={() => toggleWatched(item.id)}
                                        />
                                        <span className={item.watched ? "watched" : ""}>
                                            {item.title}{item.year ? ` (${item.year})` : ''}
                                        </span>
                                        <button onClick={() => removeFromList(item.id)}>x</button>
                                    </div>
                                ))}
                            </div>

                            <button onClick={() => setSelectedDate(selectedDate.add(1, "day"))}> ▶ </button>
                        </div>
                    </div>

                    <MiniCalendar
                        selectedDate={selectedDate}
                        onChangeDate={setSelectedDate}
                        watchList={watchList}
                    />
                </div>

                <div className='right-container-bottom'>
                    <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
                        <h3>{isSearching ? `Search results for "${filterQuery}"` : 'Browse movies (A-Z)'}</h3>
                        <input
                            className="watch-list-filter"
                            value={filterQuery}
                            onChange={(e) => setFilterQuery(e.target.value)}
                            placeholder="Search all movies..."
                        />

                        {isSearching ? (
                            <>
                                {searching && <p>Searching...</p>}
                                {searchError && <p className="watch-list-error">{searchError}</p>}
                                {!searching && !searchError && searchResults.length === 0 && (
                                    <p>No titles match "{filterQuery}".</p>
                                )}
                                {!searching && !searchError && searchResults.length >= SEARCH_RESULT_CAP && (
                                    <p className="watch-list-hint">
                                        Showing the top {SEARCH_RESULT_CAP} results -- there may be more.
                                        Try a more specific search to narrow it down (Watchmode's search
                                        doesn't support paging further than this).
                                    </p>
                                )}
                            </>
                        ) : (
                            <>
                                {catalogLoading && <p>Loading movies...</p>}
                                {catalogError && <p className="watch-list-error">{catalogError}</p>}
                            </>
                        )}

                        <div className="watch-list-catalog">
                            {visibleItems.map((item) => (
                                <button
                                    key={item.id}
                                    className="watch-list-catalog-card"
                                    onClick={() => addToWatchList(item)}
                                    title={`Add ${item.title} to ${selectedDate.format("ddd, MMM DD")}`}
                                >
                                    {posterCache[item.id]
                                    ? <img src={posterCache[item.id]} alt="" className="watch-list-catalog-poster" />
                                    : <div className="watch-list-catalog-poster watch-list-catalog-poster-empty" />
                                    }
                                    <span>{item.title}{item.year ? ` (${item.year})` : ''}</span>
                                </button>
                            ))}
                        </div>

                        {!isSearching && (
                            <div className="watch-list-pagination">
                                <button disabled={isFirstPage || catalogLoading} onClick={() => goToPage(1)}>
                                    ◀◀
                                </button>
                                <button disabled={isFirstPage || catalogLoading} onClick={() => goToPage(catalogPage - 1)}>
                                    ◀ Prev
                                </button>

                                <span className="watch-list-page-current">
                                    {catalogPage}{totalPages ? ` / ${totalPages.toLocaleString()}` : ''}
                                </span>

                                {canSkipAhead && (
                                    <>
                                    <span>...</span>
                                    <button disabled={catalogLoading} onClick={() => goToPage(skipAheadPage)}>
                                        {skipAheadPage}
                                    </button>
                                    </>
                                )}

                                <button disabled={isLastPage || catalogLoading} onClick={() => goToPage(catalogPage + 1)}>
                                    Next ▶
                                </button>
                                <button
                                    disabled={isLastPage || catalogLoading || !totalPages}
                                    onClick={() => goToPage(totalPages)}
                                >
                                    ▶▶
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default WatchList
