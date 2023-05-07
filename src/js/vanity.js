/* eslint-env worker */
const keccak = require('keccak');
const crypto = require('crypto');

const step = 500;

/**
 * Create a wallet from a random private key
 * @returns {{address: string, privKey: string}}
 */
const getRandomWallet = () => {
    const privateKeyBytes = crypto.randomBytes(32);
    return {
        address: '0x' + crypto.createHash('sha3-256').update(privateKey).digest('hex').slice(24),
        privKey: privateKeyBytes.toString('hex')
    };
};

/**
 * Check if a wallet respects the input constraints
 * @param address
 * @param input
 * @param isChecksum
 * @param isSuffix
 * @returns {boolean}
 */
const isValidVanityAddress = (address, input, isChecksum, isSuffix) => {
    const subStr = isSuffix ? address.substr(40 - input.length) : address.substr(0, input.length);

    if (!isChecksum) {
        return input === subStr;
    }
    if (input.toLowerCase() !== subStr) {
        return false;
    }

    return isValidChecksum(address, input, isSuffix);
};

const isValidChecksum = (address, input, isSuffix) => {
    const hash = keccak('keccak256').update(address).digest().toString('hex');
    const shift = isSuffix ? 40 - input.length : 0;

    for (let i = 0; i < input.length; i++) {
        const j = i + shift;
        if (input[i] !== (parseInt(hash[j], 16) >= 8 ? address[j].toUpperCase() : address[j])) {
            return false;
        }
    }
    return true;
};

const toChecksumAddress = (address) => {
    const hash = keccak('keccak256').update(address).digest().toString('hex');
    let ret = '';
    for (let i = 0; i < address.length; i++) {
        ret += parseInt(hash[i], 16) >= 8 ? address[i].toUpperCase() : address[i];
    }
    return ret;
};

/**
 * Generate a lot of wallets until one satisfies the input constraints
 * @param input - String chosen by the user
 * @param isChecksum - Is the input case-sensitive
 * @param isSuffix - Is it a suffix, or a prefix
 * @param cb - Callback called after x attempts, or when an address if found
 * @returns
 */
const getVanityWallet = (input, isChecksum, isSuffix, cb) => {
    input = isChecksum ? input : input.toLowerCase();
    let wallet = getRandomWallet();
    let attempts = 1;

    while (!isValidVanityAddress(wallet.address, input, isChecksum, isSuffix)) {
        if (attempts >= step) {
            cb({attempts});
            attempts = 0;
        }
        wallet = getRandomWallet();
        attempts++;
    }
    cb({address: '0x' + toChecksumAddress(wallet.address), privKey: wallet.privKey, attempts});
};

onmessage = function (event) {
    const input = event.data;
    try {
        getVanityWallet(input.hex, input.checksum, input.suffix, (message) => postMessage(message));
    } catch (err) {
        self.postMessage({error: err.toString()});
    }
};

module.exports = {
    onmessage
};
