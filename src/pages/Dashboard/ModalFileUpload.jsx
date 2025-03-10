import React, {useContext, useState, useEffect, useRef} from 'react'
import PropTypes from 'prop-types'
import ReactDOMServer from 'react-dom/server'

import {ModalContext} from '../../context/ModalContext.jsx'
import {useApi} from '../../hooks/useApi'
import Modal from '../../components/Modal.jsx'
import ModalHead from '../../components/Modal/ModalHead.jsx'
import ModalBody from '../../components/Modal/ModalBody.jsx'

const MAX_FILE_SIZE_MB = 30
const MAX_FILES = 5
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'image/gif',
  'image/svg+xml',
  'application/pdf',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/zip',
  'application/x-rar-compressed',
  'application/x-7z-compressed',
]

const filePondLabel = () =>
  ReactDOMServer.renderToStaticMarkup(
    <div className="cursor-pointer flex flex-col items-center gap-4">
      <svg
        width="33"
        height="26"
        viewBox="0 0 33 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M15.7929 12.2929C16.1834 11.9024 16.8166 11.9024 17.2071 12.2929L22.5404 17.6262C22.931 18.0167 22.931 18.6499 22.5404 19.0404C22.1499 19.431 21.5167 19.431 21.1262 19.0404L16.5 14.4142L11.8738 19.0404C11.4832 19.431 10.8501 19.431 10.4596 19.0404C10.069 18.6499 10.069 18.0167 10.4596 17.6262L15.7929 12.2929Z"
          fill="#E7C041"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16.5 12C17.0523 12 17.5 12.4477 17.5 13V25C17.5 25.5523 17.0523 26 16.5 26C15.9477 26 15.5 25.5523 15.5 25V13C15.5 12.4477 15.9477 12 16.5 12Z"
          fill="#E7C041"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.0633 0.0111844C13.8256 -0.0537458 15.5797 0.281679 17.1937 0.992242C18.8077 1.7028 20.2396 2.77001 21.3818 4.11364C22.355 5.25839 23.0962 6.57841 23.5673 8H24.5C26.2033 8.00112 27.8584 8.56945 29.2029 9.61528C30.5473 10.6611 31.5052 12.1249 31.9254 13.7756C32.3455 15.4263 32.204 17.1699 31.5231 18.7312C30.8423 20.2926 29.6608 21.5827 28.1653 22.398C27.6804 22.6624 27.073 22.4836 26.8087 21.9987C26.5443 21.5138 26.7231 20.9064 27.208 20.642C28.3134 20.0394 29.1866 19.0858 29.6899 17.9318C30.1931 16.7777 30.2977 15.489 29.9872 14.2689C29.6766 13.0488 28.9686 11.9669 27.9749 11.1939C26.9812 10.4209 25.7583 10.0008 24.4993 10H22.82C22.3641 10 21.9659 9.69167 21.8518 9.2503C21.4861 7.83564 20.8044 6.52229 19.858 5.409C18.9116 4.29572 17.7252 3.41146 16.3879 2.8227C15.0505 2.23395 13.5972 1.95603 12.137 2.00983C10.6768 2.06363 9.24778 2.44775 7.95741 3.13332C6.66705 3.81888 5.54889 4.78805 4.68699 5.96797C3.8251 7.14788 3.24191 8.50783 2.98126 9.94557C2.72061 11.3833 2.78929 12.8614 3.18213 14.2688C3.57496 15.6762 4.28174 16.9762 5.24933 18.0711C5.61505 18.485 5.57603 19.1169 5.16219 19.4827C4.74834 19.8484 4.11638 19.8094 3.75066 19.3955C2.58289 18.0741 1.72988 16.5051 1.25576 14.8065C0.781646 13.108 0.698761 11.324 1.01334 9.58881C1.32792 7.8536 2.03177 6.21228 3.07198 4.78825C4.1122 3.36421 5.4617 2.19453 7.01904 1.36712C8.57638 0.53971 10.301 0.0761146 12.0633 0.0111844Z"
          fill="#E7C041"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M15.7929 12.2929C16.1834 11.9024 16.8166 11.9024 17.2071 12.2929L22.5404 17.6262C22.931 18.0167 22.931 18.6499 22.5404 19.0404C22.1499 19.431 21.5167 19.431 21.1262 19.0404L16.5 14.4142L11.8738 19.0404C11.4832 19.431 10.8501 19.431 10.4596 19.0404C10.069 18.6499 10.069 18.0167 10.4596 17.6262L15.7929 12.2929Z"
          fill="#E7C041"
        />
      </svg>
      <p className="text-white font-medium !text-sm">
        Select a file or drag and drop here
      </p>
      <p className="flex items-center justify-center w-40 h-12 rounded-full bg-festival text-black font-medium">
        Select File
      </p>
    </div>,
  )

