const path = require('path');
const prettier = require('prettier');

module.exports = {
    publicPath: '',
    chainWebpack: (config) => {
        // Worker Loader
        config.module
            .rule('worker')
            .test(/vanity\.js$/)
            .use('worker-loader')
            .loader('worker-loader')
            .options({
                inline: 'no-fallback',
                filename: 'vanity.js',
            })
            .end();
    },
    configureWebpack: {
        plugins: process.env.DEPLOY
            ? [
                  new (require('prerender-spa-plugin'))({
                      staticDir: path.join(__dirname, 'dist'),
                      routes: ['/'],
                      postProcess(renderedRoute) {
                          renderedRoute.html = prettier
                              .format(renderedRoute.html, { filepath: 'index.html', printWidth: 120 })
                              .replace('render', 'prerender')
                              .replace(/(data-v-[0-9a-f]+)=""/gm, '$1');
                          return renderedRoute;
                      },
                  }),
              ]
            : [],
    },
};
