import React, { useEffect, useState } from 'react'
import { DefaultButton } from '@chainx/ui'
import DeployContract from '../../components/Contract/DeployContract'
import ContractCard from '../../components/Contract/ContractCard'
import ContractHeader from '../../components/Contract/ContractHeader'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAbiAndContractList } from '../../reducers/localSlice'
import './Home.scss'
import AddExistedContractDialog from '../../components/Contract/AddExistedContractDialog'

function Home(props) {
  const { abiList, contractList } = useSelector(state => state.local)
  const [update, setUpdate] = useState(new Date())
  const [showDeploy, setShowDeploy] = useState(false)
  const dispatch = useDispatch()

  const [showAddContract, setShowAddContract] = useState(false)

  useEffect(() => {
    dispatch(fetchAbiAndContractList())
  }, [update, dispatch])

  return (
    <div className="contract-home">
      <ContractHeader />
      {showAddContract && (
        <AddExistedContractDialog
          handleClose={() => setShowAddContract(false)}
          abi={abiList[0]}
        />
      )}
      {showDeploy && (
        <DeployContract
          props={props}
          abi={abiList[0]}
          setShowDeploy={setShowDeploy}
          isnew={true}
          setUpdate={setUpdate}
        />
      )}
      <div className="button-area">
        <DefaultButton
          className="contract-wide-button last-button"
          onClick={() => {
            setShowAddContract(true)
          }}
        >
          Add existing contract
        </DefaultButton>
      </div>
      {contractList.length > 0 ? (
        <div className="contract-list">
          {contractList.map((item, i) => (
            <ContractCard
              item={item}
              key={i}
              type="CONTRACT"
              setUpdate={setUpdate}
            />
          ))}
        </div>
      ) : (
        <div className="no-data">
          <span>No contract code available</span>
        </div>
      )}
    </div>
  )
}

export default Home
