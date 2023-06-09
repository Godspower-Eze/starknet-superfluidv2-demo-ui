import {
  Box,
  Button,
  Text,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Contract } from 'starknet'
import { v4 as uuidv4 } from 'uuid'

import {
  BACKEND_URL,
  POOL_ABI,
  SUPERTOKEN_ABI,
  SUPERTOKEN_CONTRACT_ADDRESS,
} from '../constants'
import { Pool as PoolClass, SuperToken, addressTruncator } from '../utils'

function Pool({ connected, provider }) {
  const [pools, setPools] = useState([])

  useEffect(() => {
    const getPools = async () => {
      const response = await fetch(`${BACKEND_URL}/pools/`)
      const savedPools = await response.json()
      const poolObjects = await _getPools(savedPools)
      setPools(poolObjects)
    }

    const _getPools = async (pools) => {
      const poolObjects = []
      for (const pool of pools) {
        const poolContract = new Contract(POOL_ABI, pool.address, provider)
        const poolClassInstance = new PoolClass(poolContract)
        console.log(poolContract)
        const units = await poolClassInstance.getUnits(provider.address)        
        const pendingUnits = await poolClassInstance.getDisconnectedUnits()
        const distributionFlowRate = await poolClassInstance.getDistributionFlowRate()
        const totalUnits = await poolClassInstance.getTotalUnits()
        const tokenContract = new Contract(
          SUPERTOKEN_ABI,
          SUPERTOKEN_CONTRACT_ADDRESS,
          provider,
        )
        const superTokenInstance = new SuperToken(tokenContract)
        let memberConnected = await superTokenInstance.isMemberConnected(
          pool.address,
          provider.address,
        )
        const poolObject = {
          truncatedAddress: `${addressTruncator(pool.address)}...`,
          address: pool.address,
          units,
          pendingUnits,
          distributionFlowRate,
          totalUnits,
          memberConnected,
        }
        poolObjects.push(poolObject)
      }
      return poolObjects
    }

    if (connected) {
      getPools()
    }
  }, [connected])

  const disconnectPool = async (poolAddress) => {
    const tokenContract = new Contract(
      SUPERTOKEN_ABI,
      SUPERTOKEN_CONTRACT_ADDRESS,
      provider,
    )
    const superTokenInstance = new SuperToken(tokenContract)
    await superTokenInstance.disconnectPool(poolAddress)
  }

  const connectPool = async (poolAddress) => {
    const tokenContract = new Contract(
      SUPERTOKEN_ABI,
      SUPERTOKEN_CONTRACT_ADDRESS,
      provider,
    )
    const superTokenInstance = new SuperToken(tokenContract)
    await superTokenInstance.connectPool(poolAddress)
  }

  return (
    <div className="Pool">
      <Box>
        <Text
          fontWeight="extrabold"
          fontSize="2xl"
          paddingLeft="5"
          paddingBottom="5"
          color="white"
        >
          Pools
        </Text>
        <TableContainer textColor="whatsapp.100">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Address</Th>
                <Th>Distribution Flow Rate</Th>
                <Th>Units</Th>
                <Th>Disconnected Units</Th>
                <Th>Total Units</Th>
                <Th isNumeric>Connect/Disconnect</Th>
              </Tr>
            </Thead>
            <Tbody>
              {pools.map((value) => {
                return (
                  <Tr key={uuidv4()}>
                    <Td>{value.truncatedAddress}</Td>
                    <Td>{value.distributionFlowRate}</Td>
                    <Td>{value.units}</Td>
                    <Td>{value.pendingUnits}</Td>
                    <Td>{value.totalUnits}</Td>
                    <Td isNumeric>
                      {value.memberConnected ? (
                        <Button
                          onClick={() => disconnectPool(value.address)}
                          padding={5}
                          colorScheme="teal"
                        >
                          Disconnect
                        </Button>
                      ) : (
                        <Button
                          onClick={() => connectPool(value.address)}
                          padding={5}
                          colorScheme="teal"
                        >
                          Connect
                        </Button>
                      )}
                    </Td>
                  </Tr>
                )
              })}
            </Tbody>
            <Tfoot>
              <Tr>
                <Th>Address</Th>
                <Th>Distribution Flow Rate</Th>
                <Th>Units</Th>
                <Th>Disconnected Units</Th>
                <Th>Total Units</Th>
                <Th isNumeric>Connect/Disconnect</Th>
              </Tr>
            </Tfoot>
          </Table>
        </TableContainer>
      </Box>
    </div>
  )
}

export default Pool
