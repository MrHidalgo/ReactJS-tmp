import React, {useContext} from 'react'

import {ModalContext} from '../../context/ModalContext.jsx'

const CloseButton = () => {
  const {activeModals, closeModal} = useContext(ModalContext)

  if (activeModals.length === 0) return null

  const handleClick = () => {
    const lastModalId = activeModals[activeModals.length - 1]
    closeModal(lastModalId)
  }

  return (
    <a className="c-modal__close" href="#" onClick={handleClick}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18 6L6 18"
          stroke="#F4F4F4"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6 6L18 18"
          stroke="#F4F4F4"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  )
}

export default CloseButton
