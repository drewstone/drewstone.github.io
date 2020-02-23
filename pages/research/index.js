import fetch from 'isomorphic-unfetch';
import React from 'react';
import Head from 'next/head';
import Nav from '../../components/nav';

const Research = () => (
  <div>
    <Head>
      <title>Research</title>
      <link rel="icon" href="/favicon.ico" />
      <link rel="stylesheet" href="https://unpkg.com/purecss@1.0.1/build/pure-min.css"
        integrity="sha384-oAOxQR6DkCoMliIh8yFnu25d7Eq/PHS21PClpwjOTeU2jRSq11vu66rf90/cZr47"
        crossorigin="anonymous" />
      <link href="https://fonts.googleapis.com/css?family=Roboto+Mono:400,500&display=swap" rel="stylesheet" />
    </Head>
    { Nav(true) }
    <div className="hero">
      <div className="row">
        <div className="pure-g">
          <h1 className="title">Research</h1>
          <div className="pure-u-1-1">
            <div className="row-content">
              <p className="description">
                In 2018, I started and eventually dropped my PhD in Computer Science at The Hebrew University of Jerusalem under <a href="https://www.avivz.net/">Aviv Zohar</a>.
                I studied <b>mechanism design</b>, <b>voting theory</b>, and <b>adversarial behavior in cryptocurrency protocols</b>.
                I was particularly interested in incentive compatible, token weighted voting mechanisms for on-chain governance. However,
                I struggled to find incentive compatible parameter selection mechanisms. While my mechanisms did have nice properties even
                under rational deviations, I discontinued the research to focus on other interests. I still am interested in novel
                mechanisms for blockchain parameter selection and often think about the usefulness of learning theory and control theory
                in maintaing the stability of these systems in the presence of rational agents.
              </p>
            </div>
            <div className="row-content">
              <p className="description">
                I graduated from the University of Pennsylvania where I studied <a href="https://www.nets.upenn.edu/">NETS</a> and completed my
                Masters in mathematics under the advisors <a href="https://www.cis.upenn.edu/~aaroth/">Aaron Roth</a> and&nbsp;	 
                <a href="https://www.cis.upenn.edu/~mkearns/">Michael Kearns</a> on the <b>Theoretical Foundations of Blockchain Protocols</b>.
                The thesis blended topics from such as algebraic topology, the theory of consensus protocols, and ultimately game theory.
                My original contribution can be found in the paper <a href="https://arxiv.org/abs/1804.06836">Delayed Blockchain Protocols</a>,&nbsp;
                where I adapted traditional proof of work systems with a combination of delayed rewards and fraud proofs to disincentivize
                double-spend attacks with slashing penalties. I evaluated subgame perfect equilibria of my adapted mechanism and provided lower
                bounds on the profit for rational deviations for any arbitrary delayed reward.
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
  </div>
)

export default Research
