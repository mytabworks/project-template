import { useAuthAPI } from "./useAuthAPI"
import { useState } from "react"

type DropFileUploadProps = {
    onGetFileKeys: (props: {fileKey: string, fileName: string}[]) => void;
    onDrop?: (event: any) => void;
    onDragOver?: (event: any) => void;
    onDragEnter: (event: any) => void;
    onDragLeave: (event: any) => void;
}

export const useDropFileUpload = ({onGetFileKeys, onDrop, onDragOver, onDragEnter, onDragLeave}: DropFileUploadProps) => {
    const requestUpload = useAuthAPI('/api/FileUpload')
    const [loading, setLoading] = useState<boolean>(false)

    const handleDrop = (event: any) => {
        event.stopPropagation();
        event.preventDefault();
        if(onDrop) onDrop(event)
        if(loading) return;
        setLoading(true)
        const files: File[] = Array.from(event.dataTransfer.items).map((item: any) => item.getAsFile())
        Promise.all(files.map((file: File) => {
            const payload = new FormData()
            payload.set('file', file)
            return requestUpload.call({
                data: payload
            })
        }))
        .then((allResponse) => {
            const fileKeys = allResponse.map((response, index) => {
                const fileKey = response.data[0]
                return {
                    fileKey,
                    fileName: files[index]?.name
                }
            })
            setLoading(false)
            onGetFileKeys(fileKeys)
        })
    }

    const handleDragOver = (event: any) => {
        event.preventDefault();
        if(onDragOver) {
            onDragOver(event)
        }
    }

    return {
        loading,
        handle: {
            onDrop: handleDrop,
            onDragOver: handleDragOver,
            onDragEnter,
            onDragLeave
        }
    }
}