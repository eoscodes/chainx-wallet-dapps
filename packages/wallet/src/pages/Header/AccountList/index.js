import React, { useRef } from 'react'
import styled from 'styled-components'
import $t from '../../../locale'
import { useDispatch, useSelector } from 'react-redux'
import { setAccount } from '../../../reducers/addressSlice'
import { extensionAccountsSelector } from '../../../reducers/addressSlice'
import extensionIcon from './extension.svg'
import useOutsideClick from '../../../utils/useClickOutside'
import { noneFunc } from '../../../utils'
import { networkSelector } from '../../../reducers/settingsSlice'
import {
  mainNetDemoAccount,
  testNetDemoAccount
} from '../../../utils/constants'

const Wrapper = styled.ul`
  position: absolute;
  top: 56px;
  right: 16px;
  padding: 16px;

  width: 300px;

  background: rgba(255, 255, 255, 1);
  border: 1px solid #dce0e2;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.08), 0 8px 8px 0 rgba(0, 0, 0, 0.16);
  border-radius: 10px;

  z-index: 99;

  & > li {
    cursor: pointer;
    &:not(:first-of-type) {
      padding-top: 10px;
      border-top: 1px solid #eee;
    }
    &:not(:last-of-type) {
      padding-bottom: 10px;
    }

    h4 {
      display: flex;
      justify-content: space-between;

      margin: 0;
      font-size: 13px;
      color: #000000;
      letter-spacing: 0.2px;
      line-height: 18px;

      span {
        opacity: 0.72;
      }

      span.extension {
        background: #f6c94a;
        border: 1px solid rgba(0, 0, 0, 0.04);
        border-radius: 10px;

        padding: 0 15px;

        font-size: 12px;
        font-weight: 500;
        line-height: 16px;
      }
    }
    p {
      margin-top: 8px;
      opacity: 0.32;
      font-size: 12px;
      color: #000000;
      letter-spacing: 0.2px;
      line-height: 16px;

      overflow-x: hidden;
      text-overflow: ellipsis;
    }

    &.extension {
      display: flex;
      flex-direction: row-reverse;
      a {
        background: #f6c94a;
        border: 1px solid rgba(0, 0, 0, 0.04);
        border-radius: 8px;

        display: inline-flex;
        padding: 6px;
        align-items: center;
        text-decoration: none;

        span {
          margin-left: 12px;
          opacity: 0.72;
          font-size: 14px;
          color: #000000;
          letter-spacing: 0.12px;
          line-height: 20px;
        }
      }
    }
  }
`

export default function({ close = noneFunc }) {
  const extensionAccounts = useSelector(extensionAccountsSelector)
  const dispatch = useDispatch()
  const selectAccount = (name, address, isFromExtension) => {
    dispatch(setAccount({ name, address, isFromExtension }))
    setTimeout(() => window.location.reload(), 0)
  }

  const network = useSelector(networkSelector)
  const demoAccount =
    network === 'testnet' ? testNetDemoAccount : mainNetDemoAccount

  const demoAccountName = demoAccount.name
  const demoAccountAddress = demoAccount.address

  const hasExtension = !!window.chainxProvider

  const popup = useRef(null)

  useOutsideClick(popup, () => {
    close()
  })

  return (
    <Wrapper ref={popup}>
      <li
        onClick={() =>
          selectAccount(demoAccountName, demoAccountAddress, false)
        }
      >
        <h4>{demoAccountName}</h4>
        <p>{demoAccountAddress}</p>
      </li>
      {extensionAccounts.map(account => {
        return (
          <li
            onClick={() => selectAccount(account.name, account.address, true)}
            key={account.address}
          >
            <h4>
              <span>{account.name}</span>
              <span className="extension">插件账户</span>
            </h4>
            <p>{account.address}</p>
          </li>
        )
      })}
      {hasExtension ? null : (
        <li className="extension">
          <a
            href="https://chrome.google.com/webstore/detail/chainx-extension/dffjlgnecfafjfmkknpipapcbgajflge"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={extensionIcon} alt="extension" />
            <span>{$t('HEADER_GET_EXTENSION')}</span>
          </a>
        </li>
      )}
    </Wrapper>
  )
}