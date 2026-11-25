import crypto from 'node:crypto';

/**
 * PayTR Bildirim URL (Callback URL) Endpoint
 * PayTR Panel > Ayarlar > Bildirim URL kısmına yazılacak adres:
 * https://velvetrose.com.tr/api/paytr-callback
 */
export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).send('PayTR Callback endpoint aktif.');
  }

  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const merchantKey = process.env.PAYTR_MERCHANT_KEY;
    const merchantSalt = process.env.PAYTR_MERCHANT_SALT;

    if (!merchantKey || !merchantSalt) {
      console.error('PayTR ortam değişkenleri (PAYTR_MERCHANT_KEY / PAYTR_MERCHANT_SALT) tanımlı değil.');
      return res.status(500).send('PayTR configuration missing');
    }

    // Body parse (Vercel genelde form-urlencoded'ı otomatik parse eder, yoksa manuel parse et)
    let body = req.body;
    if (!body || typeof body === 'string') {
      const raw = typeof body === 'string' ? body : await readRawBody(req);
      body = Object.fromEntries(new URLSearchParams(raw));
    }

    const { merchant_oid, status, total_amount, hash, failed_reason_msg } = body;

    if (!merchant_oid || !status || !total_amount || !hash) {
      return res.status(400).send('PAYTR notification failed: missing parameters');
    }

    // PayTR HMAC-SHA256 imza doğrulaması
    const hashStr = `${merchant_oid}${merchantSalt}${status}${total_amount}`;
    const calculatedHash = crypto
      .createHmac('sha256', merchantKey)
      .update(hashStr)
      .digest('base64');

    if (calculatedHash !== hash) {
      console.error('PayTR hash doğrulama hatası:', { merchant_oid });
      return res.status(400).send('PAYTR notification failed: bad hash');
    }

    if (status === 'success') {
      console.log('PayTR ödeme onaylandı:', { merchant_oid, total_amount });
    } else {
      console.warn('PayTR ödeme başarısız:', { merchant_oid, failed_reason_msg });
    }

    // PayTR sunucusu düz metin olarak tam olarak "OK" yanıtı bekler
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.status(200).send('OK');
  } catch (err) {
    console.error('PayTR callback hatası:', err);
    return res.status(500).send('Internal Server Error');
  }
}

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}
