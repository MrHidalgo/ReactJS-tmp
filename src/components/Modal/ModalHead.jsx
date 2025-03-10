import React from 'react'
import PropTypes from 'prop-types'

const ModalHead = ({children}) => {
  return <div className="c-modal__header">{children}</div>
}

ModalHead.propTypes = {
  children: PropTypes.node,
}

export default ModalHead
