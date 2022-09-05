import { useAuthAPI } from "./useAuthAPI"

export const useEditorFieldFileUpload = () => {
    const requestUpload = useAuthAPI('/api/FileUploadHTML')

    return (file: FileList[number]) => {
        return new Promise((resolve, reject) => {
            const payload = new FormData()

            payload.set('file', file)
            
            requestUpload.call({
                data: payload
            })
            .then((response) => {
                resolve({
                    data: {
                        link: response.data[0]
                    }
                })
            })
            .catch((e) => {
                reject(e)
            })
        })
    }
}