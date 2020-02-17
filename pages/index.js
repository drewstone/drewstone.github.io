import fetch from 'isomorphic-unfetch'
import React from 'react'
import Head from 'next/head'
import Nav from '../components/nav'

const formatLinks = (links) => {
  return links.map(link => ({
    ...link,
    key: `nav-link-${(link.href) ? link.href : ''}-${link.label}`,
  }));
}

const Home = () => (
  <div>
    <Head>
      <title>Home</title>
      <link rel="icon" href="/favicon.ico" />
      <link rel="stylesheet" href="https://unpkg.com/purecss@1.0.1/build/pure-min.css"
        integrity="sha384-oAOxQR6DkCoMliIh8yFnu25d7Eq/PHS21PClpwjOTeU2jRSq11vu66rf90/cZr47"
        crossorigin="anonymous" />
      <link href="https://fonts.googleapis.com/css?family=Roboto+Mono:400,500&display=swap" rel="stylesheet" />
    </Head>

    <div className="hero">
      <div className="row">
        <div className="pure-g">
          <h1 className="title">Welcome</h1>
          <div className="pure-u-1-4">
            <Nav links={formatLinks([])} hasFlex={false}/>
          </div>
          <div className="pure-u-1-2">
            <div className="row-content">
              <p className="description">
                <b>ME:</b> Hi, I'm Drew Stone. Here you'll find some thoughts, books I'm reading,
                and random things in my life.
              </p>
            </div>
            <div className="row-content">
              <p className="description">
                I enjoy reading books, running, cooking, and eating sushi. I work remotely and am
                learning to embrace a more nomadic lifestyle. I find traveling to be an immensely
                liberating way of life.
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

export default Home
