/* eslint-env node, browser */

const vanity = require('./vanity');

let count = 0;
let stop = false;
let lastTick = null;
let difficulty = 0;
const step = 250;
const elements = {
	counter: document.getElementById('counter'),
	speed: document.getElementById('speed'),
	probability: document.getElementById('probability'),
	probabilityBar: document.getElementById('probability-bar')
};

const parseInput = () => {
	return {
		pattern: document.getElementById('pattern').value,
		checksum: document.getElementById('checksum').checked
	};
};

const incrementCounter = incr => {
	count += incr;
	elements.counter.innerText = count.toString() + (count === 1 ? ' address' : ' addresses');

	const currentTick = performance.now();
	elements.speed.innerText = Math.floor(1000 * incr / (currentTick - lastTick)) + ' addresses / second';
	lastTick = currentTick;
};

const updateStats = () => {
	const prob = Math.round(10000 * vanity.computeProbability(difficulty, count)) / 100;
	elements.probability.innerText = prob + '%';
	elements.probabilityBar.style.width = prob + '%';
};

const displayResult = result => {
	incrementCounter(result ? result.attempts : 0);
	updateStats();
	document.getElementById('address').innerText = result ? result.address : '';
	document.getElementById('private-key').innerText = result ? result.privKey : '';
};

const generate = input => {
	const add = vanity.getVanityWallet(input.pattern, input.checksum, step);
	if (add !== null) {
		return displayResult(add);
	}

	incrementCounter(step);
	updateStats();

	if (stop) {
		return;
	}

    // Use setTimeout to let the browser render
	setTimeout(() => generate(input), 0);
};

// Add event listeners on buttons
document.getElementById('gen').addEventListener('click', () => {
	incrementCounter(-count);
	displayResult(null);
	stop = false;

	const input = parseInput();
	difficulty = vanity.computeDifficulty(input.pattern, input.checksum);
	document.getElementById('difficulty').innerText = difficulty.toString();
	generate(input);
});

document.getElementById('stop').addEventListener('click', () => {
	stop = true;
});
