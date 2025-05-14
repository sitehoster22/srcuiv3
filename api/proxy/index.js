const request = require('request');

export default (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl || !targetUrl.startsWith('https://vidsrc.su')) {
        return res.status(400).send('Invalid target URL');
    }

    request({ url: targetUrl, followRedirect: true })
        .on('error', () => res.status(500).send('Proxy error'))
        .pipe(res);
};
