import React from 'react'
import Head from 'next/head'

const Blog = () => (
  <div>
    <Head>
      <link rel="icon" href="/favicon.ico" />
      <link rel="stylesheet"
          href="https://unpkg.com/purecss@1.0.1/build/pure-min.css"
          integrity="sha384-oAOxQR6DkCoMliIh8yFnu25d7Eq/PHS21PClpwjOTeU2jRSq11vu66rf90/cZr47"
          crossorigin="anonymous" />
    </Head>
    <h1 className="title">Blog</h1>
  </div>
);

export default Blog;