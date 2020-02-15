import fetch from 'isomorphic-unfetch'
import React from 'react'
import Head from 'next/head'
import Nav from '../components/nav'

const topLevelLinks = () => {
  return [
    { href: 'https://github.com/drewstone', label: 'GitHub' },
  ].map(link => ({
    ...link,
    key: `nav-link-${link.href}-${link.label}`,
  }));
};

const Home = () => (
  <div>
    <Head>
      <title>Home</title>
      <link rel="icon" href="/favicon.ico" />
      <link rel="stylesheet"
        href="https://unpkg.com/purecss@1.0.1/build/pure-min.css"
        integrity="sha384-oAOxQR6DkCoMliIh8yFnu25d7Eq/PHS21PClpwjOTeU2jRSq11vu66rf90/cZr47"
        crossorigin="anonymous" />
    </Head>

    <Nav links={topLevelLinks()} hasFlex={true} />

    <div className="hero">
      <h1 className="title">A blog or personal site</h1>
      <p className="description">
        Hi, I'm Drew Stone.
      </p>

      <div class="pure-g">
        <div class="pure-u-1-4"><p></p></div>
        <div class="pure-u-1-2">
          <Nav links={topLevelLinks()} hasFlex={true}/>
        </div>
        <div class="pure-u-1-4"><p></p></div>
      </div>
    </div>

    <style jsx>{`
      .hero {
        width: 100%;
        color: #333;
      }
      .title {
        margin: 0;
        width: 100%;
        padding-top: 80px;
        line-height: 1.15;
        font-size: 30px;
      }
      .title,
      .description {
        text-align: center;
      }
      .row {
        max-width: 880px;
        margin: 80px auto 40px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
      }
      .card {
        padding: 18px 18px 24px;
        width: 220px;
        text-align: left;
        text-decoration: none;
        color: #434343;
        border: 1px solid #9b9b9b;
      }
      .card:hover {
        border-color: #067df7;
      }
      .card h3 {
        margin: 0;
        color: #067df7;
        font-size: 18px;
      }
      .card p {
        margin: 0;
        padding: 12px 0 0;
        font-size: 13px;
        color: #333;
      }
    `}</style>
  </div>
)

export default Home
