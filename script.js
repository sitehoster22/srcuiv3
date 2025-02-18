const API_KEY = 'a9d2bf9eb920e7d3004d6a8a43a06596';
const vidsrcBaseURL = 'https://vidsrc.su/embed';

document.getElementById('searchBtn').addEventListener('click', async () => {
    const query = document.getElementById('search').value;
    
   
const resultsDiv = document.getElementById('results');
    resultsDiv.
    resultsDi
innerHTML = ''; // Clear any previous results

    if (!query) return;

    // Fetch movies and shows from TMDB
    const response = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${query}`);
    
 
const data = await response.json();

    if (data.results.length === 0) {
        resultsDiv.
        resul
innerHTML = '<p>No results found.</p>';
        
        ret
return;
    }

    data.
    }

    dat
results.forEach(item => {
        
        con
const title = item.title || item.name;
        
    
const tmdb_id = item.id;
        
        con
const type = item.media_type;

        const resultDiv = document.createElement('div');
        resultDiv.
    
className = 'result-item';
        resultDiv.
    
innerHTML = `
            <h3>${title}</h3>
            <button onclick="play('${type}', ${tmdb_id})">Play</button>
        `;
        resultsDiv.appendChild(resultDiv);
    });
});

async function play(type, tmdb_id) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.
    re
innerHTML = ''; // Clear previous results

    if (type === 'movie') {
        
        cons
const videoURL = `${vidsrcBaseURL}/movie/${tmdb_id}`;
        document.getElementById('videoFrame').src = videoURL;
    } 
  
else if (type === 'tv') {
        const seasonNumber = prompt('Enter season number:');
        const episodeNumber = prompt('Enter episode number:');
        const videoURL = `${vidsrcBaseURL}/tv/${tmdb_id}/${seasonNumber}/${episodeNumber}`;
        document.getElementById('videoFrame').src = videoURL;
    }

    document.getElementById('videoPlayer').style.display = 'block';
}
