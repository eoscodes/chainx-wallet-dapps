import React, { useState } from 'react'
import StyledDialog from './StyledDialog'
import { AmountInput, PrimaryButton, TextInput } from '@chainx/ui'
import { useDispatch, useSelector } from 'react-redux'
import { pcxPrecisionSelector } from '../../selectors/assets'
import $t from '../../../locale'
import { toPrecision } from '../../../utils'
import arrow from '../svg/arrow.svg'
import darkArrow from '../svg/dark-arrow.svg'
import BigNumber from 'bignumber.js'
import { showSnack, signAndSendExtrinsic } from '../../../utils/chainxProvider'
import { addressSelector } from '../../../reducers/addressSlice'
import { fetchNominationRecords } from '../../../reducers/intentionSlice'
import { fetchAccountAssets } from '../../../reducers/assetSlice'
import {
  checkAmountAndHasError,
  checkMemoAndHasError
} from '../../../utils/errorCheck'

export default function({
  handleClose,
  nomination,
  intention,
  revocations = []
}) {
  const accountAddress = useSelector(addressSelector)

  const [amount, setAmount] = useState('')
  const [amountErrMsg, setAmountErrMsg] = useState('')
  const precision = useSelector(pcxPrecisionSelector)

  const [memo, setMemo] = useState('')
  const [memoErrMsg, setMemoErrMsg] = useState('')
  const [disabled, setDisabled] = useState(false)
  const hasAmount = !amountErrMsg && amount
  const dispatch = useDispatch()

  const unNominate = async () => {
    if (
      checkAmountAndHasError(amount, nomination, precision, setAmountErrMsg)
    ) {
      return
    }

    if (
      checkMemoAndHasError(memo, setMemoErrMsg, setDisabled.bind(null, true))
    ) {
      return
    }

    if (!window.chainxProvider) {
      // TODO: 考虑没有安装插件的情况下怎么与用户进行交互
      return
    }

    const realAmount = BigNumber(amount)
      .multipliedBy(Math.pow(10, precision))
      .toNumber()

    setDisabled(true)
    try {
      const status = await signAndSendExtrinsic(
        accountAddress,
        'xStaking',
        'unnominate',
        [intention.account, realAmount, memo]
      )
      const messages = {
        successTitle: '赎回成功',
        failTitle: '赎回失败',
        successMessage: `赎回数量 ${amount} PCX，锁定期3天`,
        failMessage: `交易hash ${status.txHash}`
      }

      await showSnack(status, messages, dispatch)
      handleClose()
      dispatch(fetchNominationRecords(accountAddress))
      dispatch(fetchAccountAssets(accountAddress))
    } catch (e) {
      setDisabled(false)
    }
  }

  return (
    <StyledDialog open title={'赎回投票'} handleClose={handleClose}>
      <main className="content">
        <div className="amount">
          <AmountInput
            value={amount}
            onChange={value => {
              setAmountErrMsg('')
              setAmount(value)
            }}
            placeholder={'数量'}
            precision={precision}
            error={!!amountErrMsg}
            errorText={amountErrMsg}
          />
        </div>

        <div>
          <TextInput
            value={memo}
            onChange={value => {
              setMemoErrMsg('')
              setMemo(value)
            }}
            placeholder={$t('COMMON_MEMO')}
            error={!!memoErrMsg}
            errorText={memoErrMsg}
          />
        </div>

        <div className="info">
          <section className="now">
            <h4>当前票数</h4>
            <p>{toPrecision(nomination, precision)} PCX</p>
          </section>
          <img src={hasAmount ? arrow : darkArrow} alt="arrow" />
          <section className="after">
            <h4>修改后票数</h4>
            <p>
              {!hasAmount
                ? '-'
                : `${toPrecision(
                    nomination - amount * Math.pow(10, precision),
                    precision
                  )} PCX`}
            </p>
          </section>
        </div>

        <ul className="warning">
          <li>赎回锁定期3天</li>
          {revocations.length >= 7 ? (
            <li>同时赎回不能超过 10 笔（当前 7 笔）</li>
          ) : null}
        </ul>

        <div>
          <PrimaryButton
            disabled={disabled}
            size="fullWidth"
            onClick={unNominate}
          >
            {$t('COMMON_CONFIRM')}
          </PrimaryButton>
        </div>
      </main>
    </StyledDialog>
  )
}
