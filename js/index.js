/* eslint-env node, browser */

const vanity = require('./vanity');

let count = 0;
let stop = false;
let lastTick = null;
let firstTick = null;
let difficulty = 0;
const step = 250;
const elements = {};
const ids = {
	counter: 'counter',
	speed: 'speed',
	probability: 'probability',
	probabilityBar: 'probability-bar',
	status: 'status',
	genBtn: 'gen',
	stopBtn: 'stop',
	form: 'form'
};

const parseInput = () => {
	const input = {
		prefix: document.getElementById('prefix').value,
		checksum: document.getElementById('checksum').checked
	};

	if (!vanity.isValidHex(input.prefix)) {
		elements.form.className = 'error';
		return;
	}

	elements.form.className = '';
	difficulty = vanity.computeDifficulty(input.prefix, input.checksum);
	document.getElementById('difficulty').innerText = difficulty.toString();
	return input;
};

const incrementCounter = incr => {
	count += incr;
	elements.counter.innerText = count.toString() + (count === 1 ? ' address' : ' addresses');

	const currentTick = performance.now();
	elements.speed.innerText = incr > 0 ? Math.floor(1000 * incr / (currentTick - lastTick)) + ' addr/s' : '0 addr/s';
	lastTick = currentTick;
};

const updateStats = () => {
	const prob = Math.round(10000 * vanity.computeProbability(difficulty, count)) / 100;
	elements.probability.innerText = prob + '%';
	elements.probabilityBar.style.width = prob + '%';
};

const displayResult = result => {
	incrementCounter(result.attempts);
	document.getElementById('address').innerText = result.address;
	document.getElementById('private-key').innerText = result.privKey;
	elements.status.innerText = 'Address found';
	console.info('Average speed: ' + Math.floor(1000 * count / (performance.now() - firstTick)) + ' addr/s');
	updateStats();
};

const clearResult = () => {
	document.getElementById('address').innerText = '';
	document.getElementById('private-key').innerText = '';
	elements.status.innerText = 'Running';
	updateStats();
};

const toggleButtons = () => {
	const enabled = stop ? elements.genBtn : elements.stopBtn;
	const disabled = stop ? elements.stopBtn : elements.genBtn;
	enabled.removeAttribute('disabled');
	disabled.setAttribute('disabled', '');
};

const generate = input => {
	const add = vanity.getVanityWallet(input.prefix, input.checksum, step);
	if (add !== null) {
		stop = true;
		toggleButtons();
		return displayResult(add);
	}

	incrementCounter(step);
	updateStats();

	if (stop) {
		elements.status.innerText = 'Stopped';
		return;
	}

    // Use setTimeout to let the browser render
	setTimeout(() => generate(input), 0);
};

for (const e in ids) { // eslint-disable-line guard-for-in
	elements[e] = document.getElementById(ids[e]);
}

// Add event listeners on buttons
elements.genBtn.addEventListener('click', () => {
	firstTick = performance.now();
	incrementCounter(-count);
	clearResult();

	const input = parseInput();
	stop = false;
	toggleButtons();

	setTimeout(() => generate(input), 0);
});

elements.stopBtn.addEventListener('click', () => {
	stop = true;
	toggleButtons();
});

elements.form.addEventListener('change', () => parseInput());
elements.form.addEventListener('keyup', () => parseInput());
