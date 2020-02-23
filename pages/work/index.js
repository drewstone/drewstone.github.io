import React from 'react';
import Head from '../../components/head';
import Nav from '../../components/nav';
import Layout from '../../components/layout';

const Work = () => (
  <Layout>
    { Head('Work') }
    { Nav(true) }
    <div className="hero">
      <div className="row">
        <div className="pure-g">
          <h1 className="title">Work</h1>
          <div className="pure-u-1-1">
            <div className="row-content">
              <p className="description">
                Currently, I am the CTO and a cofounder of <a href="https://commonwealth.im">Commonwealth Labs</a>.
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
        </div>
      </div>
    </div>

    <style jsx>{`
      html, button, input, select, textarea,
      .pure-g [class *= "pure-u"] {
          font-family: 'Roboto Mono', monospace;
      }
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
        margin: 20px auto 40px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
      }
      .row-content {
        margin: 0 0.5rem;
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
  </Layout>
)

export default Work
