export type {}
// import React, { useState, useRef, createContext, useContext } from 'react'
// import { FieldStateNested, FormEvent, FormProviderProps, useForm } from 'formydable'
// import createDimension, { useDimension } from 'dymension'
// import Button from 'react-bootstrap/Button'
// import Modal from 'react-bootstrap/Modal'
// import Alert from 'react-bootstrap/Alert'
// import ServicesConfig from '../../ServicesConfig'
// import FormManager from '../../FormManager'
// import Loader from '../../Loader'
// import Tab from 'react-bootstrap/Tab'
// import Row from 'react-bootstrap/Row'
// import Col from 'react-bootstrap/Col'
// import Nav from 'react-bootstrap/Nav'
// import FullScreen, { FullScreenReferenceType } from '../../FullScreen'
// import { chainedDataIndexExtractor } from '../../../common/utils/chainedDataIndex'
// import GraphIndicator from '../../GraphIndicator'
// import HelpText from '../../HelpText'
// import '../index.scss'

// const ModalFormTabContext = createContext<{
//     formMethods: FormProviderProps["value"],
//     onSubmit: (event: FormEvent) => void,
//     id: any,
//     noValidate: any
// }>(null as any)

// export const useModalFormTab = () => useContext(ModalFormTabContext);

// export type TabFormModalEvent = FormEvent & {
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
//     activeKey: string;
// }

// export interface TabFormModalProps {
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
//     defaultActiveKey: string;
//     tabNavigations: {
//         eventKey: string;
//         label: React.ReactNode;
//         showWhen?: (states: FieldStateNested) => boolean;
//         fieldsWithin?: string[];
//         actionHeader?: React.ReactNode;
//     }[];
//     block?: boolean;
//     noValidate?: boolean;
//     genericHelpText?: boolean;
//     customFormManager?: boolean;
//     prependFooter?: (close: () => void) => React.ReactNode;
// }

// const TabFormModal: React.FunctionComponent<TabFormModalProps> = ({ 
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
//     defaultActiveKey,
//     tabNavigations,
//     prependFooter
// }) => {
//     const fullscreenRef = useRef<FullScreenReferenceType>(null)
//     const form = useForm()
//     const states = form.formState()
//     const [{confirmation, loading, error, validationMessages, activeKey}, setStates] = useState<StateProps>({
//         confirmation: false,
//         loading: false,
//         error: null,
//         validationMessages: null,
//         activeKey: defaultActiveKey
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
//             isSubmit: true,
//             activeKey
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
//             autoFocus={false} //prevent focus around modal only which prevent the help text dialog to edit its forms
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
//                     customURL={genericHelpText ? `/generic-modal?modal=${id}${activeKey ? `#${activeKey}` : ''}` : `${window.location.pathname}?modal=${id}${activeKey ? `#${activeKey}` : ''}`} 
//                     />
//                 {allowFullscreen && (
//                     <FullScreen.Trigger 
//                         as="button" 
//                         type="button" 
//                         className="close other-action"
//                         style={{background: 'none', lineHeight: 1, fontSize: 20}} 
//                         render={(isFullscreen) => (
//                             <i title={isFullscreen ? 'exit fullscreen' : 'enter fullscreen'} className={isFullscreen ? 'fa fa-compress' : 'fa fa-expand'}/>
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
                    
//                         <Tab.Container defaultActiveKey={defaultActiveKey} onSelect={(eventKey) => setStates(prev => ({...prev, activeKey: eventKey!}))}>
//                             <Nav className="nav-tabs nav-bold nav-tabs-line" activeKey={defaultActiveKey}>
//                                 {tabNavigations.filter(({showWhen}) => {
//                                     return showWhen ? showWhen(states) : true
//                                 }).map(({ eventKey, label, fieldsWithin = [] }) => {
//                                     const hasError = fieldsWithin.some((each) => {
//                                         const fieldstate = chainedDataIndexExtractor(each, states)
                                        
//                                         return fieldstate?.isInvalid
//                                     })
//                                     return (
//                                         <Nav.Item key={eventKey}>
//                                             <Nav.Link eventKey={eventKey} className={hasError ? 'text-danger' : undefined}>{label}</Nav.Link>
//                                         </Nav.Item>
//                                     )
//                                 })}
//                             </Nav>
//                             {customFormManager ? (
//                                 <ModalFormTabContext.Provider value={{
//                                     formMethods: form,
//                                     onSubmit: handleSubmit,
//                                     id,
//                                     noValidate
//                                 }}>
//                                     <Tab.Content>
//                                         {body}
//                                     </Tab.Content>
//                                 </ModalFormTabContext.Provider>
//                             ) : (
//                                 <FormManager.Core value={form} onSubmit={handleSubmit} id={id} noValidate={noValidate}>
//                                     <Tab.Content>
//                                         {body}
//                                     </Tab.Content>
//                                 </FormManager.Core>
//                             )}
//                         </Tab.Container>
                    
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

// TabFormModal.defaultProps = {
//     id: "prompt-tab-submit",
//     backdrop: 'static',
//     submit: 'Save',
//     cancel: 'Cancel',
//     confirm: {},
//     block: false
// }

// type DC<T, P> = (props: P) => Promise<T>;

// interface ModalFormTabType<T, P> extends DC<T, P> {
//     TabPane: typeof Tab.Pane;
//     Row: typeof Row;
//     Col: typeof Col;
// }
// //@ts-ignore
// const ModalFormTab: ModalFormTabType<TabFormModalEvent, typeof TabFormModal extends React.FunctionComponent<infer P> ? P : any> = createDimension<TabFormModalEvent, typeof TabFormModal>(TabFormModal, {
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

// ModalFormTab.TabPane = Tab.Pane
// ModalFormTab.Row = Row
// ModalFormTab.Col = Col

// export default ModalFormTab