import crypto from 'node:crypto';

/**
 * PayTR iFrame API v2 Token Oluşturma Endpoint'i
 * Frontend bu adrese POST atar, PayTR'den alınan iframe token döner.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'failed', reason: 'Method Not Allowed' });
  }

  try {
    const merchantId = process.env.PAYTR_MERCHANT_ID;
    const merchantKey = process.env.PAYTR_MERCHANT_KEY;
    const merchantSalt = process.env.PAYTR_MERCHANT_SALT;

    if (!merchantId || !merchantKey || !merchantSalt) {
      return res.status(500).json({
        status: 'failed',
        reason: 'PayTR sunucu anahtarları (PAYTR_MERCHANT_ID, PAYTR_MERCHANT_KEY, PAYTR_MERCHANT_SALT) Vercel üzerinde tanımlanmamış.'
      });
    }

    const {
      merchantOid,
      email,
      totalAmount,
      basketItems,
      userName,
      userAddress,
      userPhone,
      noInstallment = 0,
      maxInstallment = 6,
      testMode = false,
      origin
    } = req.body || {};

    if (!totalAmount || Number(totalAmount) <= 0) {
      return res.status(400).json({ status: 'failed', reason: 'Geçersiz ödeme tutarı.' });
    }

    // PayTR merchant_oid yalnızca alfanümerik olmalıdır
    const cleanOid = String(merchantOid || `VR${Date.now()}`).replace(/[^a-zA-Z0-9]/g, '');

    // İstemci IP adresini al
    const forwarded = req.headers['x-forwarded-for'];
    const rawIp = Array.isArray(forwarded)
      ? forwarded[0]
      : typeof forwarded === 'string'
        ? forwarded.split(',')[0].trim()
        : req.socket?.remoteAddress || '127.0.0.1';
    const userIp = rawIp.replace(/^::ffff:/, '') || '127.0.0.1';

    const cleanEmail = (email && String(email).includes('@')) ? String(email).trim() : 'musteri@velvetrose.com.tr';
    const paymentAmount = String(Math.round(Number(totalAmount) * 100)); // Kuruş cinsinden

    // Sepet formatı: [[ürünAdı, birimFiyatStr, adet], ...]
    const safeBasket = Array.isArray(basketItems) && basketItems.length > 0
      ? basketItems.map((item) => [
          String(item.name || 'Çiçek Siparişi').slice(0, 100),
          Number(item.price || totalAmount).toFixed(2),
          Number(item.quantity || 1)
        ])
      : [['Velvet Rose Çiçek Siparişi', Number(totalAmount).toFixed(2), 1]];

    const userBasket = Buffer.from(JSON.stringify(safeBasket)).toString('base64');
    const noInstStr = String(noInstallment ? 1 : 0);
    const maxInstStr = String(noInstallment ? 0 : (maxInstallment ?? 0));
    const currency = 'TL';
    const testModeStr = String(testMode ? 1 : 0);

    // PayTR Token Hash:
    // merchant_id + user_ip + merchant_oid + email + payment_amount + user_basket + no_installment + max_installment + currency + test_mode + merchant_salt
    const hashStr = `${merchantId}${userIp}${cleanOid}${cleanEmail}${paymentAmount}${userBasket}${noInstStr}${maxInstStr}${currency}${testModeStr}${merchantSalt}`;
    const paytrToken = crypto
      .createHmac('sha256', merchantKey)
      .update(hashStr)
      .digest('base64');

    const siteOrigin = origin && String(origin).startsWith('http')
      ? String(origin).replace(/\/$/, '')
      : 'https://velvetrose.com.tr';

    const formParams = new URLSearchParams({
      merchant_id: String(merchantId),
      user_ip: userIp,
      merchant_oid: cleanOid,
      email: cleanEmail,
      payment_amount: paymentAmount,
      paytr_token: paytrToken,
      user_basket: userBasket,
      debug_on: '1',
      no_installment: noInstStr,
      max_installment: maxInstStr,
      user_name: String(userName || 'Velvet Rose Müşteri').slice(0, 60),
      user_address: String(userAddress || 'İzmir, Türkiye').slice(0, 400),
      user_phone: String(userPhone || '05000000000').slice(0, 20),
      merchant_ok_url: `${siteOrigin}/?payment=success&oid=${cleanOid}`,
      merchant_fail_url: `${siteOrigin}/?payment=failed&oid=${cleanOid}`,
      timeout_limit: '30',
      currency,
      test_mode: testModeStr,
      lang: 'tr'
    });

    const paytrResponse = await fetch('https://www.paytr.com/odeme/api/get-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formParams.toString()
    });

    const data = await paytrResponse.json();

    if (data.status === 'success' && data.token) {
      return res.status(200).json({
        status: 'success',
        token: data.token,
        merchantOid: cleanOid
      });
    }

    return res.status(400).json({
      status: 'failed',
      reason: data.reason || 'PayTR token alınamadı.'
    });
  } catch (err) {
    console.error('PayTR token alma hatası:', err);
    return res.status(500).json({
      status: 'failed',
      reason: err instanceof Error ? err.message : 'Sunucu hatası oluştu.'
    });
  }
}
