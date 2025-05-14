import fetch from 'node-fetch';

export default async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl || !targetUrl.startsWith('https://vidsrc.cc')) {
        return res.status(400).send('Invalid target URL');
    }

    try {
        // Setting custom headers, including User-Agent
        const response = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'en-US,en;q=0.9',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1'
            }
        });

        // If the response isn't OK, send an error
        if (!response.ok) {
            return res.status(response.status).send(`Error fetching content: ${response.statusText}`);
        }

        // Set the headers from the fetched content
        res.setHeader('Content-Type', response.headers.get('Content-Type'));
        
        // Pipe the response from the external source to the client
        response.body.pipe(res);
    } catch (error) {
        console.error('Error in proxy request:', error);
        res.status(500).send('Error in proxy request');
    }
};
