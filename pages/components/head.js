import React from 'react';
import Head from 'next/head';
import ReactGA from 'react-ga';

const Header = (title) => (
  <Head>
    <title>{title}</title>
    <link rel="icon" href="/favicon.ico" />
    <link rel="stylesheet" href="node_modules/modern-normalize/modern-normalize.css" />
    <link href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@300;400;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" />
  </Head>
);

export default Header;
