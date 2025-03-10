import React from 'react'
import PropTypes from 'prop-types'

const ModalBody = ({children}) => {
  return <div className="c-modal__body">{children}</div>
}

ModalBody.propTypes = {
  children: PropTypes.node,
}

export default ModalBody
