import {
  Box,
  Button,
  Text,
  FormControl,
  Input,
  NumberInput,
  NumberInputField,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInputStepper,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Contract } from 'starknet'
import axios from 'axios'

import {
  BACKEND_URL,
  MINT_AMOUNT,
  POOL_ABI,
  SUPERTOKEN_ABI,
  SUPERTOKEN_CONTRACT_ADDRESS,
} from '../constants'
import { Pool as PoolClass, SuperToken } from '../utils'

function Admin({ connected, provider }) {
  const [createPoolObject, setCreatePoolObject] = useState({
    isLoading: false,
  })

  const [mintObject, setMintObject] = useState({
    amount: MINT_AMOUNT,
    isLoading: false,
  })

  const [createFlowObject, setCreateFlowObject] = useState({
    isLoading: false,
    isValid: false,
    account: '',
    flowRate: 0,
    flowID: 0,
  })

  const [updateMemberObject, setUpdateMemberObject] = useState({
    isLoading: false,
    isValid: false,
    poolAddress: '',
    account: '',
    unit: 0,
  })

  const [distributeObject, setDistributeObject] = useState({
    isLoading: false,
    isValid: false,
    poolAddress: '',
    amount: 0,
  })

  const [distributeFlowObject, setDistributeFlowObject] = useState({
    isLoading: false,
    isValid: false,
    poolAddress: '',
    flowRate: 0,
    flowID: 0,
  })

  /////////////////////////////////////////////////////
  ////////// MINT STARTS HERE /////
  ///////////////////////////////////////////////////
  const handleMint = async () => {
    setMintObject({ ...mintObject, isLoading: true })
    const tokenContract = new Contract(
      SUPERTOKEN_ABI,
      SUPERTOKEN_CONTRACT_ADDRESS,
      provider,
    )
    const superTokenInstance = new SuperToken(tokenContract)
    await superTokenInstance.mint(provider.address, mintObject.amount)
    setMintObject({ ...mintObject, isLoading: false })
  }
  /////////////////////////////////////////////////////
  ////////// MINT ENDS HERE /////
  ///////////////////////////////////////////////////

  /////////////////////////////////////////////////////
  ////////// CREATE POOL OPERATIONS STARTS HERE /////
  ///////////////////////////////////////////////////
  const handleCreatePool = async () => {
    setCreatePoolObject({ ...createPoolObject, isLoading: true })
    const tokenContract = new Contract(
      SUPERTOKEN_ABI,
      SUPERTOKEN_CONTRACT_ADDRESS,
      provider,
    )
    const superTokenInstance = new SuperToken(tokenContract)
    const poolAddress = await superTokenInstance.createPool(provider)
    axios
      .post(`${BACKEND_URL}/create_pool/`, {
        address: `${poolAddress}`,
        account: `${provider.address}`,
        token: `${SUPERTOKEN_CONTRACT_ADDRESS}`
      })
      .then((data) => {
        alert(data.data.address)
      })
    setCreatePoolObject({ ...createPoolObject, isLoading: false })
  }
  /////////////////////////////////////////////////////
  ////////// CREATE POOL OPERATIONS ENDS HERE /////
  ///////////////////////////////////////////////////

  /////////////////////////////////////////////////////
  ////////// UPDATE MEMBER OPERATIONS STARTS HERE /////
  ///////////////////////////////////////////////////

  useEffect(() => {
    if (
      updateMemberObject.poolAddress !== '' &&
      updateMemberObject.account !== '' &&
      updateMemberObject.unit > 0
    ) {
      setUpdateMemberObject(() => ({ ...updateMemberObject, isValid: true }))
    } else {
      setUpdateMemberObject(() => ({ ...updateMemberObject, isValid: false }))
    }
  }, [
    updateMemberObject.poolAddress,
    updateMemberObject.account,
    updateMemberObject.unit,
  ])

  const handlePoolAddressForUpdateMember = (event) => {
    const address = event.target.value
    if (address.length === 65) {
      setUpdateMemberObject({ ...updateMemberObject, poolAddress: address })
    } else {
      setUpdateMemberObject({ ...updateMemberObject, poolAddress: '' })
    }
  }

  const handleAccountForUpdateMember = (event) => {
    const account = event.target.value
    if (account.length === 66) {
      setUpdateMemberObject({ ...updateMemberObject, account })
    } else {
      setUpdateMemberObject({ ...updateMemberObject, account: '' })
    }
  }

  const handleUnitForUpdateMember = (value) => {
    const unit = parseInt(value)
    if (unit && unit > 0) {
      setUpdateMemberObject({ ...updateMemberObject, unit })
    } else {
      setUpdateMemberObject({ ...updateMemberObject, unit: 0 })
    }
  }

  const handleUpdateMember = async () => {
    setUpdateMemberObject({ ...updateMemberObject, isLoading: true })
    const poolContract = new Contract(
      POOL_ABI,
      updateMemberObject.poolAddress,
      provider,
    )
    const poolClassInstance = new PoolClass(poolContract)
    const response = await poolClassInstance.updateMember(
      updateMemberObject.account,
      updateMemberObject.unit,
    )
    alert(response.transaction_hash)
    setUpdateMemberObject({
      ...updateMemberObject,
      isLoading: false,
    })
  }
  /////////////////////////////////////////////////////
  ////////// UPDATE MEMBER OPERATIONS ENDS HERE /////
  ///////////////////////////////////////////////////

  /////////////////////////////////////////////////////
  ////////// CREATE FLOW OPERATIONS STARTS HERE /////
  ///////////////////////////////////////////////////

  useEffect(() => {
    if (
      createFlowObject.account !== '' &&
      createFlowObject.flowRate >= 0 &&
      createFlowObject.flowID >= 0
    ) {
      setCreateFlowObject({ ...createFlowObject, isValid: true })
    } else {
      setCreateFlowObject({ ...createFlowObject, isValid: false })
    }
  }, [
    createFlowObject.account,
    createFlowObject.flowRate,
    createFlowObject.flowID,
  ])

  const handleAccountForCreateFlow = (event) => {
    const address = event.target.value
    if (address.length === 66) {
      setCreateFlowObject({ ...createFlowObject, account: address })
    } else {
      setCreateFlowObject({ ...createFlowObject, account: '' })
    }
  }

  const handleFlowRateForCreateFlow = (value) => {
    const flowRate = parseInt(value)
    if (flowRate) {
      setCreateFlowObject({ ...createFlowObject, flowRate })
    } else {
      setCreateFlowObject({ ...createFlowObject, flowRate: 0 })
    }
  }

  const handleFlowIDForCreateFlow = (value) => {
    console.log(value)
    const flowID = parseInt(value)
    if (flowID) {
      setCreateFlowObject({ ...createFlowObject, flowID })
    } else {
      setCreateFlowObject({ ...createFlowObject, flowID: 0 })
    }
  }

  const handleCreateFlow = async () => {
    setCreateFlowObject({ ...createFlowObject, isLoading: true })
    const tokenContract = new Contract(
      SUPERTOKEN_ABI,
      SUPERTOKEN_CONTRACT_ADDRESS,
      provider,
    )
    const superTokenInstance = new SuperToken(tokenContract)
    const response = await superTokenInstance.createFlow(
      provider.address,
      createFlowObject.account,
      createFlowObject.flowID,
      createFlowObject.flowRate,
    )
    alert(response.transaction_hash)
    setCreateFlowObject({
      ...createFlowObject,
      isLoading: false,
    })
  }
  /////////////////////////////////////////////////////
  ////////// CREATE FLOW OPERATIONS ENDS HERE /////
  ///////////////////////////////////////////////////

  /////////////////////////////////////////////////////
  ////////// DISTRIBUTE OPERATIONS STARTS HERE /////
  ///////////////////////////////////////////////////

  useEffect(() => {
    if (distributeObject.poolAddress !== '' && distributeObject.amount > 0) {
      setDistributeObject({ ...distributeObject, isValid: true })
    } else {
      setDistributeObject({ ...distributeObject, isValid: false })
    }
  }, [distributeObject.poolAddress, distributeObject.amount])

  const handlePoolAddressForDistrubute = (event) => {
    const address = event.target.value
    if (address.length === 65) {
      setDistributeObject({ ...distributeObject, poolAddress: address })
    } else {
      setDistributeObject({ ...distributeObject, poolAddress: '' })
    }
  }

  const handleAmountForDistribute = (value) => {
    const amount = parseInt(value)
    if (amount && amount > 0) {
      setDistributeObject({ ...distributeObject, amount })
    } else {
      setDistributeObject({ ...distributeObject, amount: 0 })
    }
  }

  const handleDistribute = async () => {
    setDistributeObject({ ...distributeObject, isLoading: true })
    const tokenContract = new Contract(
      SUPERTOKEN_ABI,
      SUPERTOKEN_CONTRACT_ADDRESS,
      provider,
    )
    const superTokenInstance = new SuperToken(tokenContract)
    const response = await superTokenInstance.distribute(
      provider.address,
      distributeObject.poolAddress,
      distributeObject.amount,
    )
    alert(response.transaction_hash)
    setDistributeObject({
      ...distributeObject,
      isLoading: false,
    })
  }
  /////////////////////////////////////////////////////
  ////////// DISTRIBUTE OPERATIONS ENDS HERE /////
  ///////////////////////////////////////////////////

  /////////////////////////////////////////////////////
  ////////// DISTRIBUTE FLOW OPERATIONS STARTS HERE /////
  ///////////////////////////////////////////////////

  useEffect(() => {
    if (
      distributeFlowObject.poolAddress !== '' &&
      distributeFlowObject.flowRate > 0 &&
      distributeFlowObject.flowID >= 0
    ) {
      setDistributeFlowObject({ ...distributeFlowObject, isValid: true })
    } else {
      setDistributeFlowObject({ ...distributeFlowObject, isValid: false })
    }
  }, [
    distributeFlowObject.poolAddress,
    distributeFlowObject.flowRate,
    distributeFlowObject.flowID,
  ])

  const handlePoolAddressForDistrubuteFlow = (event) => {
    const address = event.target.value
    if (address.length === 65) {
      setDistributeFlowObject({ ...distributeFlowObject, poolAddress: address })
    } else {
      setDistributeFlowObject({ ...distributeFlowObject, poolAddress: '' })
    }
  }

  const handleFlowRateForDistributeFlow = (value) => {
    const flowRate = parseInt(value)
    if (flowRate && flowRate > 0) {
      setDistributeFlowObject({ ...distributeFlowObject, flowRate })
    } else {
      setDistributeFlowObject({ ...distributeFlowObject, flowRate: 0 })
    }
  }

  const handleFlowIDForDistributeFlow = (value) => {
    const flowID = parseInt(value)
    if (flowID) {
      setDistributeFlowObject({ ...distributeFlowObject, flowID })
    } else {
      setDistributeFlowObject({ ...distributeFlowObject, flowID: 0 })
    }
  }

  const handleDistributeFlow = async () => {
    setDistributeFlowObject({ ...distributeFlowObject, isLoading: true })
    const tokenContract = new Contract(
      SUPERTOKEN_ABI,
      SUPERTOKEN_CONTRACT_ADDRESS,
      provider,
    )
    const superTokenInstance = new SuperToken(tokenContract)
    const response = await superTokenInstance.distributeFlow(
      provider.address,
      distributeFlowObject.poolAddress,
      distributeFlowObject.flowID,
      distributeFlowObject.flowRate,
    )
    alert(response.transaction_hash)
    setDistributeFlowObject({
      ...distributeFlowObject,
      isLoading: false,
    })
  }
  /////////////////////////////////////////////////////
  ////////// DISTRIBUTE FLOW OPERATIONS ENDS HERE /////
  ///////////////////////////////////////////////////

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
          Mint
          <Button
            marginLeft="5"
            colorScheme={'yellow'}
            isDisabled={!connected ? true : false}
            isLoading={mintObject.isLoading}
            onClick={() => handleMint()}
          >
            Mint
          </Button>
        </Text>
      </Box>
      <Box>
        <Text
          fontWeight="extrabold"
          fontSize="2xl"
          paddingLeft="5"
          paddingBottom="5"
          color="white"
        >
          Create Pool
          <Button
            marginLeft="5"
            colorScheme={'yellow'}
            isDisabled={!connected ? true : false}
            isLoading={createPoolObject.isLoading}
            onClick={() => handleCreatePool()}
          >
            Create
          </Button>
        </Text>
      </Box>
      <Box>
        <Text
          fontWeight="extrabold"
          fontSize="2xl"
          paddingLeft="5"
          paddingBottom="2"
          color="white"
        >
          Update Member
        </Text>
        <FormControl paddingLeft="5" paddingBottom="2" textColor="white">
          <Input
            type="text"
            placeholder="Pool Address"
            bg="black"
            onChange={handlePoolAddressForUpdateMember}
          />
        </FormControl>
        <FormControl paddingLeft="5" paddingBottom="2" textColor="white">
          <Input
            type="text"
            placeholder="Account"
            bg="black"
            onChange={handleAccountForUpdateMember}
          />
        </FormControl>
        <FormControl paddingLeft="5" isRequired textColor="white">
          <NumberInput min={0} onChange={handleUnitForUpdateMember}>
            <NumberInputField placeholder="Enter Unit" />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <Button
          marginTop="5"
          colorScheme={'yellow'}
          isDisabled={!connected || !updateMemberObject.isValid ? true : false}
          isLoading={updateMemberObject.isLoading}
          onClick={() => handleUpdateMember()}
          float="right"
        >
          Update
        </Button>
      </Box>
      <Box marginTop="20">
        <Text
          fontWeight="extrabold"
          fontSize="2xl"
          paddingLeft="5"
          paddingBottom="5"
          color="white"
        >
          Create Flow
        </Text>
        <FormControl paddingLeft="5" paddingBottom="2" textColor="white">
          <Input
            type="text"
            placeholder="Account"
            bg="black"
            onChange={handleAccountForCreateFlow}
          />
        </FormControl>
        <FormControl
          paddingLeft="5"
          paddingBottom="2"
          isRequired
          textColor="white"
        >
          <NumberInput min={0} onChange={handleFlowIDForCreateFlow}>
            <NumberInputField placeholder="Enter Flow ID" />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <FormControl paddingLeft="5" isRequired textColor="white">
          <NumberInput min={0} onChange={handleFlowRateForCreateFlow}>
            <NumberInputField placeholder="Enter Flow Rate" />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <Button
          marginTop="5"
          colorScheme={'yellow'}
          isDisabled={!connected || !createFlowObject.isValid ? true : false}
          isLoading={createFlowObject.isLoading}
          onClick={() => handleCreateFlow()}
          float="right"
        >
          Create
        </Button>
      </Box>
      <Box marginTop="20">
        <Text
          fontWeight="extrabold"
          fontSize="2xl"
          paddingLeft="5"
          paddingBottom="5"
          color="white"
        >
          Distribute
        </Text>
        <FormControl paddingLeft="5" paddingBottom="2" textColor="white">
          <Input
            type="text"
            placeholder="Pool Address"
            bg="black"
            onChange={handlePoolAddressForDistrubute}
          />
        </FormControl>
        <FormControl paddingLeft="5" isRequired textColor="white">
          <NumberInput min={0} onChange={handleAmountForDistribute}>
            <NumberInputField placeholder="Enter Amount" />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <Button
          marginTop="5"
          colorScheme={'yellow'}
          isDisabled={!connected || !distributeObject.isValid ? true : false}
          isLoading={distributeObject.isLoading}
          onClick={() => handleDistribute()}
          float="right"
        >
          Distribute
        </Button>
      </Box>
      <Box marginTop="20">
        <Text
          fontWeight="extrabold"
          fontSize="2xl"
          paddingLeft="5"
          paddingBottom="5"
          color="white"
        >
          Distribute Flow
        </Text>
        <FormControl paddingLeft="5" paddingBottom="2" textColor="white">
          <Input
            type="text"
            placeholder="Pool Address"
            bg="black"
            onChange={handlePoolAddressForDistrubuteFlow}
          />
        </FormControl>
        <FormControl
          paddingLeft="5"
          paddingBottom="2"
          isRequired
          textColor="white"
        >
          <NumberInput min={0} onChange={handleFlowIDForDistributeFlow}>
            <NumberInputField placeholder="Enter Flow ID" />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <FormControl paddingLeft="5" isRequired textColor="white">
          <NumberInput min={0} onChange={handleFlowRateForDistributeFlow}>
            <NumberInputField placeholder="Enter Flow Rate" />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <Button
          marginTop="5"
          colorScheme={'yellow'}
          isDisabled={
            !connected || !distributeFlowObject.isValid ? true : false
          }
          isLoading={distributeFlowObject.isLoading}
          onClick={() => handleDistributeFlow()}
          float="right"
        >
          Distribute
        </Button>
      </Box>
    </div>
  )
}

export default Admin
