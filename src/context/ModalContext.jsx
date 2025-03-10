import React, {createContext, useEffect, useState} from 'react'

import ModalOverlay from '../components/Modal/ModalOverlay.jsx'

export const ModalContext = createContext()

export const ModalProvider = ({children}) => {
  const [activeModals, setActiveModals] = useState([])

  const openModal = modalId => {
    setActiveModals([modalId])
    document.body.classList.add('is-blockscroll')
  }

  const closeModal = modalId => {
    setActiveModals(prevModals => prevModals.filter(id => id !== modalId))
    if (activeModals.length === 1) {
      document.body.classList.remove('is-blockscroll')
    }
  }

  useEffect(() => {
    const handleEscape = event => {
      if (event.key === 'Escape' && activeModals.length > 0) {
        closeModal(activeModals[0]) // Close the top-most modal
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [activeModals])

  return (
    <ModalContext.Provider value={{activeModals, openModal, closeModal}}>
      {children}
      <ModalOverlay />
    </ModalContext.Provider>
  )
}
