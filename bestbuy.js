// /api/bestbuy.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const apiKey = process.env.BESTBUY_API_KEY || 'AFFuUk09sNekxlWbbForMFoh';

    const pageSize = req.query.pageSize || '24';
    const sort = req.query.sort || 'salePrice.asc';
    const show = req.query.show || 'sku,name,regularPrice,salePrice,thumbnailImage,url,shortDescription';
    const q = req.query.q ? `&search=${encodeURIComponent(req.query.q)}` : '';
    const category = req.query.category ? `&categoryPath.id=${encodeURIComponent(req.query.category)}` : '';

    const filterRaw = '(salePrice<regularPrice&active=true)';
    const filter = encodeURIComponent(filterRaw);

    const url = `https://api.bestbuy.com/v1/products${filter}?format=json&pageSize=${encodeURIComponent(pageSize)}&show=${encodeURIComponent(show)}&sort=${encodeURIComponent(sort)}${q}${category}&apiKey=${encodeURIComponent(apiKey)}`;

    const upstream = await fetch(url);
    const text = await upstream.text();

    if (!upstream.ok) {
      return res.status(upstream.status).json({
        error: 'Upstream error',
        status: upstream.status,
        body: text
      });
    }

    let data;
    try { data = JSON.parse(text); } catch {
      return res.status(502).json({ error: 'Invalid JSON from upstream', body: text.slice(0, 500) });
    }

    return res.status(200).json({
      products: data.products || [],
      total: data.total || 0,
      range: { from: data.from, to: data.to }
    });
  } catch (err) {
    return res.status(500).json({ error: 'Proxy error', message: String(err) });
  }
}
