<template>
    <div class="panel">
        <p>
            Vanity-ETH is a browser-based tool to generate Ethereum vanity addresses.
        </p>
        <h2>Usage</h2>
        <p>
            Enter the prefix of your choice below, then click 'generate' to start. You browser is going to generate a
            ton of random addresses until one of them starts with your prefix.<br>
            Once an address is found, you can reveal the private key, or click the 'save' button to download
            a password-encrypted keystore file.<br>
            You can increase the number of working threads to reach higher speeds, or decrease it if you computer
            struggles.<br>

        </p>
        <h2>Security</h2>
        <p>
            As explained above, everything is computed in your browser. Nothing ever leaves your machine, or
            even your browser tab.<br>
            Once the web page is loaded, you can turn off the internet and continue
            playing.<br>
            You can also download the latest build of Vanity-ETH on
            <a href="https://github.com/bokub/vanity-eth/wiki/download-Vanity-ETH" target="_blank">Github</a> and use it
            completely offline.<br>
            Vanity-ETH uses a cryptographically secure pseudorandom number generator (CSPRNG) to generate
            Ethereum addresses.<br>
            The keystore file is encrypted with a AES-128-CTR cipher using the BKDF2-SHA256 derivation function with 65536 hashing rounds.
        </p>
        <h2>Performance</h2>
        <p>
            For some reason, the performance of Vanity-ETH can vary a lot from a browser to another.<br>
            Right now, Chrome seems to be the one providing the best results.
        </p>
        <h2>Compatibility</h2>
        <p>
            All addresses generated with Vanity-ETH are ERC-20 compatible.<br>
            The keystore file is 100% compatible with MyEtherWallet, MetaMask, Mist, and geth.
        </p>
    </div>
</template>

<script>
    export default {}
</script>

<style lang="sass" scoped>
    @import "../css/variables"
    p
        margin: 15px 0 20px
        color: $grey-text
</style>