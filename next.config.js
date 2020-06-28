const withPlugins = require('next-compose-plugins');
const withCSS = require('@zeit/next-css')
const images = require('remark-images')
const emoji = require('remark-emoji')

const isProd = (process.env.NODE_ENV || 'production') === 'production'
const withMDX = require('@next/mdx')({
  extension: /\.(md|mdx)$/,
  options: {
    mdPlugins: [images, emoji]
  }
});

module.exports = withPlugins([
  [withCSS],
  [withMDX, {
    pageExtensions: ['js', 'jsx', 'mdx'],
    assetPrefix: isProd ? '/' : '',
  }],
]);