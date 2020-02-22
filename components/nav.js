import React from 'react'
import Link from 'next/link'

const Nav = ({ hasFlex, links = [] }) => (
  <nav>
    <ul>
      {links.length > 0 && links.map(({ key, href, label }) => (
        <li key={key}>
          <Link href={href}>{label}</Link>
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
