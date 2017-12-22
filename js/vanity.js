const ethUtils = require('ethereumjs-util');
const randomBytes = require('randombytes');

const ERRORS = {
	invalidHex: 'Invalid hex input'
};

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
 * Check if a string is valid hexadecimal
 * @param hex
 * @returns {boolean}
 */
const isValidHex = hex => hex.length ? /^[0-9A-F]+$/g.test(hex.toUpperCase()) : true;

/**
 * Check if a wallet respects the input constraints
 * @param wallet
 * @param input
 * @param isChecksum
 * @returns {boolean}
 */
const isValidVanityWallet = (wallet, input, isChecksum) => {
	let address = wallet.address;
	address = isChecksum ? ethUtils.toChecksumAddress(address) : address;
	return address.substr(2, input.length) === input;
};

const computeDifficulty = (pattern, isChecksum) => {
	return Math.pow(isChecksum ? 22 : 16, pattern.length);
};

const computeProbability = (difficulty, attempts) => {
	return 1 - Math.pow((difficulty - 1) / difficulty, attempts);
};

/**
 * Generate a lot of wallets until one satisfies the input constraints
 * @param input
 * @param isChecksum
 * @param max - Stop the generation after <max> attempts. Set to 0 for unlimited
 * @returns
 */
const getVanityWallet = (input, isChecksum, max) => {
	input = input || '';
	if (!isValidHex(input)) {
		throw new Error(ERRORS.invalidHex);
	}
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

module.exports = {
	getVanityWallet,
	computeDifficulty,
	computeProbability
};
