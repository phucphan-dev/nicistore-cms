import * as jose from 'jose';

const verifyToken = async (token: string, publicKey: string):
  Promise<jose.JWEHeaderParameters | null> => {
  try {
    const algorithm = 'RS256';
    const ecPublicKey = await jose.importSPKI(publicKey, algorithm);
    const { payload: encodePayload } = await jose.compactVerify(token, ecPublicKey);
    const payload = JSON.parse(new TextDecoder().decode(encodePayload));
    return payload;
  } catch (error) {
    return null;
  }
};

export default verifyToken;
