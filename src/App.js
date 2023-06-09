import { Container } from '@chakra-ui/react'

import Home from './components/Home'

function App() {
  return (
    <div>
      <Container maxW="-moz-max-content" bg="black" justifyContent="stretch">
        <Home />
      </Container>
    </div>
  )
}

export default App
