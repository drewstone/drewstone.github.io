import fetch from 'isomorphic-unfetch';
import React from 'react';
import Head from 'next/head';
import Nav from '../../components/nav';

const formatLinks = (links) => {
  return links.map(link => ({
    ...link,
    key: `nav-link-${(link.href) ? link.href : ''}-${link.label}`,
  }));
}

const Work = () => (
  <div>
    <Head>
      <title>Work</title>
      <link rel="icon" href="/favicon.ico" />
      <link rel="stylesheet" href="https://unpkg.com/purecss@1.0.1/build/pure-min.css"
        integrity="sha384-oAOxQR6DkCoMliIh8yFnu25d7Eq/PHS21PClpwjOTeU2jRSq11vu66rf90/cZr47"
        crossorigin="anonymous" />
      <link href="https://fonts.googleapis.com/css?family=Roboto+Mono:400,500&display=swap" rel="stylesheet" />
    </Head>

    <div className="hero">
      <div className="row">
        <div className="pure-g">
          <h1 className="title">Work</h1>
          <div className="pure-u-1-4">
            <Nav links={formatLinks([])} hasFlex={false}/>
          </div>
          <div className="pure-u-1-2">
            <div className="row-content">
              <p className="description">
                <b>WORK:</b> Currently, I am the CTO and a cofounder of <a href="https://commonwealth.im">Commonwealth Labs</a>.
                I am also the technical lead and project maintainer of <a href="https://edgewa.re">Edgeware</a>.
              </p>
            </div>
            <div className="row-content">
              <p className="description">
                I spend some time building privacy focused applications for blockchains, integrating zero knowledge tools
                into smart contracts and blockchain runtimes. I'm interested in using blockchains to <i><b>"act"</b></i> anonymously
                from mixing tokens to voting to creating social content.
              </p>
            </div>
          </div>
          <div className="pure-u-1-4"></div>
        </div>
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
        text-align: center;
        font-family: 'Roboto Mono', serif;
        letter-spacing: 0px;
      }
      .description {
        text-align: left;
        font-family: 'Roboto Mono', monospace;
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

export default Work
