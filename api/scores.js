// Classement mondial de Comète Filante (fonction Vercel)
// Les scores sont gardés dans une base Upstash Redis reliée au projet Vercel
// (Vercel > Storage > Upstash for Redis). Pas besoin d'adresse e-mail :
// chaque joueur a un nom et un code secret gardé dans son navigateur.
const DB_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const DB_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const SCORES = 'cf:scores', OWNERS = 'cf:owners', NAMES = 'cf:names';

async function redis(cmd) {
  const r = await fetch(DB_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${DB_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmd),
  });
  const j = await r.json();
  if (j.error) throw new Error(j.error);
  return j.result;
}

// lettres, chiffres, espaces, tirets et points, 16 caractères au plus
const clean = name => String(name || '').replace(/[^\p{L}\p{N} _.-]/gu, '').replace(/\s+/g, ' ').trim().slice(0, 16);

async function rankOf(key) {
  const rank = await redis(['ZREVRANK', SCORES, key]);
  if (rank === null) return null;
  return { rank: rank + 1, score: Number(await redis(['ZSCORE', SCORES, key])) };
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (!DB_URL || !DB_TOKEN) return res.status(503).json({ error: 'Le classement mondial n\'est pas encore branché.' });

  try {
    if (req.method === 'GET') {
      // les 50 meilleurs, et la place du joueur qui demande
      const raw = await redis(['ZREVRANGE', SCORES, 0, 49, 'WITHSCORES']);
      const keys = raw.filter((_, i) => i % 2 === 0);
      const shown = keys.length ? await redis(['HMGET', NAMES, ...keys]) : [];
      const top = keys.map((k, i) => ({ name: shown[i] || k, score: Number(raw[i * 2 + 1]) }));
      const name = clean(req.query && req.query.name);
      const me = name ? await rankOf(name.toLowerCase()) : null;
      const total = await redis(['ZCARD', SCORES]);
      return res.status(200).json({ top, me, total });
    }

    if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') body = JSON.parse(body || '{}');
      body = body || {};
      const name = clean(body.name), key = name.toLowerCase();
      const token = String(body.token || '').slice(0, 64), score = Math.floor(Number(body.score));
      if (name.length < 2) return res.status(400).json({ error: 'Ton nom doit avoir au moins 2 lettres.' });
      if (token.length < 16) return res.status(400).json({ error: 'Code joueur invalide.' });
      if (!Number.isFinite(score) || score < 0 || score > 5000000) return res.status(400).json({ error: 'Score invalide.' });
      // le premier joueur qui prend un nom le garde, grâce à son code secret
      await redis(['HSETNX', OWNERS, key, token]);
      if (await redis(['HGET', OWNERS, key]) !== token) return res.status(409).json({ error: 'Ce nom est déjà pris par un autre joueur. Choisis-en un autre.' });
      await redis(['HSET', NAMES, key, name]);
      // on garde seulement le meilleur score de chaque joueur
      await redis(['ZADD', SCORES, 'GT', score, key]);
      const me = await rankOf(key);
      const total = await redis(['ZCARD', SCORES]);
      return res.status(200).json({ me, total });
    }

    return res.status(405).json({ error: 'Méthode non prise en charge.' });
  } catch (e) {
    return res.status(500).json({ error: 'Le classement ne répond pas, réessaie plus tard.' });
  }
};
