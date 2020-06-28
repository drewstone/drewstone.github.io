import React from 'react'
import { initGA, logPageView } from '../utils/analytics'
import { Container, Divider, Grid, Header, Image } from 'semantic-ui-react'

export default class Layout extends React.Component {
  componentDidMount () {
    if (!window.GA_INITIALIZED) {
      initGA()
      window.GA_INITIALIZED = true
    }
    logPageView()
  }
  render () {
    return (
      <Container>
        <Divider hidden/>
        <Header as='h2'>Drew Stone</Header>
        <Divider />
        {this.props.children}
      </Container>
    )
  }
}