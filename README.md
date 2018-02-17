# Vanity-ETH

[![Build Status](https://travis-ci.org/bokub/vanity-eth.svg?branch=master)](https://travis-ci.org/bokub/vanity-eth)
[![Maintainability](https://api.codeclimate.com/v1/badges/818874f09ea56c310072/maintainability)](https://codeclimate.com/github/bokub/vanity-eth/maintainability)

Browser-based ETH vanity address generator

Just type [`git.io/veth`](https://git.io/veth) to use it ⚡️

[![Vanity-ETH](https://i.imgur.com/hxgxohl.png)](https://git.io/veth)


## Usage

First of all, visit [`git.io/veth`](https://git.io/veth)

Enter the prefix of your choice, then click 'generate' to start.

You browser is going to generate a ton of random addresses until one of them starts with your prefix.

Ethereum addresses are hexadecimal, which means your prefix can only contain numbers and letters from A to F.

 You can increase the number of working threads to reach higher speeds, or decrease it if you computer struggles.

## Security

As explained above, everything is computed in your browser. Nothing ever leaves your machine, or even your browser tab.

You can download the latest build of Vantiy-ETH from Github and use it completely offline.

Vanity-ETH uses a cryptographically secure pseudorandom number generator (CSPRNG) to generate Ethereum addresses.


## Performance

For some reason, the performance of Vanity-ETH can vary a lot from a browser to another.
 
Right now, Chrome seems to be the one providing the best results.


## Offline usage

Vanity-ETH works perfectly offline! Once the web page is loaded, you can turn off the internet and continue playing.

You can also download the latest build of Vanity-ETH, check out the [wiki page](https://github.com/bokub/vanity-eth/wiki/Download-Vanity-ETH)


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
