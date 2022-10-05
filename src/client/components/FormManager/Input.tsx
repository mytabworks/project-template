import React, { forwardRef, useEffect } from 'react'
import { FieldState, useFormField } from 'formydable'
import InputCore from './InputCore'
import { AliasFunction, AliasProps } from '../types'
import Form from 'react-bootstrap/Form'
export interface InputProps extends AliasProps {
    type?: string;
    label?: string;
    displayLabel?: boolean;
    labelAppend?: React.ReactNode;
    labelPrepend?: React.ReactNode;
    value?: any;
    defaultValue?: any; // defaultValue when field is untouch an then submitted or when reseted the form
    rules?: string;
    name: string;
    id?: string;
    disabled?: boolean;
    validable?: boolean;
    formGroupClassName?: string;
    description?: string;
    helpText?: string;
    length?: number;
    required?: boolean;
    iconPrepend?: React.ReactNode;
    iconAppend?: React.ReactNode;
    prepend?: React.ReactNode;
    append?: React.ReactNode;
    barelyPrepend?: React.ReactNode;
    barelyAppend?: React.ReactNode;
    formGroupAppend?: React.ReactNode;
    stripped?: boolean;
    wrappedValueOnArray?: boolean;
    mutateOnChange?: (...args: any[]) => ({ name: string, value: any })
}

export type InputExtendProps = Omit<InputProps, 'mutateOnChange' | 'wrappedValueOnArray' | 'defaultValue'>

const Input: AliasFunction<typeof Form.Control, InputProps> = forwardRef(({mutateOnChange, wrappedValueOnArray, defaultValue, ...props}, ref) => {

    const { label, value, rules, name } = props

    const { formState, formUpdate, formRegistry, setFieldValue } = useFormField()

    const state = formState(name) as FieldState
    
    useEffect(() => {
        return formRegistry({
            label: label || name,
            value: wrappedValueOnArray ? (value ? [value] : []) : (props as any).nullableValue ? value : value === null ? undefined : value,
            defaultValue,
            rules,
            name
        })
    // eslint-disable-next-line
    }, [value, rules])

    const handleChange = mutateOnChange ? 
        (...args: any[]) => {
            const { name, value } = mutateOnChange(...args)
            setFieldValue(name, value)
        } : formUpdate

    return (
        <InputCore
            ref={ref}
            {...props}
            name={name}
            state={state}
            onChange={handleChange} />
    )
})

Input.displayName = 'Input'

export default Input;
