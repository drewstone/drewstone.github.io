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

const Books = () => (
  <div>
    <Head>
      <title>Books</title>
      <link rel="icon" href="/favicon.ico" />
      <link rel="stylesheet" href="https://unpkg.com/purecss@1.0.1/build/pure-min.css"
        integrity="sha384-oAOxQR6DkCoMliIh8yFnu25d7Eq/PHS21PClpwjOTeU2jRSq11vu66rf90/cZr47"
        crossorigin="anonymous" />
      <link href="https://fonts.googleapis.com/css?family=Roboto+Mono:400,500&display=swap" rel="stylesheet" />
    </Head>

    <div className="hero">
      <div className="row">
        <div className="pure-g">
          <h1 className="title">Books</h1>
          <div className="pure-u-1-4">
            <Nav links={formatLinks([
              { href: '/', label: 'Home' },
              { href: '/books', label: 'Books' },
              { href: '/work', label: 'Work'},
              { href: '/research', label: 'Research'}
            ])} hasFlex={false}/>
          </div>
          <div className="pure-u-3-4">
            <div className="row-content">
              <p className="description">
                Here you can find what I've read and am currently reading, this list starts from the year 2020.
                Books that I am currently reading are checked, while books that I have finished are greyed out.
              </p>
              <ul>
                <li>
                  <a>2020</a>
                </li>
              </ul>
              <ul className="pure-controls">
                {
                  [{
                    book: 'Wild Sheep Chase',
                    reading: true,
                    finished: true,
                  }, {
                    book: 'The Jew and The Lotus',
                    reading: true,
                    finished: true,
                  }, {
                    book: 'Joyful Wisdom',
                    reading: true,
                    finished: true,
                  }, {
                    book: 'What I Talk About When I Talk About Running',
                    reading: true,
                    finished: true,
                  }, {
                    book: 'Exhalation',
                    reading: true,
                    finished: true,
                  }, {
                    book: 'The Pisces',
                    reading: true,
                    finished: true,
                  }, {
                    book: 'Man\'s Search for Meaning (audio)',
                    reading: true,
                    finished: true,
                  }, {
                    book: 'Principles (audio)',
                    reading: true,
                    finished: true,
                  }, {
                    book: 'How to Change Your Mind',
                    reading: true,
                    finished: true,
                  }, {
                    book: 'Killing Comendator',
                    reading: true,
                    finished: false,
                  }, {
                    book: 'Shrinks (audio)',
                    reading: true,
                    finished: false,
                  }, {
                    book: 'Adaptive Markets (audio)',
                    reading: true,
                    finished: false,
                  }, {
                    book: 'Vagabonding: An Uncommon Guide to the Art of Long-Term World Travel',
                    reading: true,
                    finished: false,
                  }, {
                    book: 'Barbarian Days',
                    reading: false,
                    finished: false,
                  }, {
                    book: 'Radical Acceptance',
                    reading: false,
                    finished: false,
                  }, {
                    book: 'Good Profit',
                    reading: false,
                    finished: false,
                  }].map((elt, inx) => (
                    <li className={(elt.finished) ? "card-grey" : "card"} key={inx}>
                          <input id="cb" type="checkbox" checked={elt.reading}/>
                          {elt.book}
                    </li>
                  ))
                }
              </ul>
            </div>
          </div>
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
        padding: 9px 9px 12px;
        text-align: left;
        text-decoration: none;
        color: #434343;
        border: 1px solid #9b9b9b;
      }
      .card-grey {
        padding: 9px 9px 12px;
        text-align: left;
        text-decoration: none;
        background-color: #F0F0F0;
        border: 1px solid #9b9b9b;
      }
      .card:hover {
        border-color: #067df7;
      }
      .card-grey:hover {
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
      ul {
        padding-left: 0px;
      }
      li {
        display: flex;
        font-family: 'Roboto Mono', monospace;
      }
      input {
        float: left;
        margin-top: 5px;
        margin-right: 20px;
      }
      a {
        color: #067df7;
        text-decoration: none;
        font-size: 20px;
      }
    `}</style>
  </div>
)

export default Books
