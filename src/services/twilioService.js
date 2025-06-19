import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

let cachedServiceSid = null;

async function getOrCreateService() {
  if (cachedServiceSid) return cachedServiceSid;

  const services = await client.verify.v2.services.list();
  if (services.length > 0) {
    cachedServiceSid = services[0].sid;
    return cachedServiceSid;
  }

  const newService = await client.verify.v2.services.create({ friendlyName: 'SMS Verify Service' });
  cachedServiceSid = newService.sid;
  return cachedServiceSid;
}

export async function sendCode(req, res) {
  const { phoneNumber } = req.body;
  if (!phoneNumber) return res.status(400).json({ error: 'Phone number is required' });

  try {
    const serviceSid = await getOrCreateService();
    await client.verify.v2.services(serviceSid)
      .verifications
      .create({ to: phoneNumber, channel: 'sms' });

    res.json({ message: 'Verification code sent' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function verifyCode(req, res) {
  const { phoneNumber, code } = req.body;
  if (!phoneNumber || !code) return res.status(400).json({ error: 'Phone number and code are required' });

  try {
    const serviceSid = await getOrCreateService();
    const result = await client.verify.v2.services(serviceSid)
      .verificationChecks
      .create({ to: phoneNumber, code });

    if (result.status === 'approved') {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, message: 'Code invalid or expired' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
