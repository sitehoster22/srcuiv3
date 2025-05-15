const TMDB_API_KEY = 'a9d2bf9eb920e7d3004d6a8a43a06596'; // Replace with your TMDB API key
let currentTmdbId = null;
let currentSeason = null;
let currentEpisode = null;
let totalEpisodes = null;

document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const query = document.getElementById('searchInput').value;
    if (query) searchMedia(query);
});

async function searchMedia(query) {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
        );
        const data = await response.json();
        displayResults(data.results);
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayResults(results) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    results.forEach(item => {
        if (item.media_type === 'movie' || item.media_type === 'tv') {
            const card = document.createElement('div');
            card.className = 'card';
            
            card.innerHTML = `
                <img src="${item.poster_path ? 
                    `https://image.tmdb.org/t/p/w500${item.poster_path}` : 
                    'https://via.placeholder.com/200x300?text=No+Image'}" 
                    alt="${item.title || item.name}">
                <div class="card-content">
                    <h3>${item.title || item.name}</h3>
                    <p>${item.overview || 'No description available'}</p>
                    <button onclick="handlePlay(${item.id}, '${item.media_type}')">Play</button>
                </div>
            `;

            resultsContainer.appendChild(card);
        }
    });
}

function handlePlay(id, mediaType) {
    document.getElementById('results').innerHTML = ''; // Clear search results
    if (mediaType === 'movie') {
        playMovie(id);
    } else if (mediaType === 'tv') {
        currentTmdbId = id;
        fetchSeasons(id);
    }
}

function playMovie(tmdbId) {
    const embedUrl = `https://movie.nightfallen.my/api/proxy?url=vidsrc.su/embed/movie/${tmdbId}`;
    document.getElementById('player').innerHTML = `
        <iframe src="${embedUrl}" allowfullscreen></iframe>
    `;
    document.getElementById('nextEpisodeButton').style.display = 'none'; // Hide next episode button for movies
}

async function fetchSeasons(tmdbId) {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/tv/${tmdbId}?api_key=${TMDB_API_KEY}`
        );
        const data = await response.json();
        showSeasonForm(tmdbId, data.seasons);
    } catch (error) {
        console.error('Error:', error);
    }
}

function showSeasonForm(tmdbId, seasons) {
    const seasonOptions = seasons.map(season => `
        <option value="${season.season_number}">Season ${season.season_number}</option>
    `).join('');

    document.getElementById('player').innerHTML = `
        <div class="season-form">
            <h3>Select Season and Episode</h3>
            <select id="seasonSelect">
                ${seasonOptions}
            </select>
            <select id="episodeSelect">
                <option value="1">Episode 1</option>
            </select>
            <button onclick="playTVShow(${tmdbId})">Play</button>
        </div>
    `;

    document.getElementById('seasonSelect').addEventListener('change', function() {
        updateEpisodes(tmdbId, this.value);
    });

    // Initialize episodes for the first season
    updateEpisodes(tmdbId, 1);
}

async function updateEpisodes(tmdbId, seasonNumber) {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/tv/${tmdbId}/season/${seasonNumber}?api_key=${TMDB_API_KEY}`
        );
        const data = await response.json();
        const episodeOptions = data.episodes.map(episode => `
            <option value="${episode.episode_number}">Episode ${episode.episode_number}</option>
        `).join('');

        document.getElementById('episodeSelect').innerHTML = episodeOptions;
    } catch (error) {
        console.error('Error:', error);
    }
}

function playTVShow(tmdbId) {
    const season = document.getElementById('seasonSelect').value;
    const episode = document.getElementById('episodeSelect').value;
    
    if (season && episode) {
        currentSeason = parseInt(season);
        currentEpisode = parseInt(episode);
        currentTmdbId = tmdbId;

        // Fetch total episodes in the season
        fetch(`https://api.themoviedb.org/3/tv/${tmdbId}/season/${season}?api_key=${TMDB_API_KEY}`)
            .then(response => response.json())
            .then(data => {
                totalEpisodes = data.episodes.length;
                updatePlayer(tmdbId, season, episode);
            })
            .catch(error => console.error('Error:', error));
    }
}

function updatePlayer(tmdbId, season, episode) {
    const embedUrl = `https://movie.nightfallen.my/api/proxy?url=vidsrc.su/embed/tv/${tmdbId}/${season}/${episode}`;
    document.getElementById('player').innerHTML = `
        <iframe src="${embedUrl}" allowfullscreen></iframe>
    `;

    // Show the "Next Episode" button if there are more episodes
    if (currentEpisode < totalEpisodes) {
        document.getElementById('nextEpisodeButton').style.display = 'block';
    } else {
        document.getElementById('nextEpisodeButton').style.display = 'none';
    }
}

function playNextEpisode() {
    if (currentTmdbId && currentSeason && currentEpisode) {
        currentEpisode += 1;
        if (currentEpisode > totalEpisodes) {
            alert('No more episodes in this season.');
            return;
        }
        updatePlayer(currentTmdbId, currentSeason, currentEpisode);
    }
}
