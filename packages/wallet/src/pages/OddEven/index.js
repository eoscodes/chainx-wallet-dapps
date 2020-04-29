import React from 'react'
import { BetArea, Header, Main, MyBets, Wrapper } from './styledComponents'
import Logo from './odd-even-logo.svg'
import BtcHash from './components/BtcHash'
import { useSelector } from 'react-redux'
import {
  betHeightSelector,
  betStatusSelector,
  dealHeightSelector,
  nowBtcSelector
} from '../../reducers/oddevenSlice'
import Status from './Status'
import Bet from './Bet'
import NowBets from './NowBets'

export default function() {
  const btc = useSelector(nowBtcSelector)
  const betHeight = useSelector(betHeightSelector)
  const status = useSelector(betStatusSelector)
  const dealHeight = useSelector(dealHeightSelector)

  return (
    <Wrapper>
      <Header>
        <img src={Logo} alt="logo" />
        <dl>
          <dt>当前 Bitcoin 块高:</dt>
          <dd>{btc.height}</dd>
          <dt>哈希:</dt>
          <dd>
            <BtcHash>{btc.hash}</BtcHash>
          </dd>
        </dl>
      </Header>
      <Main>
        <BetArea>
          <header>
            <span>块高 {betHeight}</span>
            <Status>{status}</Status>
          </header>
          <main>
            <div>
              <h3>
                对 Bitcoin 块高 <span className="height">{betHeight}</span>{' '}
                的交易哈希的 <span>奇/偶</span> 进行投注！
              </h3>
              <Bet />
              <NowBets />
            </div>
            <footer>投注时间截止至 Bitcoin 块高 {dealHeight}</footer>
          </main>
        </BetArea>
        <MyBets>my bets</MyBets>
      </Main>
    </Wrapper>
  )
}