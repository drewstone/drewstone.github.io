import React from 'react'
import Link from 'next/link'

const Nav = ({ hasFlex, links = [] }) => (
  <nav>
    <ul>
      <li>
        <Link href="/">
          <a>Home</a>
        </Link>ֿֿ
      </li>
      <li>
        <Link href="/work">
          <a>Work</a>
        </Link>
      </li>
      <li>
        <Link href="/academia">
          <a>Academia</a>
        </Link>
      </li>
      {links.length > 0 && links.map(({ key, href, label }) => (
        <li key={key}>
          <a href={href}>{label}</a>
        </li>
      ))}
    </ul>

    <style jsx>{`
      nav {
        text-align: center;
      }
      ul {
        ${hasFlex ? 'display: flex;': ''}
        margin-left: 20%;
      }
      nav > ul {
        padding: 4px 16px;
      }
      li {
        display: flex;
        padding: 6px 8px;
        font-family: 'Roboto Mono', monospace;
      }
      a {
        color: #067df7;
        text-decoration: none;
        font-size: 20px;
      }
    `}</style>
  </nav>
)

export default Nav
