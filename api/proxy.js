// /api/proxy.js
export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).send('Missing URL');

  try {
    const localProxyUrl = `http://87.106.101.66:6173/proxy/${url}`;
    const response = await fetch(localProxyUrl);
    const contentType = response.headers.get('content-type');

    const body = await response.text();
    res.setHeader('Content-Type', contentType || 'text/html');
    res.status(response.status).send(body);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).send('Proxy error');
  }
}
