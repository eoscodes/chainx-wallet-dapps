import { createSlice } from 'redux-starter-kit'
import { getChainx } from '../services/chainx'

const xrcbtcSlice = createSlice({
  slice: 'xrcbtc',
  initialState: {
    info: null,
    balance: 0
  },
  reducers: {
    setBalance: {
      reducer(state, action) {
        state.balance = action.payload
      }
    },
    setInfo: {
      reducer(state, action) {
        state.info = action.payload
      }
    }
  }
})

export const { setBalance } = xrcbtcSlice.actions

export const fetchXrcBtcBalance = accountId => async dispatch => {
  const chainx = getChainx()

  const { data, status } = await chainx.api.rpc.chainx.contractXRC20Call({
    token: 'BTC',
    selector: 'BalanceOf',
    inputData: accountId
  })

  if (status === 0) {
    dispatch(setBalance(data))
  }
}

export const fetchXrcBtcInfo = () => async dispatch => {
  const chainx = getChainx()

  const info = await chainx.api.rpc.chainx.contractXRCTokenInfo()
  console.log('info', info)
}

export const xrcBtcBalanceSelector = state => state.xrcbtc.balance

export default xrcbtcSlice.reducer
