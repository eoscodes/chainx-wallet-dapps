import React, { useEffect, useState } from 'react'
import Wrapper from './Wrapper'
import { useDispatch, useSelector } from 'react-redux'
import {
  currentShowPriceSelector,
  minSellPriceSelector,
  pairAssetFreeSelector,
  pairAssetSelector,
  pairCurrencyPrecision,
  pairCurrencySelector,
  pairPrecisionSelector,
  pairShowPrecisionSelector
} from '../../../selectors'
import Free from '../components/Free'
import Label from '../components/Label'
import { AmountInput, Slider, DangerButton } from '@chainx/ui'
import { marks } from '../constants'
import { canRequestSign, retry, toPrecision } from '../../../../../../utils'
import { addressSelector } from '../../../../../../reducers/addressSlice'
import { isDemoSelector } from '../../../../../../selectors'
import BigNumber from 'bignumber.js'
import { Error } from '../Buy/Wrapper'
import {
  showSnack,
  signAndSendExtrinsic
} from '../../../../../../utils/chainxProvider'
import {
  currentPairIdSelector,
  fetchNowOrders,
  fetchQuotations
} from '../../../../../../reducers/tradeSlice'
import $t from '../../../../../../locale'
import { getChainx } from '../../../../../../services/chainx'
import infoIcon from '../../assets/info.svg'
import { PriceWrapper } from '../components/PriceWrapper'
import { accountIdSelector } from '../../../../../selectors/assets'
import EventEmitter, { events } from '../../../eventEmitter'
import { fetchAccountAssets } from '../../../../../../reducers/assetSlice'

export default function() {
  const accountId = useSelector(accountIdSelector)
  const address = useSelector(addressSelector)
  const pairPrecision = useSelector(pairPrecisionSelector)
  const { precision: assetPrecision = 0, free: assetFree = 0 } =
    useSelector(pairAssetFreeSelector) || {}
  const pairCurrency = useSelector(pairCurrencySelector)
  const pairAsset = useSelector(pairAssetSelector)
  const pairShowPrecision = useSelector(pairShowPrecisionSelector)
  const showPrice = useSelector(currentShowPriceSelector)

  const [price, setPrice] = useState('')
  const [initPairId, setInitPairId] = useState(null)
  const [amount, setAmount] = useState('0')

  const [percentage, setPercentage] = useState(0)
  const currencyPrecision = useSelector(pairCurrencyPrecision)
  const accountAddress = useSelector(addressSelector)
  const isDemoAddr = useSelector(isDemoSelector)

  const pairId = useSelector(currentPairIdSelector)

  useEffect(() => {
    if (initPairId !== pairId && showPrice) {
      setPrice(showPrice)
      setInitPairId(pairId)
    }
  }, [showPrice, pairId, initPairId])

  EventEmitter.subscribe(events.priceClicked, price => setPrice(price))

  const volume = Number(
    Number(amount) * Number(price).toFixed(currencyPrecision)
  )

  const [disabled, setDisabled] = useState(false)
  const dispatch = useDispatch()

  const [priceErrMsg, setPriceErrMsg] = useState('')
  const [amountErrMsg, setAmountErrMsg] = useState('')

  const minSellPrice = useSelector(minSellPriceSelector)
  const minSellShowPrice = Number(
    toPrecision(minSellPrice, pairPrecision)
  ).toFixed(pairShowPrecision)

  const chainx = getChainx()

  const sign = async () => {
    const realPrice = BigNumber(price)
      .multipliedBy(Math.pow(10, pairPrecision))
      .toNumber()
    const realAmount = BigNumber(amount)
      .multipliedBy(Math.pow(10, assetPrecision))
      .toNumber()

    if (realPrice <= 0) {
      setPriceErrMsg($t('TRADE_INVALID_PRICE'))
      return
    }

    if (minSellPrice && realPrice < minSellPrice) {
      setPriceErrMsg($t('TRADE_MIN_SELL_PRICE', { price: minSellShowPrice }))
      return
    }

    if (realAmount <= 0) {
      setAmountErrMsg($t('TRADE_INVALID_AMOUNT'))
      return
    }

    if (!canRequestSign()) {
      return
    }

    setDisabled(true)
    try {
      const extrinsic = chainx.trade.putOrder(
        pairId,
        'Limit',
        'Sell',
        realAmount,
        realPrice
      )
      const status = await signAndSendExtrinsic(
        accountAddress,
        extrinsic.toHex()
      )

      const messages = {
        successTitle: '卖单成功',
        failTitle: '卖单失败',
        successMessage: `卖单数量 ${amount} ${pairAsset}`,
        failMessage: `交易hash ${status.txHash}`
      }

      await showSnack(status, messages, dispatch)
      await retry(
        () => {
          dispatch(fetchQuotations(pairId))
          dispatch(fetchNowOrders(accountId))
          dispatch(fetchAccountAssets(address))
        },
        5,
        2
      )
    } finally {
      setDisabled(false)
    }
  }

  return (
    <Wrapper>
      <div className="info">
        <Free asset={pairAsset} free={assetFree} precision={assetPrecision} />
        <Error>{priceErrMsg || amountErrMsg}</Error>
      </div>

      <div className="price input">
        <PriceWrapper
          data-tip={$t('TRADE_MIN_SELL_PRICE', { price: minSellShowPrice })}
        >
          <Label htmlFor="sell-price">{$t('TRADE_PRICE')}</Label>
          <img src={infoIcon} alt="info" />
        </PriceWrapper>
        <AmountInput
          style={{ maxWidth: 216 }}
          id="sell-price"
          value={price}
          onChange={value => {
            setPriceErrMsg('')
            setPrice(value)
          }}
          tokenName={pairCurrency}
          precision={pairShowPrecision}
        />
      </div>

      <div className="amount input">
        <Label>{$t('TRADE_AMOUNT')}</Label>
        <AmountInput
          style={{ maxWidth: 216 }}
          id="sell-amount"
          value={amount}
          onChange={value => {
            setAmountErrMsg('')
            if (value * Math.pow(10, assetPrecision) > assetFree) {
              setAmount(toPrecision(assetFree, assetPrecision))
              setPercentage(100)
            } else {
              setAmount(value)
              setPercentage(
                ((value * Math.pow(10, assetPrecision)) / assetFree) * 100
              )
            }
          }}
          tokenName={pairAsset}
          precision={assetPrecision}
          error={!!amountErrMsg}
        />
      </div>

      <Slider
        className="percentage"
        onChange={value => {
          setAmountErrMsg('')
          setPercentage(value)
          setAmount(toPrecision((assetFree * value) / 100, assetPrecision))
        }}
        value={percentage}
        min={0}
        max={100}
        valueLabelDisplay="off"
        marks={marks}
      />

      <div className="volume">
        <span>{$t('TRADE_VOLUME')} </span>
        {pairCurrency ? (
          <span>
            {volume.toFixed(currencyPrecision)} {pairCurrency}
          </span>
        ) : null}
      </div>

      <div className="button">
        <DangerButton
          disabled={isDemoAddr || disabled || pairId === 1}
          size="fullWidth"
          onClick={sign}
        >
          {$t('TRADE_SELL')} {pairAsset}
        </DangerButton>
      </div>
    </Wrapper>
  )
}
