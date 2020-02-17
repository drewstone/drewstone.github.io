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

const Academia = () => (
  <div>
    <Head>
      <title>Academia</title>
      <link rel="icon" href="/favicon.ico" />
      <link rel="stylesheet" href="https://unpkg.com/purecss@1.0.1/build/pure-min.css"
        integrity="sha384-oAOxQR6DkCoMliIh8yFnu25d7Eq/PHS21PClpwjOTeU2jRSq11vu66rf90/cZr47"
        crossorigin="anonymous" />
      <link href="https://fonts.googleapis.com/css?family=Roboto+Mono:400,500&display=swap" rel="stylesheet" />
    </Head>

    <Nav links={formatLinks([
      { href: 'https://github.com/drewstone', label: 'Github' }
    ])} hasFlex={true} />

    <div className="hero">
      <div className="row">
        <div className="pure-g">
          <h1 className="title">Academia</h1>
          <div className="pure-u-1-4">
            <Nav links={formatLinks([])} hasFlex={false}/>
          </div>
          <div className="pure-u-1-2">
            <div className="row-content">
              <p className="description">
                <b>ACADEMIA:</b> I started and dropped my PhD at The Hebrew University of Jerusalem under Aviv Zohar.
                I studied mechanism design, voting theory, and adversarial behavior in cryptocurrency protocols.
              </p>
            </div>
            <div className="row-content">
              <p className="description">
                Prior, I finished my BSE in <a href="https://www.nets.upenn.edu/">NETS</a> and Masters at the University of Pennsylvania advised
                by <a href="https://www.cis.upenn.edu/~aaroth/">Aaron Roth</a> and <a href="https://www.cis.upenn.edu/~mkearns/">Michael Kearns</a> on
                the <b><i>Theoretical Foundations of Blockchain Protocols</i></b>.
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

export default Academia
