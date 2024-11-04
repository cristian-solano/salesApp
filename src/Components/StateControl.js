import React from 'react'
import check from '../Images/check.png'
import '../Styles/statecontrol.css'

const StateControl = ({newStatus,state, amount, update, id, change}) => {

    
  return (
    <div className='state-control-items'>
        <select onChange={change} className='state-control-select'>
            <option value={state}>{state}</option>
            <option value="pendiente">Pendiente</option>
            {amount > 1000 &&
            <option value="en revisión">En revisión</option>
            }
            <option value="en preparación">En preparación</option>
            <option value="enviado">Enviado</option>
            <option value="entregado">Entregado</option>
        </select>
        <button onClick={() => update(id, newStatus)}>
            <img src={check} alt="check"/>
        </button>
    </div>
  )
}

export default StateControl