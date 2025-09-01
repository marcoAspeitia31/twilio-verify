import crypto from "crypto";

export const generateSign = (payload) => {
  const SECRET = process.env.HMAC_SECRET;
  return crypto
    .createHmac("sha256", SECRET)
    .update(JSON.stringify(payload))
    .digest("hex");
};
