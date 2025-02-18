const API_KEY = 'YOUR_TMDB_API_KEY'; // Replace this with your TMDB API key

async function search() {
    const query = document.getElementById('searchInput').value;
    const resultsDiv = document.getElementById('results');
    
    if (!query) {
        resultsDiv.innerHTML = '<p>Please enter a search query.</p>';
        return;
    }

    const response = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${query}`);
    const data = await response.json();

    if (data.results.length === 0) {
        resultsDiv.innerHTML = '<p>No results found.</p>';
        return;
    }

    resultsDiv.innerHTML = ''; // Clear previous results

    data.results.forEach(item => {
        const title = item.title || item.name;
        const tmdb_id = item.id;
        const type = item.media_type;

        const resultDiv = document.createElement('div');
        resultDiv.className = 'result-item';
        resultDiv.
        result
innerHTML = `
            <h3>${title}</h3>
            <button onclick="play('${type}', ${tmdb_id})">Play</button>
        `;
        resultsDiv.appendChild(resultDiv);
    });
}

function play(type, id) {
    // Function to handle playing the selected movie or show
    console.log(`Playing ${type} with ID ${id}`);
}
