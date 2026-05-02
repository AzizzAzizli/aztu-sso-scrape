const CryptoJS = require("crypto-js");

const MASTER_KEY = process.env.MASTER_KEY;

const encrypt = (text) => {
    if (!text) return null;
    return CryptoJS.AES.encrypt(text, MASTER_KEY).toString();
};


const decrypt = (ciphertext) => {
    if (!ciphertext) return null;
    const bytes = CryptoJS.AES.decrypt(ciphertext, MASTER_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
};

module.exports = { encrypt, decrypt };