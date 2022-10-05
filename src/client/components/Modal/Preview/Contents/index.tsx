export type {}
// import React, { useEffect } from 'react'
// import Spinner from 'react-bootstrap/Spinner'
// import FilePreview, { FilePreviewType, videosExt, audioExt } from '../../../FilePreview'
// import { useAuthAPI } from '../../../../common/hooks/useAuthAPI'
// import { ModalPreviewProps } from '..'

// interface ContentsProps extends Pick<ModalPreviewProps, 'iframeExtSupport' | 'viewOfficeExtSupport' | 'types'> {
//     fileKey: string;
//     fileType: string;
//     filename: string;
// }

// const Contents: React.FunctionComponent<ContentsProps> = ({
//     fileKey,
//     fileType, 
//     filename,
//     iframeExtSupport, 
//     viewOfficeExtSupport,
//     types
// }) => {
//     const request = useAuthAPI('/api/FileURL')
//     const source = request.response?.url

//     useEffect(() => {
//         if(fileKey && [
//             ...videosExt, 
//             ...audioExt, 
//             'pdf', 
//             ...iframeExtSupport!, 
//             'doc', 'docx', 'xlsx', 'xls', 'csv', 'ppt', 'pptx', 
//             ...viewOfficeExtSupport!
//         ].includes(fileType)) {
//             request.call({
//                 data: {
//                     fileKey,
//                     forceDownload: false,
//                     thumbnail: fileKey.includes('upload')
//                 }
//             })
//         }
//     }, [fileKey, fileType])
    
//     return request.loading ? (
//         <Spinner animation="grow" size="sm" />
//     ) :  videosExt.includes(fileType) ? (
//         <video src={source} controls width="100%"/>
//     ) : audioExt.includes(fileType) ? (
//             <audio controls>
//                 <source src={source}/>
//                 Your browser does not support the audio element
//             </audio>
//     ) : ['pdf', ...iframeExtSupport!].includes(fileType) ? (
//         <iframe src={source} width="100%"/>
//     )  : ['doc', 'docx', 'xlsx', 'xls', 'csv', 'ppt', 'pptx', ...viewOfficeExtSupport!].includes(fileType) ? (
//         <iframe src={'https://view.officeapps.live.com/op/embed.aspx?src=' + encodeURIComponent(source)} width="100%"/>
//     ) : (
//         <div className='not-image'>
//             <FilePreview filename={filename} types={types as FilePreviewType}/>
//         </div>
//     )
// }

// export default Contents
