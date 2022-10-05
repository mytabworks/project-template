export type {}
// import React, { createContext, useContext, useRef, useState } from 'react'
// import { FormEvent, FormProviderProps, useForm } from 'formydable'
// import createDimension, { useDimension } from 'dymension'
// import Button from 'react-bootstrap/Button'
// import Modal from 'react-bootstrap/Modal'
// import Alert from 'react-bootstrap/Alert'
// import ServicesConfig from '../../ServicesConfig'
// import FormManager from '../../FormManager'
// import Loader from '../../Loader'
// import Icon from '../../Icon'
// import GraphIndicator from '../../GraphIndicator'
// import FullScreen, { FullScreenReferenceType } from '../../FullScreen'
// import HelpText from '../../HelpText'
// import Row from 'react-bootstrap/Row'
// import Col from 'react-bootstrap/Col'
// import '../index.scss'

// const ModalFormContext = createContext<{
//     formMethods: FormProviderProps["value"],
//     onSubmit: (event: FormEvent) => void,
//     id: any,
//     noValidate: any
// }>(null as any)

// export const useModalForm = () => useContext(ModalFormContext);

// export type ModalFormEvent = FormEvent & {
//     isSubmit: boolean;
//     closeModal: () => void;
//     exitFullscreen: () => void;
//     removeLoading: () => void;
//     setError: (error: any) => void;
//     setValidationMessages: (validationMessages: string[]) => void;
// }

// type StateProps = {
//     confirmation: boolean;
//     loading: boolean;
//     error: null | string;
//     validationMessages: null | string[];
// }

// export interface ModalFormProps {
//     key: any;
//     id?: string;
//     title: React.ReactNode; 
//     titleIcon?: string;
//     body: React.ReactNode;
//     size?: 'sm' | 'lg' | 'xl';
//     className?: string;
//     footerClassName?: string;
//     headerClassName?: string;
//     bodyClassName?: string;
//     centered?: boolean;
//     allowFullscreen?: boolean;
//     activateGraphIndicator?: boolean;
//     backdrop?: 'static' | 'true' | 'false';
//     submit?: React.ReactNode;
//     cancel?: React.ReactNode;
//     confirm?: {
//         title?: React.ReactNode;
//         body?: React.ReactNode;
//         submit?: React.ReactNode;
//         cancel?: React.ReactNode
//     };
//     block?: boolean;
//     noValidate?: boolean;
//     genericHelpText?: boolean;
//     customFormManager?: boolean;
//     prependFooter?: (close: () => void) => React.ReactNode;
// }

// const FormModal: React.FunctionComponent<ModalFormProps> = ({ 
//     id,
//     title, 
//     titleIcon,
//     body,
//     size,
//     className,
//     headerClassName,
//     footerClassName,
//     bodyClassName,
//     centered,
//     allowFullscreen,
//     activateGraphIndicator,
//     backdrop,
//     submit,
//     cancel,
//     confirm,
//     block,
//     noValidate,
//     genericHelpText,
//     customFormManager,
//     prependFooter
// }) => {
//     const fullscreenRef = useRef<FullScreenReferenceType>(null)
//     const form = useForm()
//     const [{confirmation, loading, error, validationMessages}, setStates] = useState<StateProps>({
//         confirmation: false,
//         loading: false,
//         error: null,
//         validationMessages: null
//     })
//     const {
//         show,
//         resolve,
//         close,
//     } = useDimension()
    
//     const handleCancel = () => {
//         if(block && form.dirty) {
//             setStates(prev => ({...prev, confirmation: true}))
//         } else {
//             resolve({
//                 isSubmit: false
//             })
//             close()
//             fullscreenRef.current?.exitFullscreen()
//         }
//     }

//     const handleSubmit = (event: FormEvent) => {
//         setStates(prev => ({...prev, loading: true}))
//         resolve(Object.assign(event, {
//             closeModal: () => {
//                 close()
//                 fullscreenRef.current?.exitFullscreen()
//             },
//             exitFullscreen: () => fullscreenRef.current?.exitFullscreen(),
//             removeLoading: () => setStates(prev => ({...prev, loading: false})),
//             setError: (error: any) => setStates(prev => ({...prev, error})),
//             setValidationMessages: (validationMessages: string[]) => setStates(prev => ({...prev, validationMessages})),
//             isSubmit: true
//         }))
//     }

//     const handleConfirmCancel = () => {
//         setStates(prev => ({...prev, confirmation: false}))
//     }

//     const handleConfirmSubmit = () => {
//         resolve({
//             isSubmit: false
//         })
//         close()
//         fullscreenRef.current?.exitFullscreen()
//     }

