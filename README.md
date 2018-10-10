# Vanity-ETH

[![Build Status][build-img]][build-link]
[![License][license-img]][license-link]
[![Maintainability][maint-img]][maint-link]
![Visitors][visitors-img]

Browser-based ETH vanity address generator

Just type [`vanity-eth.tk`](https://vanity-eth.tk) to use it ⚡️

[![Vanity-ETH](https://i.imgur.com/zmSLeBP.png)](https://vanity-eth.tk)

## What's a vanity address?

A vanity address is an address which part of it is chosen by yourself, making it look less random.

Examples: `0xc0ffee254729296a45a3885639AC7E10F9d54979`, or `0x999999cf1046e68e36E1aA2E0E07105eDDD1f08E`

## Usage

First of all, visit [`vanity-eth.tk`](https://vanity-eth.tk)

Enter as short prefix/suffix of your choice at the bottom of the page, and click ‘generate’ to start. Your browser will
generate lots of random addresses until one matches your input.

Once an address is found, you can reveal the private key, or click the 'save' button to download a password-encrypted keystore file.

You can increase the number of working threads to reach higher speeds, or decrease it if you computer struggles.


## Security

As explained above, everything is computed only in your browser. Nothing ever leaves your machine, or even your browser tab.
There is no database, no server-side code. Everything vanishes when you close your tab.

**Vanity-ETH cannot and will never store your private key**, and if you don't trust it, you have 3 ways to ensure your key remains private:

- Once the web page is loaded, you can turn off the internet and continue playing, it will work seamlessly
- You can also download the latest build of Vanity-ETH [here](https://git.io/veth-dl)
and use it on a completely offline computer
- The code is 100% open source and available on Github. You can review it as much as you want before using it

Vanity-ETH uses a cryptographically secure pseudorandom number generator (CSPRNG) to generate Ethereum addresses.

The keystore file is encrypted with a AES-128-CTR cipher using the BKDF2-SHA256 derivation function with 65536 hashing rounds.


## Performance

For some reason, the performance of Vanity-ETH can vary a lot from a browser to another. 
Currently, Chrome provides the best results.

Using Vanity-ETH on your phone or tablet will work, but don't expect to reach the speed of a good old computer.


## Compatibility

Any address generated with Vanity-ETH is ERC-20 compatible, which means you can use it for an ICO, an airdrop, or just
to withdraw your funds from an exchange.

The keystore file is 100% compatible with MyEtherWallet, MetaMask, Mist, and geth.


## Local development

Install dependencies

```sh
npm i
```

Run the dev-sever while you code

```sh
npm run dev
```

Build the project (optional)

```sh
npm run build
```

The Travis CI bot 🤖 is in charge of building and deploying Vanity-ETH to Github pages.

## Tips

`0xAceBabe64807cb045505b268ef253D8fC2FeF5Bc`

[build-img]: https://flat.badgen.net/travis/bokub/vanity-eth
[build-link]: https://travis-ci.org/bokub/vanity-eth
[license-img]: https://flat.badgen.net/badge/license/MIT/orange
[license-link]: https://raw.githubusercontent.com/bokub/vanity-eth/master/LICENSE
[maint-img]: https://flat.badgen.net/codeclimate/maintainability/bokub/vanity-eth
[maint-link]: https://codeclimate.com/github/bokub/vanity-eth/maintainability
[visitors-img]: https://flat.badgen.net/runkit/vanity-eth-visits-oleal3y7ahxg
