<template>
    <div class="panel">
        <p>
            Vanity-ETH is an open source tool using your web browser to generate Ethereum vanity addresses.
        </p>
        <h2>Usage</h2>
        <p>
            Enter the prefix of your choice below, then click 'generate' to start. Your browser is going to generate a
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
            <a href="https://git.io/veth-dl" target="_blank">Github</a> and use it
            completely offline.<br>
            Vanity-ETH uses a cryptographically secure pseudorandom number generator (CSPRNG) to generate
            Ethereum addresses.<br>
            The keystore file is encrypted with a AES-128-CTR cipher using the BKDF2-SHA256 derivation function with 65536 hashing rounds.
        </p>
        <h2>Performance</h2>
        <p>
            For some reason, the performance of Vanity-ETH can vary a lot from a browser to another. Right now, Chrome
            seems to be the one providing the best results.<br>
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
    export default {}
</script>

<style lang="sass" scoped>
    @import "../css/variables"
    p
        margin: 15px 0 20px
        color: $text-alt
</style>