//     return (
//         <Modal
//             show={show}
//             size={size}
//             className={className}
//             centered={centered}
//             backdrop={backdrop}
//             onHide={handleCancel}
//             autoFocus={false}
//         >
//             <ServicesConfig>
//             <FullScreen ref={fullscreenRef}>
//             <Modal.Header className={headerClassName} closeButton>
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
//                 <HelpText 
//                     as="button"
//                     groupName="Modal Form"
//                     className="close other-action ml-auto"
//                     removeModalTrapFocus
//                     customURL={genericHelpText ? `/generic-modal?modal=${id}` : `${window.location.pathname}?modal=${id}`} 
//                     />
//                 {allowFullscreen && (
//                     <FullScreen.Trigger 
//                         as="button" 
//                         type="button" 
//                         className="close other-action" 
//                         render={(isFullscreen) => (
//                             <Icon title={isFullscreen ? 'exit fullscreen' : 'enter fullscreen'} name={isFullscreen ? 'compress' : 'expand'}/>
//                         )}/>
//                 )}
//             </Modal.Header>
//             <Modal.Body className={bodyClassName}>
//                 <GraphIndicator activate={activateGraphIndicator}>
//                     {!!error && (
//                         <Alert className="modal-error-message" variant="danger" onClose={() => setStates(prev => ({...prev, error: null}))} dismissible>
//                             {error}
//                         </Alert>
//                     )}
//                     {customFormManager ? (
//                         <ModalFormContext.Provider value={{
//                             formMethods: form,
//                             onSubmit: handleSubmit,
//                             id,
//                             noValidate
//                         }}>
//                             {body}
//                         </ModalFormContext.Provider>
//                     ) : (
//                         <FormManager.Core value={form} onSubmit={handleSubmit} id={id} noValidate={noValidate}>
//                             {body}
//                         </FormManager.Core>
//                     )}
//                 </GraphIndicator>
//                 {!!validationMessages && (
//                     <Row className="modal-validation-messages">
//                         <Col sm={['lg', 'xl'].includes(size || 'md') ? { span: 6, offset: 6} : 12}>
//                             <Alert variant="danger" className="mb-0" onClose={() => setStates(prev => ({...prev, validationMessages: null}))} dismissible>
//                                 <ul className="m-0 pl-3">
//                                     {validationMessages.map((each, index) => (
//                                         <li key={index}>{each}</li>
//                                     ))}
//                                 </ul>
//                             </Alert>
//                         </Col>
//                     </Row>
//                 )}
//             </Modal.Body>
//             <Modal.Footer className={footerClassName}>
//                 {confirmation ? (
//                     <Alert variant="danger">
//                         <h4>{confirm!.title || 'You are leaving'}</h4>
//                         <p className="text-justify">{confirm!.body || 'Are you sure, you want to leave? the data cannot be retrieved after this action.'}</p>
//                         <div className="d-flex justify-content-end">
//                             <Button variant="secondary" className="mr-3" onClick={handleConfirmCancel} >
//                                 {confirm!.cancel || 'Stay'}
//                             </Button>
//                             <Button variant="primary" onClick={handleConfirmSubmit}>
//                                 {confirm!.submit || 'Leave Anyway'}
//                             </Button>
//                         </div>
//                     </Alert>
//                 ) : (
//                     <>
//                         {prependFooter && prependFooter(close)}
//                         <Button type="submit" form={id} variant="primary">
//                             {submit}
//                         </Button>
//                         <Button variant="secondary" onClick={handleCancel} >
//                             {cancel}
//                         </Button>
//                     </>
//                 )}
//             </Modal.Footer>
//             <Loader active={loading} />
//             </FullScreen>
//             </ServicesConfig>
//         </Modal>
//     )
// }

// FormModal.defaultProps = {
//     id: "prompt-submit",
//     backdrop: 'static',
//     submit: 'Save',
//     cancel: 'Cancel',
//     confirm: {},
//     block: false
// }

// type DC<T, P> = (props: P) => Promise<T>;

// interface ModalFormType<T, P> extends DC<T, P> {
//     Row: typeof Row;
//     Col: typeof Col;
// }
// //@ts-ignore
// const ModalForm: ModalFormType<ModalFormEvent, typeof FormModal extends React.FunctionComponent<infer P> ? P : any> = createDimension<ModalFormEvent, typeof FormModal>(FormModal, {
//     delay: 150,
//     closeManually: true,
//     manipulateWrapperNode: (wrapperNode, props) => {

//         if(props.key) {
//             const existNode = document.getElementById(props.key)

//             if(existNode) {

//                 wrapperNode = existNode

//             } else {

//                 wrapperNode.id = props.key

//             }
//         }

//         return wrapperNode
//     }
// })

// ModalForm.Row = Row
// ModalForm.Col = Col

// export const ModalFormOverlay = createDimension<ModalFormEvent, typeof FormModal>(FormModal, {
//     delay: 150,
//     closeManually: true,
//     manipulateWrapperNode: (wrapperNode, props) => {

//         if(props.key) {
//             const existNode = document.getElementById(props.key)

//             if(existNode) {

//                 wrapperNode = existNode

//             } else {

//                 wrapperNode.id = props.key

//             }
//         }

//         return wrapperNode
//     }
// })

// export default ModalForm