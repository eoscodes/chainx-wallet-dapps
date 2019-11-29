import React, { useEffect } from 'react'
import Wrapper from './Wrapper'
import { Table, TableBody, TableHead, TableRow } from '@chainx/ui'
import HeadCell from '../../components/HeadCell'
import { useDispatch, useSelector } from 'react-redux'
import {
  currentPairSelector,
  fetchFills
} from '../../../../../reducers/tradeSlice'
import PriceCell from '../../components/PriceCell'
import { currentFillsSelector, currentPairAssetInfo } from './selectors'
import { toPrecision } from '../../../../../utils'
import AmountCell from '../../components/AmountCell'
import moment from 'moment'
import TimeCell from './TimeCell'
import { Empty } from '../../../../../components'

export default function() {
  const pair = useSelector(currentPairSelector)
  const fills = useSelector(currentFillsSelector)
  const asset = useSelector(currentPairAssetInfo)
  const dispatch = useDispatch()

  useEffect(() => {
    if (pair) {
      dispatch(fetchFills(pair.id))
    }
  }, [dispatch, pair])

  return (
    <Wrapper>
      <header>Latest</header>
      <Table>
        <TableHead>
          <TableRow>
            <HeadCell>价格</HeadCell>
            <HeadCell>数量</HeadCell>
            <HeadCell style={{ textAlign: 'right' }}>时间</HeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fills.map((fill, index) => {
            const { precision, unitPrecision } = pair || {
              precision: 0,
              unitPrecision: 0
            }
            const price = Number(
              toPrecision(fill.price, pair.precision)
            ).toFixed(precision - unitPrecision)
            const time = moment(fill['block.time']).format('HH:mm:ss')

            return (
              <TableRow key={index}>
                <PriceCell style={{ fontSize: 12, width: '22%' }}>
                  {price}
                </PriceCell>
                <AmountCell
                  value={fill.amount}
                  precision={asset.precision}
                  style={{ width: '50%' }}
                />
                <TimeCell style={{ width: '28%' }}>{time}</TimeCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      {fills.length <= 0 && <Empty text={'无成交'} style={{ marginTop: 30 }} />}
    </Wrapper>
  )
}
