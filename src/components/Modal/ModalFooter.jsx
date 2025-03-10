import React from 'react'
import PropTypes from 'prop-types'

const ModalFooter = ({children}) => {
  return <div className="c-modal__footer">{children}</div>
}

ModalFooter.propTypes = {
  children: PropTypes.node,
}

export default ModalFooter
