export type {}
// import React, { useEffect, useState } from 'react'
// import createDimension, { useDimension } from 'dymension'
// import Carousel from 'react-bootstrap/Carousel'
// import Modal from 'react-bootstrap/Modal'
// import FilePreview, { FilePreviewType, imagesExt, videosExt } from '../../FilePreview'
// import Icon from '../../Icon'
// import Image from '../../Image'
// import { useAPI } from '../../../common/hooks/useAPI'
// import cookie from '../../../common/utils/cookie'
// import Loader from '../../Loader'
// import branding from '@config/branding'
// import './index.scss'

// interface ModalCarouselProps {
//     types?: FilePreviewType;
//     defaultIndex?: number;
//     previews?: string[];
//     filekeys: any[];
//     includeFileName?: boolean;
//     iframeExtSupport?: string[];
//     viewOfficeExtSupport?: string[];
// }

// const ModalCarousel: React.FunctionComponent<ModalCarouselProps> = ({ 
//     types,
//     defaultIndex,
//     previews,
//     filekeys,
//     includeFileName,
//     iframeExtSupport,
//     viewOfficeExtSupport
// }) => {
//     const [{finalPreviews, loading}, setStates] = useState({
//         finalPreviews: previews || [],
//         loading: false
//     })
//     const {
//         show,
//         resolve,
//     } = useDimension()

//     const handleClose = () => {
//         resolve(true)
//     }
    
//     const token = cookie.get(branding.token.name)
//     const requestFileURL = useAPI('/api/FileURL', {
//         headers: {
//             "Authorization": `Bearer ${token}`,
//         }
//     })

//     useEffect(() => {
//         if((!previews || Array.isArray(previews) && previews.length === 0) && filekeys.length > 0) {
//             Promise.all(filekeys.map((eachFilekey) => {
//                 const fileKey = includeFileName ? eachFilekey.fileKey : eachFilekey
//                 return requestFileURL.call({
//                     data: {
//                         fileKey,
//                         forceDownload: false,
//                         thumbnail: fileKey.includes('upload'),
//                     }
//                 }).then((response) => response.data?.url)
//             }))
//             .then((urls) => {
//                 setStates(prev => ({...prev, loading: false, finalPreviews: urls.filter((url) => !!url)}))
//             })
//         }
//     }, [previews, filekeys])

//     return (
//         <Modal
//             className="modal-carousel"
//             show={show}
//             onHide={handleClose}
//             fade="true"
//             centered
//             backdrop
//         >
//             <button className="modal-carousel-close" onClick={handleClose}>
//                 <Icon name="times" />
//             </button>
//             <Carousel 
//                 prevIcon={finalPreviews.length === 1 ? null : undefined}
//                 nextIcon={finalPreviews.length === 1 ? null : undefined}
//                 interval={null}
//                 indicators={finalPreviews.length > 1}
//                 defaultActiveIndex={defaultIndex}>
//                 {loading ? (
//                     <Carousel.Item>
//                         <div className="item-content">
//                             <Loader active style={{zIndex: 0}} transparent={true}/>
//                         </div>
//                     </Carousel.Item>
//                 ) : finalPreviews.map((item, index) => {
//                     const eachFilekey = filekeys[index]
//                     const fileKey = includeFileName ? eachFilekey.fileKey : eachFilekey
//                     const filename = includeFileName ? eachFilekey.fileName : eachFilekey?.split('/').pop() || ""
//                     const fileType = fileKey?.split('.').pop() || 'not-image'
//                     return (
//                         <Carousel.Item key={index}>
//                             <div className="item-content">
//                                 {imagesExt.includes(fileType) ? (
//                                     <Image 
//                                         src={item}
//                                         alt={`${filename}-slide`} 
//                                         />
//                                 ) : videosExt.includes(fileType) ? (
//                                     <video src={item} controls width="100%"/>
//                                 ) : ['pdf', ...iframeExtSupport!].includes(fileType) ? (
//                                     <iframe src={item} width="100%"/>
//                                 )  : ['doc', 'docx', 'xlsx', 'xls', 'csv', 'ppt', 'pptx', ...viewOfficeExtSupport!].includes(fileType) ? (
//                                     <iframe src={'https://view.officeapps.live.com/op/embed.aspx?src=' + encodeURIComponent(item)} width="100%"/>
//                                 ) : (
//                                     <div className='not-image'>
//                                         <FilePreview filename={filename} types={types as FilePreviewType}/>
//                                     </div>
//                                 )}
//                                 <div className="item-caption">
//                                     <p>{filename}</p>
//                                 </div>
//                             </div>
//                         </Carousel.Item>
//                     )
//                 })}
//             </Carousel>
//         </Modal>
//     )
// }

// ModalCarousel.defaultProps = {
//     types: {
//         default: <Icon name="file" />
//     },
//     iframeExtSupport: [],
//     viewOfficeExtSupport: []
// }

// export default createDimension<boolean, typeof ModalCarousel>(ModalCarousel, {
//     delay: 150
// })