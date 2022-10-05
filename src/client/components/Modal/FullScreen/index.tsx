import React from 'react'
import createDimension, { useDimension } from 'dymension'
import Modal from 'react-bootstrap/Modal'
import Icon from '../../Icon'
import './index.scss'

interface FullScreenProps {
    children: React.ReactNode;
}

const FullScreen: React.FunctionComponent<FullScreenProps> = ({ 
    children
}) => {

    const {
        show,
        resolve,
    } = useDimension()

    const handleClose = () => {
        resolve(true)
    }

    return (
        <Modal
            className="modal-fullscreen"
            show={show}
            onHide={handleClose}
            fade="true"
            centered
            backdrop
        >
            <button className="modal-fullscreen-close" onClick={handleClose}>
                <Icon name="times" />
            </button>
            {children}
        </Modal>
    )
}

FullScreen.defaultProps = {

}

const ModalFullScreen = createDimension<boolean, typeof FullScreen>(FullScreen, {
    delay: 150
})

export default ModalFullScreen