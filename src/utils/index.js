import { Buffer } from 'buffer'

import { POOL_CREATED_EVENT_KEY } from '../constants'

export const addressTruncator = (address) => {
  let _address = address.substring(0, 10)
  return _address
}

export function feltToString(felt) {
  const newStrB = Buffer.from(felt.toString(16), 'hex')
  return newStrB.toString()
}

export function stringToFelt(str) {
  return '0x' + Buffer.from(str).toString('hex')
}

export class SuperToken {
  contract

  constructor(contract) {
    this.contract = contract
  }

  // View Functions
  async decimals() {
    let decimals = await this.contract.decimals()
    decimals = decimals.decimals.toNumber()
    return decimals
  }

  async balance(account) {
    let balance = await this.contract.balanceOf(account)
    balance = balance.balance.toNumber()
    console.log(balance)
    return balance
  }

  async getNetFlowRate(account) {
    const netFlowRate = await this.contract.getNetFlowRate(account)
    const flowRate = netFlowRate.flow_rate.toNumber()
    return flowRate
  }

  async getFlowRate(from, to, flowId) {
    const flowRate = await this.contract.getFlowRate(from, to, flowId)
    const _flowRate = flowRate.flow_rate.toNumber()
    return _flowRate
  }

  async isMemberConnected(poolAddress, account) {
    let connected = await this.contract.isMemberConnected(poolAddress, account)
    connected = connected.success.toNumber()
    console.log(poolAddress, account, connected)
    const success = connected === 1 ? true : false
    return success
  }

  async getNumConnections(account) {
    let count = await this.contract.getNumConnections(account)
    count = count.value.toNumber()
    return count
  }

  // External Funtions

  async approve(spender, amount) {
    const response = await this.contract.approve(spender, amount)
    return response
  }

  async increaseAllowance(spender, added_value) {
    const response = await this.contract.increase_allowance(
      spender,
      added_value,
    )
    return response
  }

  async decreaseAllowance(spender, subtracted_value) {
    const response = await this.contract.decrease_allowance(
      spender,
      subtracted_value,
    )
    return response
  }

  async mint(recipient, amount) {
    const response = await this.contract.mint(recipient, amount)
    return response
  }

  async transfer(recipient, amount) {
    const response = await this.contract.transfer(recipient, amount)
    return response
  }

  async transferFrom(account, sender, recipient, amount) {
    this.contract.connect(account)
    const response = await this.contract.transferFrom(sender, recipient, amount)
    return response
  }

  async shift(sender, recipient, amount) {
    const response = await this.contract.shift(sender, recipient, amount)
    return response
  }

  async createFlow(sender, recipient, flowId, flow_rate) {
    const response = await this.contract.flow(
      sender,
      recipient,
      flowId,
      flow_rate,
    )
    return response
  }

  async deleteFlow(sender, recipient, flowId) {
    const response = await this.contract.flow(sender, recipient, flowId, 0)
    return response
  }

  async createPool(provider) {
    const response = await this.contract.createPool()
    const txReceipt = await provider.waitForTransaction(
      response.transaction_hash,
    )
    let event = {}
    txReceipt.events.forEach((element) => {
      const found = element.keys.find(
        (element) => element === POOL_CREATED_EVENT_KEY,
      )
      if (found) {
        event = element
      }
    })
    if (event.data) {
      return event.data[1]
    } else {
      return
    }
  }

  async distribute(sender, poolAddress, amount) {
    const response = await this.contract.distribute(sender, poolAddress, amount)
    return response
  }

  async distributeFlow(sender, poolAddress, flowId, flowRate) {
    const response = await this.contract.distributeFlow(
      sender,
      poolAddress,
      flowId,
      flowRate,
    )
    return response
  }

  async connectPool(poolAddress) {
    const response = await this.contract.connectPool(poolAddress)
    return response
  }

  async disconnectPool(poolAddress) {
    const response = await this.contract.disconnectPool(poolAddress)
    return response
  }
}

export class Pool {
  contract

  constructor(contract) {
    this.contract = contract
  }

  async getUnits(account) {
    let units = await this.contract.getUnits(account)
    units = units.value.toNumber()
    return units
  }

  async getDisconnectedUnits() {
    let units = await this.contract.getDisconnectedUnits()
    console.log(units)
    units = units.unit.toNumber()
    return units
  }

  async getDistributionFlowRate() {
    let flowRate = await this.contract.getDistributionFlowRate()
    flowRate = flowRate.flow_rate.toNumber()
    return flowRate
  }

  async getTotalUnits() {
    let units = await this.contract.getTotalUnits()
    units = units.value.toNumber()
    return units
  }

  // External Funtions

  async updateMember(member, unit) {
    const response = await this.contract.updateMember(member, unit)
    return response
  }
}
