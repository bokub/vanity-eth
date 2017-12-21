/* eslint-env node, browser */

const vanity = require('./vanity');

let count = 0;
const step = 100;
const counter = document.getElementById('counter');

const parseInput = () => {
	return {
		pattern: document.getElementById('pattern').value,
		checksum: true
	};
};

const incrementCounter = incr => {
	count += incr;
	counter.innerHTML = count.toString() + ' addresses generated';
};

const displayResult = result => {
	incrementCounter(result.attempts);
	document.getElementById('result').innerHTML = 'address: ' + result.address + '<br>key: ' + result.privKey;
};

const generate = input => {
	const add = vanity.getVanityWallet(input.pattern, input.checksum, step);
	if (add !== null) {
		return displayResult(add);
	}

	incrementCounter(step);

    // Use setTimeout to let the browser render
	setTimeout(() => {
		generate(input);
	}, 0);
};

// Add event listener on button
document.getElementById('btn').addEventListener('click', () => {
	incrementCounter(-count);
	const input = parseInput();
	generate(input);
});
