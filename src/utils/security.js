// Hash ligero del PIN para no guardarlo en texto plano en localStorage.
export function hashPin(pin) {
  let h = 0;
  for (let i = 0; i < pin.length; i++) {
    h = (h * 31 + pin.charCodeAt(i)) >>> 0;
  }
  return h.toString(36);
}

function randomChallenge() {
  return crypto.getRandomValues(new Uint8Array(32));
}

function bufToBase64(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

function base64ToBuf(b64) {
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}

export async function isBiometricAvailable() {
  try {
    if (!window.PublicKeyCredential || !PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) return false;
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch (e) {
    return false;
  }
}

// Registra huella/Face ID como credencial local del dispositivo (WebAuthn, sin backend).
export async function registerBiometric() {
  try {
    const credential = await navigator.credentials.create({
      publicKey: {
        challenge: randomChallenge(),
        rp: { name: 'Glucosia' },
        user: {
          id: new TextEncoder().encode('glucosia-local-user'),
          name: 'glucosia-user',
          displayName: 'Glucosia',
        },
        pubKeyCredParams: [{ type: 'public-key', alg: -7 }, { type: 'public-key', alg: -257 }],
        authenticatorSelection: { authenticatorAttachment: 'platform', userVerification: 'required' },
        timeout: 60000,
      },
    });
    return credential ? bufToBase64(credential.rawId) : null;
  } catch (e) {
    return null;
  }
}

export async function verifyBiometric(credentialIdB64) {
  try {
    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge: randomChallenge(),
        allowCredentials: [{ id: base64ToBuf(credentialIdB64), type: 'public-key' }],
        userVerification: 'required',
        timeout: 30000,
      },
    });
    return !!assertion;
  } catch (e) {
    return false;
  }
}
