// 引入 crypto-js
import CryptoJS from "crypto-js";
// 引入配置
import config from "@/config";

// AES 密钥（前后端需保持一致）
const SECRET_KEY = CryptoJS.enc.Utf8.parse(config.encryptSecretKey!);

// AES 加密
export function encrypt(plaintext: string): string {
  const encrypted = CryptoJS.AES.encrypt(plaintext, SECRET_KEY, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
}

// AES 解密
export function decrypt(ciphertext: string): string {
  const decrypted = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}
