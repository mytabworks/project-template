export type {}
// import React, { useEffect, useRef, useState } from 'react'
// import createDimension, { useDimension } from 'dymension'
// import Draggerjs from 'draggerjs'
// import Modal from 'react-bootstrap/Modal'
// import browserAgent from '../../../common/utils/browserAgent'
// import { FilePreviewType, imagesExt } from '../../FilePreview'
// import Icon from '../../Icon'
// import FileKeyLoader, { FileKeyLoaderProps } from '../../FileKeyLoader'
// import ServicesConfig from '../../ServicesConfig'
// import DownloadBtn from './DownloadBtn'
// import Contents from './Contents'
// import './index.scss'
// import { useObservable } from '../../../common/hooks/useObservable'
// import classNames from 'classnames'

// export interface ModalPreviewProps {
//     types?: FilePreviewType;
//     fileKey: any;
//     includeFileName?: boolean;
//     maxZoom?: number;
//     stepZoom?: number;
//     prependActions?: React.ReactNode;
//     iframeExtSupport?: string[];
//     viewOfficeExtSupport?: string[];
//     showDownload?: boolean;
//     fileKeyLoaderProps?: Omit<FileKeyLoaderProps, 'fileKey' | 'types'>
// }

// const ModalPreview: React.FunctionComponent<ModalPreviewProps> = ({ 
//     types,
//     fileKey: ogFileKey,
//     includeFileName,
//     maxZoom,
//     stepZoom,
//     prependActions,
//     iframeExtSupport,
//     viewOfficeExtSupport,
//     showDownload = true,
//     fileKeyLoaderProps
// }) => {
    
//     const fileKey = includeFileName ? ogFileKey.fileKey : ogFileKey
//     const filename = includeFileName ? ogFileKey.fileName : ogFileKey?.split('/').pop() || ""
//     const fileType = fileKey?.split('.').pop() || 'not-image'
    
//     const {
//         show,
//         resolve,
//     } = useDimension()

//     const handleClose = () => {
//         resolve(true)
//     }

//     const [zoom, setZoom] = useState<number>(0)
//     const [orientation, setOrientation] = useState<any>(null)
//     const [observables] = useObservable({
//         top: 0,
//         left: 0
//     })
//     const scale = 1 + (zoom * stepZoom!)
//     const containerRef = useRef<HTMLDivElement>(null)

//     const handleZoom = (zoomEffect: 'in' | 'out') => {
//         return () => {
//             setZoom(prev => zoomEffect === 'in' ? Math.min(maxZoom!, prev + 1) : Math.max(0, prev - 1))
//         }
//     }

//     const handleZoomIn = handleZoom('in')
//     const handleZoomOut = handleZoom('out')

//     useEffect(() => {
//         const handler = (event: any) => {
//             setOrientation(event.target.screen.orientation.angle)
//         } 
        
//         window.addEventListener('orientationchange', handler)

//         return () => {
//             window.removeEventListener('orientationchange', handler)
//         }
//     }, [])

//     useEffect(() => {
//         if(!imagesExt.includes(fileType)) return;
//         const container = containerRef.current!
//         const image = container?.querySelector('img')!
//         const sensitivityZoomNavigation = scale
//         const imageDimension = {
//             height: image?.clientHeight * scale,
//             width: image?.clientWidth * scale,
//         }

//         const maxNavigate = {
//             top: imageDimension.height > container?.clientHeight ? imageDimension.height - container?.clientHeight : 0,
//             left: imageDimension.width > container?.clientWidth ? imageDimension.width - container?.clientWidth : 0,
//         }

//         if(container?.clientHeight < imageDimension.height || container.clientWidth < imageDimension.width) {
//             container.classList.add('is-grabbable')
//             const dragger = new Draggerjs(container as any, {
//                 allowPointerEvent: !browserAgent.mobile
//             })
//             // fixed the glitch in cursor. in (edge) at the moment there is no solution except this extra call prior to this glitch
//             const glitchFixer = browserAgent.edge ? new Draggerjs(container as any) : null
    
//             dragger.on('dragstart', (event, ctx) => {
//                 ctx.top = observables.top
//                 ctx.left = observables.left
//                 container.classList.add('is-grabbing')
//             })
    
//             dragger.on('dragmove', (event, ctx) => {
//                 // image?.style.marginTop = 
//                 observables.left = Math.max(-maxNavigate.left, Math.min(maxNavigate.left, ctx.left + ((event.moveX - event.startX) * sensitivityZoomNavigation!)))
//                 observables.top = Math.max(-maxNavigate.top, Math.min(maxNavigate.top, ctx.top + ((event.moveY - event.startY) * sensitivityZoomNavigation!)))

//                 image.style.marginTop = `${observables.top}px`
//                 image.style.marginLeft = `${observables.left}px`
//             })

//             dragger.on('dragend', (event, ctx) => {
//                 container.classList.remove('is-grabbing')
//             })
    
//             return () => {
//                 container.classList.remove('is-grabbable')
//                 observables.left = observables.top = 0
//                 image.style.marginTop = null as any
//                 image.style.marginLeft = null as any
//                 dragger.destroy()
//                 glitchFixer?.destroy()
//             }
//         }

//     }, [zoom, orientation])
    
//     return (
//         <Modal
//             className="modal-preview"
//             show={show}
//             onHide={handleClose}
//             fade="true"
//             centered
//             backdrop
//         >
//             <ServicesConfig>
//                 <div className="preview-item-header">
//                     <div className="preview-item-name">
//                         <p>{filename}</p>
//                     </div>
//                     <div className="preview-item-actions">
//                         {prependActions}
//                         {imagesExt.includes(fileType) && (
//                             <>
//                                 <button title="zoom in" onClick={handleZoomIn}>
//                                     <Icon name="search-plus" />
//                                 </button>
//                                 <button title="zoom out" onClick={handleZoomOut}>
//                                     <Icon name="search-minus" />
//                                 </button>
//                             </>
//                         )}
//                         {showDownload && (
//                             <DownloadBtn fileKey={fileKey} filename={filename}/>
//                         )}
//                         <button title="close" onClick={handleClose}>
//                             <Icon name="times" />
//                         </button>
//                     </div>
//                 </div>
//                 <div className={classNames("container-fluid", {'is-image': imagesExt.includes(fileType)})}>
//                     <div ref={containerRef} className="preview-item">
//                         {imagesExt.includes(fileType) ? (
//                             <FileKeyLoader 
//                                 {...fileKeyLoaderProps}
//                                 draggable="false"
//                                 style={{transform: `scale(${scale})`}}
//                                 fileKey={fileKey}
//                                 />
//                         ) : (
//                             <Contents 
//                                 fileKey={fileKey} 
//                                 fileType={fileType} 
//                                 filename={filename} 
//                                 types={types} 
//                                 iframeExtSupport={iframeExtSupport} 
//                                 viewOfficeExtSupport={viewOfficeExtSupport}/>
//                         )}
//                     </div>
//                 </div>
//             </ServicesConfig>
//         </Modal>
//     )
// }

// ModalPreview.defaultProps = {
//     types: {
//         default: <Icon name="file" />
//     },
//     iframeExtSupport: [],
//     viewOfficeExtSupport: [],
//     maxZoom: 5,
//     stepZoom: 0.5
// }

// export default createDimension<boolean, typeof ModalPreview>(ModalPreview, {
//     delay: 150
// })