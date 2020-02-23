import React from 'react';
import Head from 'next/head';
import Nav from '../../components/nav';
import Layout from '../../components/layout';

const haveRead = () => ([
  { title: 'Wild Sheep Chase', href: 'https://www.amazon.com/Wild-Sheep-Chase-Novel/dp/037571894X' },
  { title: 'The Jew in the Lotus: A Poet\'s Rediscovery of Jewish Identity in Buddhist India', href: 'https://www.amazon.com/Jew-Lotus-Rediscovery-Identity-Buddhist-ebook/dp/B000Z4JQNS' },
  { title: 'Joyful Wisdom', href: 'https://www.amazon.com/Joyful-Wisdom-Embracing-Finding-Freedom/dp/B00262UAYQ' },
  { title: 'What I Talk About When I Talk About Running', href: 'https://www.amazon.com/What-Talk-About-When-Running/dp/0307389839' },
  { title: 'Exhalation', href: 'https://www.amazon.com/Exhalation-Stories-Ted-Chiang-ebook/dp/B07GD46PQZ' },
  { title: 'The Pisces', href: 'https://www.amazon.com/Pisces-Novel-Melissa-Broder-ebook/dp/B074LVLHF2' },
  { title: 'Man\'s Search for Meaning (audio)', href: 'https://www.amazon.com/Mans-Search-Meaning-Viktor-Frankl/dp/0807014273' },
  { title: 'Principles (audio)', href: 'https://www.amazon.com/Simon-Schuster-Audio-Principles-Life/dp/B074B2CZJG' },
  { title: 'How to Change Your Mind', href: 'https://www.amazon.com/Change-Your-Mind-Consciousness-Transcendence/dp/B07B1V3RF5' },
])

const amReading = () => ([
  { title: 'Killing Commendatore', href: 'https://www.amazon.com/dp/B079WM2HMV' },
  { title: 'Shrinks (audio)', href: 'https://www.amazon.com/dp/B00LLIJ0OC' },
  { title: 'Adaptive Markets (audio)', href: 'https://www.amazon.com/Adaptive-Markets-Financial-Evolution-Thought-ebook/dp/B07R4C6PDZ' },
  { title: 'Vagabonding: An Uncommon Guide to the Art of Long-Term World Travel', href: 'https://www.amazon.com/Vagabonding-Uncommon-Guide-Long-Term-Travel-ebook/dp/B000FBFMKM' },
]);

const planneingToRead = () => ([
  { title: 'Barbarian Days', href: 'https://www.amazon.com/dp/B00G3L6JMS' },
  { title: 'Radical Acceptance', href: 'https://www.amazon.com/Radical-Acceptance-Tara-Brach-ebook/dp/B000FC2NHG' },
  { title: 'Good Profit', href: 'https://www.amazon.com/Good-Profit-Creating-Successful-Companies-ebook/dp/B00TWEMGE8' },
  { title: 'The Coming Anarchy', href: 'https://www.theatlantic.com/magazine/archive/1994/02/the-coming-anarchy/304670/' },
  { title: 'The Long Boom: A History of the Future, 1980–2020', href: 'https://www.wired.com/1997/07/longboom/' },
  { title: 'Sources of the Self: The Making of the Modern Identity', href: 'https://www.amazon.com/Sources-Self-Making-Modern-Identity/dp/0674824261' }
]);

const Books = () => (
  <Layout>
    { Head('Books') }
    { Nav(true) }
    <div className="hero">
      <div className="row">
        <div className="pure-g">
          <h1 className="title">Books</h1>
          <div className="pure-u-1-1">
            <div className="row-content">
              <p className="description">
                Here you can find what I've read and am currently reading, this list starts from the year 2020.
              </p>
              <div className="description">
                <input id="cb" type="checkbox" checked={true} disabled readOnly/>
                Disabled grey boxes indicate books I've finished
              </div>
              <div className="description">
                <input id="cb" type="checkbox" checked={true} readOnly/>
                Checked white boxes indicate books I'm currently reading
              </div>
              <div className="description">
                <input id="cb" type="checkbox" readOnly/>
                Unchecked white boxes indicate books I hope to read soon
              </div>
              <ul>
                <li>
                  <a>2020</a>
                </li>
              </ul>
              <ul className="pure-controls">
                {
                  haveRead().map((book, inx) => (
                    <li className={"card-grey"} key={inx}>
                      <div className="book-title pure-u-7-8">
                      <input id="cb" type="checkbox" checked={true} disabled readOnly/>
                        {book.title}
                      </div>
                      <div className="pure-u-1-8">
                        <div className="read-link">
                          <center><a target="_blank" rel="noopener noreferrer" href={book.href}>Read</a></center>
                        </div>
                      </div>
                    </li>
                  ))
                }
                {
                  amReading().map((book, inx) => (
                    <li className="card" key={inx}>
                      <div className="book-title pure-u-7-8">
                      <input id="cb" type="checkbox" checked={true} readOnly/>
                        {book.title}
                      </div>
                      <div className="pure-u-1-8">
                        <div className="read-link">
                          <center><a target="_blank" rel="noopener noreferrer" href={book.href}>Read</a></center>
                        </div>
                      </div>
                    </li>
                  ))
                }
                {
                  planneingToRead().map((book, inx) => (
                    <li className="card" key={inx}>
                      <div className="book-title pure-u-7-8">
                        <input id="cb" type="checkbox" readOnly/>
                        {book.title}
                      </div>
                      <div className="pure-u-1-8">
                        <div className="read-link">
                          <center><a target="_blank" rel="noopener noreferrer" href={book.href}>Read</a></center>
                        </div>
                      </div>
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
        padding: 9px 9px 12px;
        text-align: left;
        text-decoration: none;
        color: #434343;
        border: 1px solid #9b9b9b;
      }
      .card-grey {
        padding: 9px 9px 9px;
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
      }
      .book-title {
        width: 100%;
        margin-right: 0.2rem;
      }
      .read {
        background-color: blue;
      }
      .read-link {
        margin: -5px;
        border: thick solid #add8e6;
        border-radius: 25px;
        background-color: white;
      }
    `}</style>
  </Layout>
)

export default Books
