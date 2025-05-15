export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).send('Missing URL');

  try {
    const proxyUrl = `http://87.106.101.66:6173/${url}`;
    const response = await fetch(proxyUrl);
    const contentType = response.headers.get('content-type');

    const body = await response.text();
    res.setHeader('Content-Type', contentType);
    res.status(response.status).send(body);
  } catch (err) {
    console.error(err);
    res.status(500).send('Proxy error');
  }
}
