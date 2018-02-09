# Vanity-ETH

[![Build Status](https://travis-ci.org/bokub/vanity-eth.svg?branch=master)](https://travis-ci.org/bokub/vanity-eth)
[![Maintainability](https://api.codeclimate.com/v1/badges/818874f09ea56c310072/maintainability)](https://codeclimate.com/github/bokub/vanity-eth/maintainability)

Browser-based ETH vanity address generator

Just type [`git.io/veth`](https://git.io/veth) to use it ⚡️


## Usage

First of all, visit [`git.io/veth`](https://git.io/veth)

Enter the prefix of your choice, then click 'generate' to start.

Ethereum addresses are hexadecimal, which means your prefix can only contain numbers and letters from A to F.

You can increase the number of threads allocated to address generation to be faster, or decrease it if you computer struggles.


## How it works

You browser is going to generate a ton of random addresses until one of them starts with your prefix.

Everything is computed by your browser, so you should notice a better speed on a powerful computer.


## Security

As explained above, everything is computed in your browser. Nothing ever leaves your machine, or even your browser tab.

You can download the latest build of Vantiy-ETH from Github and use it completely offline.

Vanity-ETH uses a cryptographically secure pseudorandom number generator (CSPRNG) to generate Ethereum addresses.


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

Build the project

```sh
npm run build
```

The Travis CI bot is in charge of building and deploying Vanity-ETH to Github pages.
