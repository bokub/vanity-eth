<template>
    <div class="panel">
        <p>
            Vanity-ETH is an open-source tool that uses your web browser to generate Ethereum vanity addresses.<br />
            Enter a short prefix and/or suffix of your choice and click <i>Generate</i> to start.
        </p>
        <div class="shortcut">
            <button type="button" class="button-large" @click="scrollDown">Start now</button>
        </div>

        <h2>What's a vanity address?</h2>
        <div class="p">
            A vanity address is an address in which you can choose a part of it to make it appear less random.<br />
            Examples:
            <ul>
                <li><span class="monospace">0xc0ffee254729296a45a3885639AC7E10F9d54979</span></li>
                <li><span class="monospace">0x999999cf1046e68e36E1aA2E0E07105eDDD1f08E</span></li>
            </ul>
        </div>

        <h2>How it works</h2>
        <p>
            Enter a short prefix and/or suffix of your choice and click <i>Generate</i> to start. Your browser will
            generate lots of random addresses until it finds one that matches your input.<br />
            Once an address is found, you can choose to reveal the private key or click the <i>Save</i> button to
            download a password-encrypted keystore file.<br /><br />
            Adjusting the number of working threads can increase or decrease the speed, depending on your computer's
            capabilities.<br />
        </p>
        <h2>Security</h2>
        <p>
            As mentioned earlier, all computations occur solely within your browser. Nothing ever leaves your machine,
            or even your browser tab. There is no database, no server-side code. Everything vanishes when you close your
            browser tab.<br /><br />
            <b>Vanity-ETH cannot and will never store your private key.</b> If you have concerns about its
            trustworthiness, you have three options to ensure the privacy of your key:<br />
            &nbsp;-&nbsp;After loading the web page, you can disconnect from the internet and continue using it
            seamlessly<br />
            &nbsp;-&nbsp;Alternatively, you can download the latest build of Vanity-ETH
            <a href="https://git.io/veth-dl" target="_blank">here</a> and use it on an offline computer<br />
            &nbsp;-&nbsp;The code is 100% open source and available on
            <a href="https://github.com/bokub/vanity-eth" target="_blank">GitHub</a>, allowing you to review it
            thoroughly before usage<br />
            <br />
            Vanity-ETH uses a cryptographically secure pseudorandom number generator (CSPRNG) to generate Ethereum
            addresses.<br />
            The keystore file is encrypted with an AES-128-CTR cipher using the PBKDF2-SHA256 derivation function with
            65536 hashing rounds.
        </p>
        <h2>Other browser-based tools</h2>
        <p>
            Be aware that due to its popularity and open-source nature, Vanity-ETH has been widely copied, leading to
            the existence of websites claiming to provide the same functionality. Sometimes, they are perfect clones
            hosted on very similar domains.<br />
            Most of them do not credit the original code, are not open-source, and may contain malicious code.<br /><br />
            Vanity-ETH has always been the <b>first</b> browser-based ETH vanity address generator, and remains the most
            popular and trusted one.<br /><br />
            To be sure you're on the real Vanity-ETH website, search for
            <a href="https://github.com/search?o=desc&q=Vanity-ETH&s=stars" target="_blank">Vanity-ETH on GitHub</a>,
            find the repository with the most stars (> 600), and click the link in the description. Double check by
            searching <a href="https://www.google.com/search?q=Vanity-ETH" target="_blank">Vanity-ETH on Google</a>.
        </p>
        <h2>Performance</h2>
        <p>
            Vanity-ETH's performance may vary significantly across different browsers. Currently, Chrome provides the
            best results.<br />
            While you can use Vanity-ETH on your phone or tablet, it is unlikely to match the speed of a traditional
            computer.<br /><br />
            <b>N.B:</b> Vanity-ETH is designed to be a user-friendly tool that runs directly in your browser, providing
            easy accessibility without the need to download or install additional software.<br />
            However, browser-based tools have inherent limitations that may affect their performance and efficiency.
            Some dedicated command-line tools are more difficult to use, but may offer better performance.
        </p>
        <h2>Compatibility</h2>
        <p>
            Any address generated with Vanity-ETH is ERC-20 compatible, which means you can use it for an ICO, an
            airdrop, or just to withdraw your funds from an exchange.<br />
            The keystore file is 100% compatible with MyEtherWallet, MetaMask, Mist, and geth.
        </p>
    </div>
</template>

<script>
    export default {
        data: function () {
            return {
                scrollTimeOut: null,
            };
        },
        methods: {
            scrollDown() {
                this.scrollTo(document.getElementById('input-panel'), -1);
            },
            scrollTo(element, lastValue) {
                let currentValue = window.scrollY;
                let diff = element.getBoundingClientRect().top / 6;
                if (Math.abs(diff) > 1 && currentValue > lastValue) {
                    window.scrollTo(0, window.scrollY + diff);
                    this.scrollTimeOut = setTimeout(this.scrollTo, 30, element, currentValue);
                } else if (currentValue >= lastValue) {
                    document.getElementById('input').focus();
                }
            },
        },
    };
</script>

<style lang="sass" scoped>
    @import "../css/variables"
    p, .p
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
