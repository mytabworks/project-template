export type {}
// import React from 'react'
// import createDimension, { useDimension } from 'dymension'
// import Button from 'react-bootstrap/Button'
// import Modal from 'react-bootstrap/Modal'
// import ServicesConfig from '../../ServicesConfig'
// import FormManager from '../../FormManager'

// interface ViewProps {
//     title: React.ReactNode,
//     titleIcon?: string,
//     body: React.ReactNode,
//     size?: 'sm' | 'lg' | 'xl',
//     className?: string;
//     centered?: boolean,
//     backdrop?: 'static' | 'true' | 'false',
//     close?: React.ReactNode;
//     prependFooter?: (close: () => void) => React.ReactNode;
// }

// const View: React.FunctionComponent<ViewProps> = ({ 
//     title,
//     titleIcon,
//     body,
//     size,
//     centered,
//     className,
//     backdrop,
//     close,
//     prependFooter
// }) => {

//     const {
//         show,
//         resolve,
//     } = useDimension()

//     const handleReject = () => {
//         resolve(false)
//     }

//     return (
//         <Modal
//             show={show}
//             onHide={handleReject}
//             size={size}
//             className={className}
//             centered={centered}
//             backdrop={backdrop}
//         >
//             <Modal.Header closeButton>
//                 <Modal.Title>
//                     {titleIcon ? (
//                         <div className="d-flex align-items-center">
//                             <i className={titleIcon} aria-hidden="true"/>
//                             <div className="ml-3">{title}</div>
//                         </div>
//                     ) : (
//                         title
//                     )}
//                 </Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//                 <ServicesConfig>
//                     <FormManager onSubmit={() => {}} id="view-modal">
//                         {body}
//                     </FormManager>
//                 </ServicesConfig>
//             </Modal.Body>
//             <Modal.Footer>
//                 {!!prependFooter && prependFooter(handleReject)}
//                 <Button variant="secondary" onClick={handleReject} >
//                     {close}
//                 </Button>
//             </Modal.Footer>
//         </Modal>
//     )
// }

// View.defaultProps = {
//     backdrop: 'static',
//     close: "Close",
// }

// const ModalView = createDimension<boolean, typeof View>(View, {
//     delay: 150
// })
// export default ModalView