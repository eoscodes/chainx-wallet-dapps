import styled from 'styled-components'
import SideCard from '../../../components/SideCard'
import { TableCell } from '@chainx/ui'

const Wrapper = styled(SideCard)`
  padding: 16px 0;
`

export const Header = styled.header`
  ul {
    display: flex;
    justify-content: space-around;
    li {
      flex: 1;
      text-align: center;
      padding-bottom: 13px;

      opacity: 0.32;
      font-size: 14px;
      font-weight: 600;
      color: #000000;
      letter-spacing: 0.12px;
      line-height: 20px;

      cursor: pointer;
      &.active {
        border-bottom: 3px solid #f6c94a;
        opacity: 0.72;
      }
    }
  }
`

export const Cell = styled(TableCell)`
  height: 24px;
  padding: 0 12px !important;
  opacity: 0.72;
  font-weight: 600 !important;
  font-size: 12px !important;
  color: #000000;
  letter-spacing: 0.2px;
  line-height: 16px;
`

export const SymbolCell = styled(TableCell)`
  opacity: 0.72;
  font-size: 14px !important;
  font-weight: 600 !important;
  color: #000000;
  letter-spacing: 0.12px;
  line-height: 20px;
  border-bottom: 0 !important;
  width: 50%;
`

export const PriceCell = styled(TableCell)`
  text-align: right !important;
  font-weight: 600 !important;
  font-size: 14px !important;
  color: #dc6e46 !important;
  line-height: 20px;
  border-bottom: 0 !important;
  width: 50%;
`

export default Wrapper
