import React, {useContext} from 'react'
import {ModalContext} from '../../context/ModalContext.jsx'

const ModalOverlay = () => {
  const {activeModals, closeModal} = useContext(ModalContext)

  if (activeModals.length === 0) return null

  const handleClick = () => {
    const lastModalId = activeModals[activeModals.length - 1]
    closeModal(lastModalId)
  }

  return <div className="c-modal__overlay" onClick={handleClick} />
}

export default ModalOverlay
