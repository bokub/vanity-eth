<template>
    <div class="panel">
        <p>
            Vanity-ETH is an open source tool using your web browser to generate Ethereum vanity addresses.<br>
            Enter a short prefix/suffix of your choice, and click ‘generate’ to start.
        </p>
        <div class="shortcut">
            <button type="button" class="button-large" @click="scrollDown">Start now</button>
        </div>

        <h2>What's a vanity address?</h2>
        <p>
            A vanity address is an address which part of it is chosen by yourself, making it look less random.<br>
            Examples: <span class="monospace">0xc0ffee254729296a45a3885639AC7E10F9d54979</span>, or
            <span class="monospace">0x999999cf1046e68e36E1aA2E0E07105eDDD1f08E</span>
        </p>

        <h2>How it works</h2>
        <p>
            Enter the prefix/suffix of your choice, and click ‘generate’ to start. Your browser will generate lots of random
            addresses until one matches your input.<br>
            Once an address is found, you can reveal the private key, or click the 'save' button to download
            a password-encrypted keystore file.<br>
            You can increase the number of working threads to reach higher speeds, or decrease it if you computer
            struggles.<br>

        </p>
        <h2>Security</h2>
        <p>
            As explained above, everything is computed only in your browser. Nothing ever leaves your machine, or even
            your browser tab. There is no database, no server-side code. Everything vanishes when you close your tab.<br><br>
            <b>Vanity-ETH cannot and will never store your private key</b>, and if you don't trust it, you have 3 ways to ensure
            your key remains private:<br>
            &nbsp;-&nbsp;Once the web page is loaded, you can turn off the internet and continue playing, it will work seamlessly<br>
            &nbsp;-&nbsp;You can also download the latest build of Vanity-ETH
            <a href="https://git.io/veth-dl" target="_blank">here</a> and use it on a completely offline computer<br>
            &nbsp;-&nbsp;The code is 100% open source and available on
            <a href="https://github.com/bokub/vanity-eth" target="_blank">Github</a>. You can review it as much as you want before using it<br>
            <br>
            Vanity-ETH uses a cryptographically secure pseudorandom number generator (CSPRNG) to generate
            Ethereum addresses.<br>
            The keystore file is encrypted with a AES-128-CTR cipher using the BKDF2-SHA256 derivation function with 65536 hashing rounds.
        </p>
        <h2>Performance</h2>
        <p>
            For some reason, the performance of Vanity-ETH can vary a lot from a browser to another.
            Currently, Chrome provides the best results.<br>
            Using Vanity-ETH on your phone or tablet will work, but don't expect to reach the speed of a good old computer.
        </p>
        <h2>Compatibility</h2>
        <p>
            Any address generated with Vanity-ETH is ERC-20 compatible, which means you can use it for an ICO, an
            airdrop, or just to withdraw your funds from an exchange.<br>
            The keystore file is 100% compatible with MyEtherWallet, MetaMask, Mist, and geth.
        </p>
    </div>
</template>

<script>
    export default {
        data: function () {
            return {
                scrollTimeOut: null
            }
        },
        methods: {
            scrollDown() {
                this.scrollTo(document.getElementById('input-panel'), -1);
            },
            scrollTo(element, lastValue) {
                let currentValue = window.scrollY;
                let diff = element.getBoundingClientRect().top / 6;
                if (Math.abs(diff) > 1 && currentValue > lastValue) {
                    window.scrollTo(0, (window.scrollY + diff));
                    this.scrollTimeOut = setTimeout(this.scrollTo, 30, element, currentValue)
                } else if (currentValue >= lastValue) {
                    document.getElementById('input').focus();
                }
            }
        }
    };
</script>

<style lang="sass" scoped>
    @import "../css/variables"
    p
        margin: 15px 0 20px
        color: $text-alt
        overflow-x: hidden
        text-overflow: ellipsis
        .monospace
            font-family: $monospace-font
            font-size: 0.85em
    .shortcut
        text-align: center
        .button-large
            width: 150px
            margin: 15px 0 35px
</style>
