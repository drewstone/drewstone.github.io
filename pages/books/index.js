import React from 'react';
import Head from '../../components/head';
import Nav from '../../components/nav';
import Layout from '../../components/layout';
import { haveRead, amReading, planningToRead } from '../../components/readinglist';


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
                <input type="checkbox" checked={true} disabled readOnly/>
                Disabled grey boxes indicate books I've finished
              </div>
              <div className="description">
                <input type="checkbox" checked={true} readOnly/>
                Checked white boxes indicate books I'm currently reading
              </div>
              <div className="description">
                <input type="checkbox" readOnly/>
                Unchecked white boxes indicate books I hope to read soon
              </div>
              <ul className="pure-controls description">
                {
                  haveRead().map((book, inx) => (
                    <li className={"card-grey"} key={inx}>
                      <div className="pure-u-7-8">
                        <input id="cb" type="checkbox" checked={true} disabled readOnly/>
                        <label className="book-title">{book.title}</label>
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
                      <div className="pure-u-7-8">
                        <input id="cb" type="checkbox" checked={true} readOnly/>
                        <label className="book-title">{book.title}</label>
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
                  planningToRead().map((book, inx) => (
                    <li className="card" key={inx}>
                      <div className="pure-u-7-8">
                        <input id="cb" type="checkbox" readOnly/>
                        <label className="book-title">{book.title}</label>
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
      .hero {
        width: 100%;
        color: #333;
      }
      .title {
        margin: 0;
        width: 100%;
        padding-top: 20px;
        line-height: 1.15;
        font-size: 30px;
        text-align: center;
        font-family: 'Roboto Mono', monospace;
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
      ul {
        padding-left: 0px;
      }
      li {
        display: flex;
      }
      .book-title {
        width: 100%;
        font-family: 'Roboto Mono', monospace;
        margin-left: 10px;
      }
      .read-link {
        margin: -5px;
        border: thick solid #add8e6;
        border-radius: 5px;
        background-color: white;
        font-family: 'Roboto Mono', monospace;
      }
    `}</style>
  </Layout>
)

export default Books
