import React from 'react';
import Head from 'next/head';
import ReactGA from 'react-ga';

const Header = (title) => (
  <Head>
    <title>{title}</title>
    <link rel="icon" href="/favicon.ico" />
    <link rel="stylesheet" href="https://unpkg.com/purecss@1.0.1/build/pure-min.css"
      integrity="sha384-oAOxQR6DkCoMliIh8yFnu25d7Eq/PHS21PClpwjOTeU2jRSq11vu66rf90/cZr47"
      crossOrigin="anonymous" />
    <link href="https://fonts.googleapis.com/css?family=Roboto+Mono&display=swap" rel="stylesheet" />
  </Head>
);

export default Header;
