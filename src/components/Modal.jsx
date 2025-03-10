import React, {useContext} from 'react'
import ReactDOM from 'react-dom'

import {ModalContext} from '../context/ModalContext'

import PropTypes from 'prop-types'
import CloseButton from './Modal/CloseButton.jsx'

const Modal = ({modalId, children}) => {
  const {activeModals} = useContext(ModalContext)

  if (!activeModals.includes(modalId)) return null

  return ReactDOM.createPortal(
    <div
      id={modalId}
      className="c-modal"
      style={{zIndex: 10000 + activeModals.length}}
    >
      <div className="c-modal__container">
        <div className="c-modal__content">
          <CloseButton />
          {children}
        </div>
      </div>
    </div>,
    document.getElementById('root'),
  )
}

Modal.propTypes = {
  modalId: PropTypes.string.isRequired,
  children: PropTypes.node,
}

export default Modal
