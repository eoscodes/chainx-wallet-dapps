import Card from '../../../components/Card'
import styled from 'styled-components'
import React from 'react'

const CardWrapper = styled(Card)`
  width: 100%;

  & > header {
    margin: 3px 0 16px;
  }

  & > hr {
    margin: 0 -16px;
    border: 0.5px solid #eee;
  }
`

const Detail = styled.section`
  margin-top: 16px;
  display: flex;

  ul,
  li {
    margin: 0;
    padding: 0;

    list-style: none;
  }

  ul {
    display: flex;
    justify-content: space-between;
    width: 100%;
    min-height: 40px;

    li {
      header {
        opacity: 0.32;
        font-size: 12px;
        color: #000000;
        line-height: 16px;
      }
      p {
        margin-top: 4px;
        opacity: 0.72;
        font-size: 14px;
        color: #000000;
        line-height: 20px;
      }
    }
  }
`

export default function(props) {
  return (
    <CardWrapper>
      <header>{props.header}</header>
      <hr />
      <Detail>{props.detail}</Detail>
    </CardWrapper>
  )
}