// End-to-end encryption helpers (uses the browser's built-in Web Crypto API, no extra packages)
//
// How it works:
//  - Every user has an RSA key pair. PUBLIC key is stored on the server, PRIVATE key never leaves the browser
//    in readable form (a copy locked with the user's password is stored on the server so login works on any device).
//  - Each message is encrypted with a random AES key. That AES key is then encrypted with the
//    receiver's public key AND the sender's public key, so both people can read the message.
//  - The server / database only ever sees scrambled text.

const subtle = globalThis.crypto.subtle;
const enc = new TextEncoder();
const dec = new TextDecoder();

// ---------- small helpers ----------
const toB64 = (buf) => {
  let s = "";
  for (const b of new Uint8Array(buf)) s += String.fromCharCode(b);
  return btoa(s);
};
const fromB64 = (str) => Uint8Array.from(atob(str), (c) => c.charCodeAt(0));
const RSA = { name: "RSA-OAEP", hash: "SHA-256" };

// ---------- key pair ----------
export async function generateKeyPair() {
  const pair = await subtle.generateKey(
    { ...RSA, modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]) },
    true,
    ["encrypt", "decrypt"]
  );
  return {
    publicKey: toB64(await subtle.exportKey("spki", pair.publicKey)),
    privateKey: toB64(await subtle.exportKey("pkcs8", pair.privateKey)),
  };
}

// ---------- lock / unlock private key with the user's password ----------
async function keyFromPassword(password, salt) {
  const base = await subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]);
  return subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 200000, hash: "SHA-256" },
    base,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function lockPrivateKey(privateKey, password) {
  const salt = globalThis.crypto.getRandomValues(new Uint8Array(16));
  const iv = globalThis.crypto.getRandomValues(new Uint8Array(12));
  const key = await keyFromPassword(password, salt);
  const data = await subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(privateKey));
  return JSON.stringify({ salt: toB64(salt), iv: toB64(iv), data: toB64(data) });
}

export async function unlockPrivateKey(locked, password) {
  const { salt, iv, data } = JSON.parse(locked);
  const key = await keyFromPassword(password, fromB64(salt));
  const plain = await subtle.decrypt({ name: "AES-GCM", iv: fromB64(iv) }, key, fromB64(data));
  return dec.decode(plain);
}

// ---------- encrypt / decrypt a message ----------
export async function encryptText(text, myPublicKey, theirPublicKey) {
  const aesKey = await subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt"]);
  const iv = globalThis.crypto.getRandomValues(new Uint8Array(12));
  const cipher = await subtle.encrypt({ name: "AES-GCM", iv }, aesKey, enc.encode(text));
  const rawAes = await subtle.exportKey("raw", aesKey);

  const wrap = async (publicKey) => {
    const pub = await subtle.importKey("spki", fromB64(publicKey), RSA, false, ["encrypt"]);
    return toB64(await subtle.encrypt({ name: "RSA-OAEP" }, pub, rawAes));
  };

  return {
    text: toB64(cipher),            // encrypted message
    iv: toB64(iv),
    senderKey: await wrap(myPublicKey),      // AES key for the sender
    receiverKey: await wrap(theirPublicKey), // AES key for the receiver
  };
}

let cachedPrivate = { b64: null, key: null };
async function importPrivate(b64) {
  if (cachedPrivate.b64 !== b64) {
    const key = await subtle.importKey("pkcs8", fromB64(b64), RSA, false, ["decrypt"]);
    cachedPrivate = { b64, key };
  }
  return cachedPrivate.key;
}

export async function decryptText(message, privateKey, isMine) {
  if (!message.iv) return message.text; // old message saved before encryption was added
  try {
    const priv = await importPrivate(privateKey);
    const wrapped = isMine ? message.senderKey : message.receiverKey;
    const rawAes = await subtle.decrypt({ name: "RSA-OAEP" }, priv, fromB64(wrapped));
    const aesKey = await subtle.importKey("raw", rawAes, "AES-GCM", false, ["decrypt"]);
    const plain = await subtle.decrypt({ name: "AES-GCM", iv: fromB64(message.iv) }, aesKey, fromB64(message.text));
    return dec.decode(plain);
  } catch {
    return "🔒 Unable to decrypt this message";
  }
}
