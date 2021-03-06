import { createSlice } from '@reduxjs/toolkit'
import { oddEvenContractAddress } from '../utils/constants'
import { getChainx } from '../services/chainx'
import { stringCamelCase } from '@chainx/util'
import { parseValue, contractAbi } from '../utils/contract'
import { parseParams } from '../utils/contractHelper'
import { testNetAddrToMain } from '../utils'

export const betStatusEnum = {
  ON: 'betting', // 投注中
  FILL: 'filled', // 已经开奖
  TO_FILL: 'toFill', // 停止投注，等待开奖
  CLOSE: 'close'
}

const initialState = {
  balance: 0,
  btcHeight: 627966,
  btcHeaderHash:
    '0000000000000000000ffba85d088a8640bd83785034727dc31d926ed41d87c2',
  betHeight: 0,
  maxBet: 10000000000,
  minBet: 100000000,
  status: betStatusEnum.CLOSE,
  rewarded: false,
  winValue: 0,
  bets: {
    odd: 0,
    even: 0
  },
  myBets: [],
  evenRankingList: [],
  oddRankingList: [],
  withdrawRecords: [] // 提现记录
}

const oddEvenSlice = createSlice({
  name: 'oddEven',
  initialState,
  reducers: {
    setBetHeight(state, { payload }) {
      state.betHeight = payload
    },
    setOddBets(state, { payload }) {
      state.bets.odd = payload
    },
    setEvenBets(state, { payload }) {
      state.bets.even = payload
    },
    setBets(state, { payload }) {
      state.myBets = payload
    },
    setNowBtc(state, { payload: { height, hash } }) {
      state.btcHeight = height
      state.btcHeaderHash = hash
    },
    setMaxBet(state, { payload }) {
      state.maxBet = payload
    },
    setMinBet(state, { payload }) {
      state.minBet = payload
    },
    setBetStatus(state, { payload }) {
      if (state.status !== betStatusEnum.FILL) {
        state.status = payload
      }
    },
    setRewarded(state, { payload: rewarded }) {
      state.rewarded = rewarded
      if (rewarded) {
        state.status = betStatusEnum.FILL
      }
    },
    setWinValue(state, { payload }) {
      state.winValue = payload
    },
    setEvenRankingList(state, { payload }) {
      state.evenRankingList = payload
    },
    setOddRankingList(state, { payload }) {
      state.oddRankingList = payload
    },
    setBalance(state, { payload }) {
      state.balance = payload
    },
    setWithdrawRecords(state, { payload }) {
      state.withdrawRecords = payload
    }
  }
})

export const {
  setBetHeight,
  setEvenBets,
  setOddBets,
  setBets,
  setNowBtc,
  setMaxBet,
  setMinBet,
  setBetStatus,
  setRewarded,
  setWinValue,
  setEvenRankingList,
  setOddRankingList,
  setBalance,
  setWithdrawRecords
} = oddEvenSlice.actions

async function contractGet(address, method, params = []) {
  parseParams(contractAbi.messages[stringCamelCase(method)].args, params)

  const chainx = getChainx()
  const result = await chainx.api.rpc.chainx.contractCall({
    origin: address,
    dest: oddEvenContractAddress,
    gasLimit: 5000000,
    inputData: contractAbi.messages[stringCamelCase(method)](...params)
  })

  return parseValue(
    contractAbi.messages[stringCamelCase(method)].type,
    result.data
  )
}

export const fetchBetBtcHeight = address => async dispatch => {
  const data = await contractGet(address, 'get_bet_block_height')
  dispatch(setBetHeight(data))
}

export const fetchBetStatus = address => async dispatch => {
  const started = await contractGet(address, 'is_game_start')
  if (started) {
    dispatch(setBetStatus(betStatusEnum.ON))
  }
}

export const fetchOddBets = address => async dispatch => {
  const data = await contractGet(address, 'get_odd_bet_balance')
  dispatch(setOddBets(data))
}

export const fetchEvenBets = address => async dispatch => {
  const data = await contractGet(address, 'get_even_bet_balance')
  dispatch(setEvenBets(data))
}

export const fetchMaxBet = address => async dispatch => {
  const data = await contractGet(address, 'get_max_bet')
  dispatch(setMaxBet(data))
}

export const fetchMinBet = address => async dispatch => {
  const data = await contractGet(address, 'get_min_bet')
  dispatch(setMinBet(data))
}

export const fetchBetRecords = address => async dispatch => {
  const bets = await contractGet(address, 'get_game_result_from_account', [
    address
  ])
  bets.sort((a, b) => b.start_time - a.start_time)
  dispatch(setBets(bets))
}

export const fetchIsRewarded = address => async dispatch => {
  const data = await contractGet(address, 'get_allot_reward ')
  dispatch(setRewarded(data))
}

export const fetchWinValue = address => async dispatch => {
  const data = await contractGet(address, 'get_lottery_result', [address])
  dispatch(setWinValue(data))
}

export const fetchEvenRankingList = address => async dispatch => {
  const data = await contractGet(address, 'get_even_ranking_list')
  dispatch(setEvenRankingList(data))
}

export const fetchOddRankingList = address => async dispatch => {
  const data = await contractGet(address, 'get_odd_ranking_list')
  dispatch(setOddRankingList(data))
}

export const fetchBalance = address => async dispatch => {
  const data = await contractGet(address, 'get_user_game_balance')
  dispatch(setBalance(data))
}

export const fetchWithdrawRecords = address => async dispatch => {
  const data = await contractGet(address, 'get_withdraw_history_from_account', [
    address
  ])
  dispatch(setWithdrawRecords(data))
}

export const fetchNowBtcStatus = () => async dispatch => {
  const useBtcMainNet = true

  const response = await window.fetch(
    `https://api.chainx.org.cn/bitx/${
      useBtcMainNet ? 'mainnet' : 'testnet'
    }/block/tip`
  )
  const result = await response.json()
  dispatch(setNowBtc({ height: result.height, hash: result.hash }))
}

export const nowBtcSelector = state => {
  return {
    height: state.oddEven.btcHeight,
    hash: state.oddEven.btcHeaderHash
  }
}

export const betStatusSelector = state => state.oddEven.status
export const betHeightSelector = state => state.oddEven.betHeight
export const betsSelector = state => state.oddEven.bets
export const myBetsSelector = state => state.oddEven.myBets
export const maxBetSelector = state => state.oddEven.maxBet
export const minBetSelector = state => state.oddEven.minBet
export const isRewardedSelector = state => state.oddEven.rewarded
export const winValueSelector = state => state.oddEven.winValue
export const oddRankingSelector = state => state.oddEven.oddRankingList
export const evenRankingSelector = state => state.oddEven.evenRankingList
export const oddEvenBalanceSelector = state => state.oddEven.balance
export const oddEvenWithdrawRecordsSelector = state => {
  const records = state.oddEven.withdrawRecords

  return records.map(record => ({
    ...record,
    dest_account: testNetAddrToMain(record.dest_account)
  }))
}

export default oddEvenSlice.reducer
