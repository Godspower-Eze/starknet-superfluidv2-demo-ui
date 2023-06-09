import { Box, Button, Text, Link } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { connect, disconnect } from 'get-starknet'
import { Contract } from 'starknet'
import { Routes, Link as RouterLink, Route } from 'react-router-dom'

import { addressTruncator } from '../utils'
import { SUPERTOKEN_ABI, SUPERTOKEN_CONTRACT_ADDRESS } from '../constants'
import Pool from './Pool'
import Admin from './Admin'

function Home() {
  const [balance, setBalance] = useState(0)
  const [tokenContract, setSuperTokenContract] = useState('')
  const [account, setAccount] = useState('')
  const [address, setAddress] = useState('')
  const [trimmedAddress, setTrimmedAddress] = useState('')
  const [connected, setConnected] = useState(false)

  /**
   * Handles getting balance of the connected
   * user as soon as the contract is set, account
   * is changed or address is changed
   */
  useEffect(() => {
    const updateTokenInfo = async () => {
      if (tokenContract !== '') {
        const balance = await getTokenBalance(tokenContract, address)
        setBalance(balance)
      }
    }
    updateTokenInfo()
  }, [tokenContract, account, address])

  /**
   * Handles setting contract when account is set or changed
   */
  useEffect(() => {
    if (account !== '') {
      const tokenContract = new Contract(
        SUPERTOKEN_ABI,
        SUPERTOKEN_CONTRACT_ADDRESS,
        account,
      )
      setSuperTokenContract(tokenContract)
    }
  }, [account])

  /**
   * Handles wallet connection
   */
  const connectWallet = async () => {
    try {
      const starknet = await connect()
      if (!starknet.isConnected) {
        await starknet.enable({ starknetVersion: 'v4' })
        setAccount(starknet.account)
        setAddress(starknet.account.address)
        setConnected(true)
        const truncatedAddress = addressTruncator(starknet.account.address)
        setTrimmedAddress(truncatedAddress)
      } else {
        setAccount(starknet.account)
        setAddress(starknet.account.address)
        setConnected(true)
        const truncatedAddress = addressTruncator(starknet.account.address)
        setTrimmedAddress(truncatedAddress)
      }
    } catch (err) {
      alert(err.message)
    }
  }

  setInterval(async () => {
    if (tokenContract !== '') {
      const _balance = await getTokenBalance(tokenContract, address)
      setBalance(_balance)
    }
  }, 50000)

  return (
    <div className="Home">
      <Box height="container.xl" display="flex">
        <Box
          width="20%"
          minWidth="250"
          maxWidth="250"
          borderRight="1px"
          borderRightColor="GrayText"
          color="white"
        >
          <Text fontSize="28" marginTop="10" marginLeft="7">
            Superfluid v2
          </Text>
          <Box>
            <Text fontSize="20" marginTop="10" marginLeft="12">
              <Link color="teal.500" as={RouterLink} to="/">
                Admin
              </Link>
            </Text>
            <Text fontSize="20" marginTop="10" marginLeft="12">
              <Link color="teal.500" as={RouterLink} to="/pools">
                Pools
              </Link>
            </Text>
          </Box>
        </Box>
        <Box width="80%">
          <Box height="120">
            {connected ? (
              <Text
                float="left"
                fontSize="1xl"
                color="white"
                fontWeight="extrabold"
                marginLeft="12"
                marginTop="12"
              >
                Balance: {balance}
              </Text>
            ) : (
              ''
            )}
            {!connected ? (
              <Button
                onClick={() => connectWallet()}
                padding={5}
                marginTop="10"
                marginRight="10"
                float="right"
              >
                Connect Wallet
              </Button>
            ) : (
              <Button padding={5} marginTop="10" marginRight="10" float="right">
                <Text>{trimmedAddress}</Text>
              </Button>
            )}
          </Box>
          <Box height="120" padding={10}>
            <Routes>
              <Route
                path="/"
                element={<Admin connected={connected} provider={account} />}
              ></Route>
              <Route
                path="/pools"
                element={<Pool connected={connected} provider={account} />}
              ></Route>
            </Routes>
          </Box>
        </Box>
      </Box>
    </div>
  )
}

const getTokenBalance = async (_contract, _account) => {
  try {
    const balance = await _contract.balanceOf(_account)
    const _balance = balance.balance
    return _balance.toString()
  } catch (err) {
    console.error(err)
    return 0
  }
}

export default Home
