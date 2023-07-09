import { createCipheriv, randomBytes, createDecipheriv } from 'crypto';

export type EncryptedMessage = {
  iv: Buffer;
  encrypted: string;
};

export function encryptMessage(message: string, key: string): EncryptedMessage {
  const iv = randomBytes(16);
  const cipher = createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(message, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return {
    iv,
    encrypted,
  };
}

export function decryptMessage(
  encryptedMessage: EncryptedMessage,
  key: string
) {
  const decipher = createDecipheriv(
    'aes-256-cbc',
    Buffer.from(key),
    Buffer.from(encryptedMessage.iv)
  );
  let decrypted = decipher.update(encryptedMessage.encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
