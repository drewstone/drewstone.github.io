import React from 'react'
import Link from 'next/link'

const formatLinks = (links) => {
  return links.map(link => ({
    ...link,
    key: `nav-link-${(link.href) ? link.href : ''}-${link.label}`,
  }));
}

const Nav = ({ hasFlex, links = [] }) => (
  <nav>
    <ul>
      {links.length > 0 && links.map(({ key, href, label }) => (
        <li key={key}>
          <Link href={href}>
            <a>{label}</a>
          </Link>
        </li>
      ))}
    </ul>

    <style jsx>{`
      nav {
        text-align: center;
      }
      ul {
        justify-content: center;
        ${hasFlex ? 'display: flex;': ''}
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

const getNav = (hasFlex) => {
  return (
    <Nav links={formatLinks([
      { href: '/', label: 'Home' },
      { href: '/books', label: 'Books' },
      { href: '/work', label: 'Work'},
      { href: '/research', label: 'Research'}
    ])} hasFlex={hasFlex}/>
  );
}
export default getNav;

