import { useSelector } from 'react-redux'
import { networkSelector } from '../reducers/settingsSlice'
import { mainNetExplorer, testNetExplorer } from '../services/api'
import { getChainx } from '../services/chainx'
import link from '../static/link.svg'
import linkHighlight from '../static/link-highlight.svg'
import React from 'react'
import LinkWrapper from './common/LinkWrapper'

export default function({ address = '', length = 5, mainnet = null }) {
  const network = useSelector(networkSelector)
  let host = network === 'testnet' ? testNetExplorer : mainNetExplorer
  if (typeof mainnet === 'boolean' && mainnet) {
    host = mainNetExplorer
  }

  const chainx = getChainx()
  const accountId = chainx.account.decodeAddress(address)
  const url = `${host}accounts/${accountId}`

  let result = address
  if (address.length > 2 * length) {
    result =
      address.substring(0, 5) + '...' + address.substring(address.length - 5)
  }

  return (
    <LinkWrapper href={url} target="_blank">
      <span title={address}>{result}</span>
      <img className="link" src={link} alt="link" />
      <img
        className="link-highlight"
        src={linkHighlight}
        alt="link-highlight"
      />
    </LinkWrapper>
  )
}
