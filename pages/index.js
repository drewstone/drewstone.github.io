import './index.css';
import React from 'react'
import Head from './components/head';
import Layout from './components/layout';

const Home = () => (
  <Layout>
    { Head('Home') }
    <div>
      <div>Home</div>
    </div>
  </Layout>
)

export default Home
