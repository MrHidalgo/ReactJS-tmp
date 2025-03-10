import React, {useContext, useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {useNavigate} from 'react-router-dom'

import {ModalContext} from '../../context/ModalContext.jsx'
import {useApi} from '../../hooks/useApi'
import {useAuth} from '../../context/AuthContext.jsx'
import Modal from '../../components/Modal.jsx'
import ModalHead from '../../components/Modal/ModalHead.jsx'
import ModalBody from '../../components/Modal/ModalBody.jsx'

const ModalChangePassword = ({modalName}) => {
  const {activeModals, closeModal} = useContext(ModalContext)
  const {request} = useApi()
  const {logout} = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  })
  const [showPassword, setShowPassword] = useState({
    current_password: false,
    password: false,
    password_confirmation: false,
  })
  const [validationErrors, setValidationErrors] = useState({})
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!activeModals.includes(modalName)) {
      setFormData({
        current_password: '',
        password: '',
        password_confirmation: '',
      })
      setValidationErrors({})
      setErrorMessage(null)
      setSuccessMessage(null)
      setIsSubmitting(false)
    }
  }, [activeModals, modalName])

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null)
        setErrorMessage(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [successMessage, errorMessage])

  const validateFields = () => {
    const errors = {}

    if (!formData.current_password.trim())
      errors.current_password = 'Current password is required.'
    if (!formData.password.trim()) {
      errors.password = 'New password is required.'
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long.'
    }
    if (formData.password_confirmation !== formData.password) {
      errors.password_confirmation = 'Passwords do not match.'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = e => {
    const {name, value} = e.target
    setFormData({...formData, [name]: value})
    setValidationErrors({...validationErrors, [name]: ''}) // Очищуємо помилку при вводі
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!validateFields() || isSubmitting) return

    setIsSubmitting(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const responseData = await request('change-password', {
        method: 'POST',
        body: JSON.stringify(formData),
      })

      if (!responseData || !responseData.message) {
        throw new Error('Unexpected server response.')
      }

      setSuccessMessage(
        responseData.message ||
          'Password changed successfully! Redirecting...',
      )

      closeModal(modalName)

      setTimeout(() => {
        logout()
      }, 2000)
    } catch (error) {
      console.error('Change password error:', error)
      setErrorMessage(
        error.message || 'Error changing password. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const togglePasswordVisibility = field => {
    setShowPassword(prev => ({...prev, [field]: !prev[field]}))
  }

  return (
    <Modal modalId={modalName}>
      <ModalHead>
        <p className="text-lg font-medium">Change Password</p>
      </ModalHead>
      <ModalBody>
        {errorMessage && (
          <p className="text-red-500 text-sm">{errorMessage}</p>
        )}
        {successMessage && (
          <p className="text-green-500 text-sm">{successMessage}</p>
        )}

        <form autoComplete="off" className="profile__form">
          {[
            {label: 'Current Password', name: 'current_password'},
            {label: 'New Password', name: 'password'},
            {label: 'Confirm New Password', name: 'password_confirmation'},
          ].map(({label, name}) => (
            <div
              key={name}
              className={`profile__form-field flex flex-col pb-8
              ${validationErrors[name] ? 'is-error' : formData[name] ? 'is-success' : ''}`}
            >
              <label className="pb-1.5 text-white font-medium text-sm">
                {label}
              </label>
              <div className="relative">
                <input
                  type={showPassword[name] ? 'text' : 'password'}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="outline-none w-full h-12 pl-4 pr-12 rounded-sm bg-nero text-white font-normal"
                  required
                />
                <button
                  type="button"
                  className="outline-none absolute top-0 right-0 flex items-center justify-center w-12 h-full"
                  onClick={() => togglePasswordVisibility(name)}
                >
                  {showPassword[name] ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-eye-slash-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z" />
                      <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-eye-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                      <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
                    </svg>
                  )}
                </button>
              </div>
              {validationErrors[name] && (
                <p className="text-red-500 text-xs">
                  {validationErrors[name]}
                </p>
              )}
            </div>
          ))}

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            type="button"
            className={`w-full h-12 rounded-full bg-festival text-black font-medium ${isSubmitting ? 'pointer-events-none bg-nero text-grey-main' : ''}`}
          >
            {isSubmitting ? 'Changing Password...' : 'Change Password'}
          </button>
        </form>
      </ModalBody>
    </Modal>
  )
}

ModalChangePassword.propTypes = {
  modalName: PropTypes.string.isRequired,
}

export default ModalChangePassword