const ModalFileUpload = ({modalName, selectedType, refreshDocuments}) => {
  const {activeModals, closeModal} = useContext(ModalContext)
  const {request} = useApi()
  const [files, setFiles] = useState([])
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [isUploading, setIsUploading] = useState(false)

  const messageTimeoutRef = useRef(null)

  useEffect(() => {
    if (!activeModals.includes(modalName)) {
      setFiles([])
      setUploadedFiles([])
      setErrorMessage(null)
      setSuccessMessage(null)
      setIsUploading(false)
      clearTimeout(messageTimeoutRef.current)
    }
  }, [activeModals, modalName])

  if (!activeModals.includes(modalName)) return null

  const showMessage = (setMessage, message) => {
    setMessage(message)
    clearTimeout(messageTimeoutRef.current)
    messageTimeoutRef.current = setTimeout(() => setMessage(null), 4000)
  }

  const handleUploadFiles = async () => {
    if (uploadedFiles.length === 0) {
      showMessage(
        setErrorMessage,
        'Please select at least one file before uploading.',
      )
      return
    }

    if (!selectedType) {
      showMessage(
        setErrorMessage,
        'Please select a document type before uploading.',
      )
      return
    }

    setIsUploading(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const formData = new FormData()
      uploadedFiles.forEach(file => formData.append('file', file))
      formData.append('type', selectedType)

      const response = await request('documents', {
        method: 'POST',
        body: formData,
      })

      if (!response) throw new Error('Upload failed')

      showMessage(setSuccessMessage, 'Files uploaded successfully!')

      setTimeout(() => {
        closeModal(modalName)
        refreshDocuments()
      }, 1000)

      setFiles([])
      setUploadedFiles([])
    } catch (error) {
      console.error('File upload error:', error)
      showMessage(
        setErrorMessage,
        'Error uploading files. Please try again.',
      )
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Modal modalId={modalName}>
      <ModalHead>
        <p className="text-lg font-medium">Add Document</p>
      </ModalHead>
      <ModalBody>
        <FilePond
          files={files}
          onupdatefiles={fileItems => {
            setErrorMessage(null)
            setSuccessMessage(null)

            if (fileItems.length > MAX_FILES) {
              showMessage(
                setErrorMessage,
                `You can upload up to ${MAX_FILES} files.`,
              )
              return
            }

            setFiles(fileItems.map(fileItem => fileItem.file))
          }}
          allowMultiple
          maxFiles={MAX_FILES}
          acceptedFileTypes={ALLOWED_FILE_TYPES}
          fileValidateTypeLabelExpectedTypes={`Allowed file types: ${ALLOWED_FILE_TYPES.join(', ')}`}
          fileValidateSizeMax={MAX_FILE_SIZE_MB * 1024 * 1024}
          fileValidateSizeLabelMaxSize={`File is too large. Maximum size: ${MAX_FILE_SIZE_MB}MB.`}
          server={{
            process: (
              fieldName,
              file,
              metadata,
              load,
              error,
              progress,
              abort,
            ) => {
              progress(true, 100, 100)
              load(file.name)
              setUploadedFiles(prev => [...prev, file])
            },
          }}
          name="file"
          labelIdle={filePondLabel()}
        />

        {errorMessage && (
          <p className="pb-4 text-red-500 text-xs text-center mt-2">
            {errorMessage}
          </p>
        )}
        {successMessage && (
          <p className="pb-4 text-green-500 text-xs text-center mt-2">
            {successMessage}
          </p>
        )}

        <p className="pb-8 text-xs text-center">
          Please upload a file (up to {MAX_FILE_SIZE_MB}MB). If your file
          is larger, kindly compress it into a .zip, .rar, or .7z archive
          and upload it.
        </p>

        <button
          disabled={!uploadedFiles.length || isUploading}
          type="button"
          onClick={handleUploadFiles}
          className={`cursor-pointer outline-none flex items-center justify-center w-full h-12 rounded-full bg-festival shadow-none font-medium text-base text-black transition ${
            !uploadedFiles.length || isUploading
              ? 'pointer-events-none cursor-not-allowed opacity-75 bg-nero text-dark-grey'
              : ''
          }`}
        >
          {isUploading ? 'Uploading...' : 'Upload Files'}
        </button>
      </ModalBody>
    </Modal>
  )
}

ModalFileUpload.propTypes = {
  modalName: PropTypes.string.isRequired,
  selectedType: PropTypes.string,
}

export default ModalFileUpload
