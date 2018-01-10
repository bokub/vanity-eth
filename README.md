# Vanity ETH

[![Build Status](https://travis-ci.org/bokub/vanity-eth.svg?branch=master)](https://travis-ci.org/bokub/vanity-eth)
[![Maintainability](https://api.codeclimate.com/v1/badges/818874f09ea56c310072/maintainability)](https://codeclimate.com/github/bokub/vanity-eth/maintainability)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)

Browser-based ETH vanity address generator

Just type [`git.io/veth`](https://git.io/veth) to use it ⚡️

## Local usage

If for any reason you don't want to use the version hosted by Github pages, download / clone the project and open `index.html` with your web browser.

⚠ For some reason, some browsers such as chrome disallow multi-thread computation when run from a local file.

## Local development

Install dependencies

```sh
npm i
npm i -g gulp
```

Run the watcher to compile while you code

```sh
gulp watch # or npm run-script watch
```
