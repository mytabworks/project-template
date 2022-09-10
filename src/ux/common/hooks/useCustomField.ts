import { useState, useRef, useEffect, useContext, createContext } from 'react'
// import { useCustomFieldReseter } from '../../components/CustomFieldReseter';

export type CustomFieldStates<V = any> = {
    value: V;
    dirty: boolean;
    multiple: boolean;
    customStates?: Record<string, any>;
}

export type CustomFieldEvent<V = any> = { 
    name: string, 
    value: V, 
    target: { 
        name: string, 
        value: V
    }
}

export type CustomFieldOnChange<V = any> = (event: CustomFieldEvent<V>) => void;

export type CustomFieldProps<V = any> = {
    name: string;
    value: any;
    onChange?: CustomFieldOnChange<V>;
    onResetStates?: (customState: CustomFieldStates<V>) => (CustomFieldStates<V> | void);
    customStates?: Record<string, any>;
    multiple?: boolean;
    triggerChangeWithoutDirtying?: boolean;
}

export const useCustomField = <V = any>({
    name,
    value,
    onChange,
    onResetStates,
    customStates = {},
    multiple = false,
    triggerChangeWithoutDirtying = false
}: CustomFieldProps<V>) => {
    const selectStates = useState<CustomFieldStates<V>>({
        value,
        dirty: false,
        multiple,
        customStates
    })

    const [states, setStates] = selectStates

    const mounted = useRef(false)

    useEffect(() => {
        if(mounted.current && (states.dirty || triggerChangeWithoutDirtying) && onChange) {

            const target = { name, value: states.value }

            onChange({...target, target})
        }
        // eslint-disable-next-line
    }, [states.value])

    useEffect(() => {
        if(mounted.current) {
            if((multiple && Array.isArray(value) ? value.length === 0 : !value) && states.dirty) {
                /* reset value */
                const otherStates = onResetStates && onResetStates({...states})
                setStates(prev => ({...prev, value, dirty: false, ...otherStates }))
            } else if(states.value !== value) {
                /* changes value from props */
                setStates(prev => ({...prev, value }))
            }
        }
        // eslint-disable-next-line
    }, [value])

    useEffect(() => {
        mounted.current = true
    }, [])

    // const customFieldReseter = useCustomFieldReseter()

    // useEffect(() => {
    //     if(!!customFieldReseter) {
    //         customFieldReseter.addCallbackReset(name, () => setStates(prev => ({...prev, dirty: false })))

    //         return () => {
    //             customFieldReseter.removeCallbackReset(name)
    //         }
    //     }
    // }, [])

    return selectStates
}

export const CustomFieldContext = createContext<[CustomFieldStates, React.Dispatch<React.SetStateAction<CustomFieldStates>>]>([] as any)

export const useCustomFieldContext = () => useContext(CustomFieldContext)

type UseCustomFieldOption = {
    value?: any;
    onClick?: (event: any) => void;
}

export const useCustomFieldOption = ({value, onClick}: UseCustomFieldOption) => {
    const [customField, setCustomField] = useCustomFieldContext()
    if(typeof customField === 'undefined') {
        throw Error("Parent Component is missing (The CustomFieldContext.Provider is missing)")
    }
    const selected = customField.multiple && Array.isArray(customField.value) ? customField.value.includes(value) : customField.value === value
    const hasValue = typeof value !== 'undefined'
    const handleClick = hasValue ? (event: any) => {
        onClick && onClick(event)
        setCustomField(prev => {
            let theValue = value

            if(customField.multiple) {
                if(selected) {
                    theValue = prev.value.filter((item: any) => item !== value)
                } else {
                    theValue = Array.isArray(prev.value) ? [...prev.value, value] : [value]
                }
            }

            return {
                ...prev, 
                value: theValue, 
                dirty: true
            }
        })
    } : onClick

    return {
        ...customField,
        selected,
        handleClick,
    }
}