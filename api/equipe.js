// Équipe en ligne de Comète Filante (fonction Vercel)
// Ce serveur sert juste à se trouver : l'hôte dépose son « invitation » sous un code de 5 lettres,
// le pote qui tape le code (ou ouvre le lien) dépose sa réponse. Ensuite les deux ordinateurs
// se parlent directement (WebRTC) : la partie elle-même ne passe pas par ce serveur.
// Même base Upstash Redis que le classement mondial (Vercel > Storage). Une équipe s'efface au bout de 30 minutes.
const envEnding = ends => { for (const e of ends) { const k = Object.keys(process.env).find(n => n.endsWith(e) && !n.includes('READ_ONLY')); if (k) return process.env[k]; } };
const DB_URL = envEnding(['KV_REST_API_URL', 'REDIS_REST_URL']);
const DB_TOKEN = envEnding(['KV_REST_API_TOKEN', 'REDIS_REST_TOKEN']);
const TTL = 1800;
// pas de lettres qu'on confond (0/O, 1/I/L)
const LETTERS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const MAX_SDP = 20000;

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

const cleanCode = c => String(c || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5);
const key = code => `cf:equipe:${code}`;
const okSdp = s => typeof s === 'string' && s.length > 10 && s.length < MAX_SDP;

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (!DB_URL || !DB_TOKEN) return res.status(503).json({ error: 'Le jeu en équipe n\'est pas encore branché.' });

  try {
    if (req.method === 'GET') {
      // on lit l'invitation (pour le pote) ou la réponse (pour l'hôte)
      const code = cleanCode(req.query && req.query.code);
      if (code.length !== 5) return res.status(400).json({ error: 'Code invalide.' });
      const raw = await redis(['HMGET', key(code), 'offer', 'answer']);
      if (!raw || !raw[0]) return res.status(404).json({ error: 'Aucune équipe avec ce code. Vérifie les lettres, ou demande un nouveau code.' });
      return res.status(200).json({ offer: raw[0], answer: raw[1] || null });
    }

    if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') body = JSON.parse(body || '{}');
      body = body || {};
      if (body.action === 'create') {
        if (!okSdp(body.offer)) return res.status(400).json({ error: 'Invitation invalide.' });
        for (let i = 0; i < 8; i++) {
          let code = '';
          for (let j = 0; j < 5; j++) code += LETTERS[Math.floor(Math.random() * LETTERS.length)];
          // HSETNX : on ne prend jamais le code d'une autre équipe
          if (await redis(['HSETNX', key(code), 'offer', body.offer])) {
            await redis(['EXPIRE', key(code), TTL]);
            return res.status(200).json({ code });
          }
        }
        return res.status(503).json({ error: 'Réessaie dans un instant.' });
      }
      if (body.action === 'answer') {
        const code = cleanCode(body.code);
        if (code.length !== 5 || !okSdp(body.answer)) return res.status(400).json({ error: 'Réponse invalide.' });
        if (!(await redis(['HEXISTS', key(code), 'offer']))) return res.status(404).json({ error: 'Cette équipe n\'existe plus. Demande un nouveau code.' });
        // une seule personne peut rejoindre une équipe
        if (!(await redis(['HSETNX', key(code), 'answer', body.answer]))) return res.status(409).json({ error: 'Quelqu\'un a déjà rejoint cette équipe.' });
        return res.status(200).json({ ok: true });
      }
      return res.status(400).json({ error: 'Action inconnue.' });
    }

    return res.status(405).json({ error: 'Méthode non prise en charge.' });
  } catch (e) {
    return res.status(500).json({ error: 'Le serveur d\'équipe ne répond pas, réessaie plus tard.' });
  }
};
