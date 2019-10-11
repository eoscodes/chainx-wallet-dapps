import React from 'react'
import styled from 'styled-components'
import Footer from './Footer'

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  width: 300px;

  background: #ffffff;
  border: 1px solid #dce0e2;
  border-radius: 10px;

  & > footer {
    margin-top: 9px;
  }
`

export default function(props) {
  const intention = props.intention

  return (
    <Wrapper>
      {intention.name}
      <Footer intention={intention} />
    </Wrapper>
  )
}