import React from 'react'
import Spinner from 'react-bootstrap/Spinner'
import { useAuthAPI } from '../../../../common/hooks/useAuthAPI'
import downloadable from '../../../../common/utils/downloadable'
import Icon from '../../../Icon'

interface DownloadBtnProps {
    fileKey: string;
    filename: string;
}

const DownloadBtn: React.FunctionComponent<DownloadBtnProps> = ({fileKey, filename}) => {
    const requestDownload = useAuthAPI('/api/FileURL')
    const handleDownload = () => {
        requestDownload.call({
            data: {
                fileKey,
                forceDownload: true,
                thumbnail: fileKey.includes('upload')
            }
        }).then((response) => {
            downloadable({
                filename,
                url: response.data?.url
            })
        })
        
    }
    return (
        <button title="download" onClick={handleDownload}>
            {requestDownload.loading ? <Spinner animation="border" /> : <Icon name="download" />}
        </button>
    )
}

export default DownloadBtn
