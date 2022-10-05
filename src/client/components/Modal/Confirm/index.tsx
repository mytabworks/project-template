import React from 'react'
import createDimension, { useDimension } from 'dymension'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

interface ConfirmProps {
    title: React.ReactNode,
    titleIcon?: string,
    body: React.ReactNode,
    size?: 'sm' | 'lg' | 'xl',
    className?: string;
    centered?: boolean,
    backdrop?: 'static' | boolean,
    submit?: React.ReactNode,
    cancel?: React.ReactNode
}

const Confirm: React.FunctionComponent<ConfirmProps> = ({ 
    title,
    titleIcon,
    body,
    size,
    centered,
    className,
    backdrop,
    submit,
    cancel,
}) => {

    const {
        show,
        resolve,
    } = useDimension()

    const handleResolve = () => {
        resolve(true)
    }
    
    const handleReject = () => {
        resolve(false)
    }

    return (
        <Modal
            show={show}
            onHide={handleReject}
            size={size}
            className={className}
            centered={centered}
            backdrop={backdrop}
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    {titleIcon ? (
                        <div className="d-flex align-items-center">
                            <i className={titleIcon} aria-hidden="true"/>
                            <div className="ml-3">{title}</div>
                        </div>
                    ) : (
                        title
                    )}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {body}
            </Modal.Body>
            <Modal.Footer>
            <Button variant="primary" onClick={handleResolve}>
                {submit}
            </Button>
            <Button variant="secondary" onClick={handleReject} >
                {cancel}
            </Button>
            </Modal.Footer>
        </Modal>
    )
}

Confirm.defaultProps = {
    backdrop: 'static',
    submit: "Yes",
    cancel: "No"
}

const ModalConfirm = createDimension<boolean, typeof Confirm>(Confirm, {
    delay: 150
})
export default ModalConfirm