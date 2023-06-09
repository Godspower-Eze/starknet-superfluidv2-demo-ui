import { BN } from 'bn.js'

import SuperToken from './abis/SuperToken.json'
import Pool from './abis/Pool.json'

// Token ABI
export const SUPERTOKEN_ABI = SuperToken.abi
// Pool ABI
export const POOL_ABI = Pool.abi
// Token Contract Address
export const SUPERTOKEN_CONTRACT_ADDRESS =
  '0x517ce183b644b9f7484c498c7e9071542c724f999b9d815e1f9e5cc4c8617aa'
export const POOL_CREATED_EVENT_KEY =
  '0x27dd458d081c22bd6e76f4dddbc87f11e477b7c5823b13f147d45f91ec098ee'
// Token Decimal big number representaion using the BN.JS library
export const DECIMAL_USING_BNJS = new BN('1000000000000000000')

export const MINT_AMOUNT = new BN('1000000')

export const BACKEND_URL = 'https://superfluid-demo-backend-production.up.railway.app'
