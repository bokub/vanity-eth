/* eslint-env worker */

const ethUtils = require('ethereumjs-util');
const randomBytes = require('randombytes');

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
		return wallet.address.substr(2, input.length) === input;
	}
	const address = ethUtils.stripHexPrefix(wallet.address).toLowerCase();
	const hash = ethUtils.sha3(address).toString('hex');

	for (let i = 0; i < input.length; i++) {
		if (parseInt(hash[i], 16) >= 8) {
			if (address[i].toUpperCase() !== input[i]) {
				return false;
			}
		} else if (address[i] !== input[i]) {
			return false;
		}
	}
	return true;
};

/**
 * Generate a lot of wallets until one satisfies the input constraints
 * @param input
 * @param isChecksum
 * @param max - Stop the generation after <max> attempts. Set to 0 for unlimited
 * @returns
 */
const getVanityWallet = (input, isChecksum, max) => {
	input = isChecksum ? input : input.toLowerCase();
	let _wallet = getRandomWallet();
	let attempts = 1;

	while (!isValidVanityWallet(_wallet, input, isChecksum)) {
		_wallet = getRandomWallet();
		attempts++;
		if (max && attempts >= max) {
			return null;
		}
	}

	_wallet.address = ethUtils.toChecksumAddress(_wallet.address);
	_wallet.attempts = attempts;
	return _wallet;
};

onmessage = function (event) {
	const data = event.data;
	postMessage(getVanityWallet(data.input.prefix, data.input.checksum, data.step));
};

module.exports = {
	onmessage
};
