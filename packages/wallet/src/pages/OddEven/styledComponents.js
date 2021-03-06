import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  padding-top: unset !important;
  margin: unset;
  width: 100%;
`

export const Header = styled.header`
  z-index: 10;
  position: relative;

  display: flex;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.85);
  height: 56px;
  padding: 0 0 0 16px;

  & > div {
    display: flex;

    &.right {
      align-items: center;
    }
  }

  dl,
  dt,
  dd {
    display: inline-flex;
  }

  dl {
    align-items: center;
    font-weight: 600;
    margin-left: 160px;
  }

  dt {
    margin-left: 8px;
    opacity: 0.72;
    font-size: 14px;
    color: #000000;
    letter-spacing: 0.12px;
    line-height: 20px;
  }
  dd {
    margin-left: 4px;
    font-size: 14px;
    color: #0088cc;
    letter-spacing: 0.12px;
    line-height: 20px;
  }
`

export const Main = styled.main`
  padding-top: 16px;
  margin: 0 auto;
  min-width: 1280px;
  max-width: 1440px;

  display: flex;
  flex: 1;
  overflow-y: auto;

  div.value {
    margin-top: 20px;
    p {
      font-weight: 500;
      font-size: 20px;
      color: #000000;
      letter-spacing: 0.15px;
      text-align: center;
      line-height: 32px;
    }
  }
`

export const BetArea = styled.section`
  flex: 1;
  display: flex;
  flex-direction: column;

  background: #ffffff;
  border: 1px solid #dce0e2;
  border-radius: 10px;

  main {
    flex: 1;
    padding-bottom: 24px;

    display: flex;
    flex-direction: column;
    align-items: center;

    & > div {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }

  footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
    padding: 0 16px;

    font-size: 14px;
    color: rgba(0, 0, 0, 0.56);
    letter-spacing: 0.12px;
    text-align: center;
    line-height: 20px;
  }
`
