import { Validozer } from "formydable"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useAuthAPI } from "./useAuthAPI"
import { CustomFieldOnChange, useCustomField } from "./useCustomField"

export interface UseFileFieldLogic {
    name: string;
    value?: any;
    previews?: any;
    onChange?: CustomFieldOnChange;
    multiple?: boolean;
    getEndpoint?: string;
    uploadEndpoint?: string;
    rules?: string;
    includeFileName?: boolean;
}

export const useFileFieldLogic = ({
    name,
    value,
    previews,
    onChange,
    multiple,
    getEndpoint = '/api/FileURL',
    uploadEndpoint = '/api/FileUpload',
    rules,
    includeFileName
}: UseFileFieldLogic) => {
    const [{customStates, ...customField}, setCustomField] = useCustomField({
        name,
        // eslint-disable-next-line
        value: useMemo(() => (Array.isArray(value) ? value : value && [value]) || [], [value]),
        onChange,
        onResetStates: (prev) => ({
            ...prev, value: [], dirty: false, customStates: { previews: [] }
        }),
        customStates: {
            // eslint-disable-next-line
            previews: useMemo(() => [], []),
        },
        multiple: true
    })
    const [loading, setLoading] = useState<boolean>(false)
    const requestFileURL = useAuthAPI(getEndpoint)
    const requestFileUpload = useAuthAPI(uploadEndpoint)

    const getURL = useCallback((fileKeys: string[]) => {
        return Promise.all(fileKeys.map((fileKey) => {
            return requestFileURL.call({
                data: {
                    fileKey,
                    forceDownload: false,
                    thumbnail: fileKey.includes('upload')
                }
            })
        }))
        .then((allResponse) => {
            setLoading(false)
            return allResponse.map((response) => {
                return response.data?.url
            })
            .filter((url) => !!url)
        })
        // eslint-disable-next-line
    }, [getEndpoint])
    
    useEffect(() => {
        const defaultPreview = (Array.isArray(previews) ? previews : previews && [previews]) || []

        if(defaultPreview && defaultPreview.length > 0) {
            setLoading(true)
            getURL(defaultPreview).then((previews) => {
                setCustomField(prev => ({
                    ...prev, 
                    customStates: {
                        ...customStates,
                        previews: [...prev.customStates!.previews, ...previews]
                    } 
                }))
            })
        }
        // eslint-disable-next-line
    }, [previews])

    const handleChange = useCallback((event) => {
        const files = Array.from(event.target.files) as any[]
        if(files.length > 0) {
            if(rules) {
                const validator = Validozer.make({ [name]: files }, {
                    [name] : {
                        label: name,
                        rules
                    }
                })
        
                if(validator.fails()) return
            }
            
            setLoading(true)
            Promise.all(files.map((file: any) => {
                const payload = new FormData()
                payload.set('file', file)
                return requestFileUpload.call({
                    data: payload
                })
            }))
            .then((allResponse) => {
                const fileKeys = allResponse.map((response, index) => {
                    const fileKey = response.data[0]
                    return includeFileName ? {
                        fileKey,
                        fileName: files[index]?.name
                    } : fileKey
                })
                getURL(includeFileName ? fileKeys.map((each) => each.fileKey) : fileKeys).then((previews) => {
                    setCustomField(prev => ({
                        ...prev,
                        dirty: true,
                        value: multiple ? [...prev.value, ...fileKeys] : fileKeys,
                        customStates: {
                            ...customStates,
                            previews: multiple ? [...prev.customStates!.previews, ...previews] : previews
                        } 
                    }))
                })
            })
        }

        event.target.value = ''
        // eslint-disable-next-line
    }, [getEndpoint, uploadEndpoint])

    return {
        ...customField,
        customStates,
        loading,
        handleChange,
        setCustomField
    }
}