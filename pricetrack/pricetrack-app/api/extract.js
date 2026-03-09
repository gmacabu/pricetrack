// api/extract.js — Vercel Serverless Function
// Recebe o PDF em base64 do frontend e chama a Anthropic com segurança no servidor

export default async function handler(req, res) {
  // Permitir apenas POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { base64PDF } = req.body;
  if (!base64PDF) {
    return res.status(400).json({ error: 'base64PDF é obrigatório' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.REACT_APP_ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'document',
              source: { type: 'base64', media_type: 'application/pdf', data: base64PDF }
            },
            {
              type: 'text',
              text: `Extraia todas as informações desta NFCe e retorne APENAS um JSON válido, sem markdown:
{
  "store": "nome do estabelecimento",
  "cnpj": "XX.XXX.XXX/XXXX-XX",
  "address": "endereço",
  "date": "DD/MM/YYYY",
  "items": [{"name":"","code":"","qty":0,"unit":"","unitPrice":0,"total":0}],
  "totalBruto": 0,
  "discounts": 0,
  "totalLiquido": 0
}`
            }
          ]
        }]
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return res.status(response.status).json({ error: err.error?.message || 'Erro na API Anthropic' });
    }

    const data = await response.json();
    const text = data.content.map(c => c.text || '').join('');
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    return res.status(200).json(parsed);

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
