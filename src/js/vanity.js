/* eslint-env worker */

const ethUtils = require('ethereumjs-util');
const randomBytes = require('randombytes');

const step = 500;

/**
 * Create a wallet from a random private key
 * @returns {{address: string, privKey: string}}
 */
const getRandomWallet = () => {
	const randbytes = randomBytes(32);
	return {
		address: '0x' + ethUtils.privateToAddress(randbytes).toString('hex'),
		privKey: randbytes.toString('hex')
	};
};

/**
 * Check if a wallet respects the input constraints
 * @param wallet
 * @param input
 * @param isChecksum
 * @returns {boolean}
 */
const isValidVanityWallet = (wallet, input, isChecksum) => {
	if (!isChecksum) {
		return input === wallet.address.substr(2, input.length);
	}
	if (input.toLowerCase() !== wallet.address.substr(2, input.length)) {
		return false;
	}

	const address = wallet.address.substr(2);
	const hash = ethUtils.sha3(address).toString('hex');

	for (let i = 0; i < input.length; i++) {
		if (input[i] !== (parseInt(hash[i], 16) >= 8 ? address[i].toUpperCase() : address[i])) {
			return false;
		}
	}
	return true;
};

/**
 * Generate a lot of wallets until one satisfies the input constraints
 * @param input
 * @param isChecksum
 * @param cb - Callback called after x attempts, or when an address if found
 * @returns
 */
const getVanityWallet = (input, isChecksum, cb) => {
	input = isChecksum ? input : input.toLowerCase();
	let wallet = getRandomWallet();
	let attempts = 1;

	while (!isValidVanityWallet(wallet, input, isChecksum)) {
		if (attempts >= step) {
			cb({attempts});
			attempts = 0;
		}
		wallet = getRandomWallet();
		attempts++;
	}
	cb({address: ethUtils.toChecksumAddress(wallet.address), privKey: wallet.privKey, attempts});
};

onmessage = function (event) {
	const input = event.data;
	try {
		getVanityWallet(input.prefix, input.checksum, message => postMessage(message));
	} catch (err) {
		self.postMessage({error: err.toString()});
	}
};

module.exports = {
	onmessage
};
