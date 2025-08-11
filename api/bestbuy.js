// /api/bestbuy.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'GET') { res.status(405).json({ error: 'Method not allowed' }); return; }

  try {
    const apiKey = process.env.BESTBUY_API_KEY || 'AFFuUk09sNekxlWbbForMFoh';
    const pageSize = encodeURIComponent(req.query.pageSize || '24');
    const sort = encodeURIComponent(req.query.sort || 'salePrice.asc');
    const show = encodeURIComponent(req.query.show || 'sku,name,regularPrice,salePrice,thumbnailImage,url,shortDescription');
    const q = req.query.q ? `&search=${encodeURIComponent(req.query.q)}` : '';
    const category = req.query.category ? `&categoryPath.id=${encodeURIComponent(req.query.category)}` : '';
    const filter = '(salePrice<regularPrice&active=*)';
    const base = `https://api.bestbuy.com/v1/products${filter}?format=json&pageSize=${pageSize}&show=${show}&sort=${sort}${q}${category}&apiKey=${apiKey}`;

    const resp = await fetch(base);
    if (!resp.ok) {
      const text = await resp.text();
      res.status(resp.status).json({ error: 'Upstream error', status: resp.status, body: text });
      return;
    }
    const data = await resp.json();
    res.status(200).json({ products: data.products || [], total: data.total || 0, from: data.from, to: data.to });
  } catch (err) {
    res.status(500).json({ error: 'Proxy error', message: String(err) });
  }
}
