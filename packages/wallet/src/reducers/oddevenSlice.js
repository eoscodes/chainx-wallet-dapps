import { createSlice } from '@reduxjs/toolkit'

export const betStatusEnum = {
  ON: 'betting', // 投注中
  FILL: 'filled', // 已经开奖
  TO_FILL: 'toFill', // 停止投注，等待开奖
  CLOSE: 'close'
}

const initialState = {
  btcHeight: 627966,
  btcHeaderHash:
    '0000000000000000000ffba85d088a8640bd83785034727dc31d926ed41d87c2',
  betHeight: 700000,
  dealHeight: 627992,
  status: betStatusEnum.ON,
  bets: {
    odd: 246382.72737627,
    even: 24632.72737627
  }
}

const oddEvenSlice = createSlice({
  name: 'oddEven',
  initialState,
  reducers: {}
})

export const nowBtcSelector = state => {
  return {
    height: state.oddEven.btcHeight,
    hash: state.oddEven.btcHeaderHash
  }
}

export const betStatusSelector = state => state.oddEven.status
export const betHeightSelector = state => state.oddEven.betHeight
export const betsSelector = state => state.oddEven.bets
export const dealHeightSelector = state => state.oddEven.dealHeight

export default oddEvenSlice.reducer