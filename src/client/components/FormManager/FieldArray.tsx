import React, { FunctionComponent, useEffect } from 'react'
import { FieldState, useFormField } from 'formydable'
import Button from 'react-bootstrap/Button'
import InputCore from './InputCore'
import Icon from '../Icon'
import { InputProps } from './Input'

export interface FieldArrayProps extends InputProps {
    value?: any[];
    immidiate?: boolean;
    showAction?: boolean;
}

const FieldArray: FunctionComponent<FieldArrayProps> = ({name, immidiate, showAction, label, value, ...props}) => {
    const { formUpdate, getFieldArray, setFieldArray, setFieldArrays, removeFieldArray } = useFormField()

    const defaultSchema = {
        label: label || name,
        rules: props.rules,
        value: ""
    }

    const states = getFieldArray(name) as FieldState[]

    useEffect(() => {
        if(value && Array.isArray(value)) {
            setFieldArrays(name, value.map((each) => {
                return {...defaultSchema, value: each }
            }))
        }
    }, [value])

    useEffect(() => {
        if(immidiate && !value)
            setFieldArray(name, defaultSchema)

        return () => removeFieldArray(name)
    }, [])

    return (
        <>
            {states.map((state, index, array) => {
                const lastIndex = array.length - 1
                return (
                    <InputCore 
                        key={index}
                        {...props}
                        name={`${name}[${index}]`}
                        onChange={formUpdate} 
                        label={index === 0 ? label : undefined}
                        state={state}
                        iconAppend={(
                            <span
                                title={index === lastIndex ? 'add more' : 'remove'}
                                className="d-inline-flex align-items-center"
                                style={{cursor: "pointer"}}
                                onClick={() => {
                                    if(index === lastIndex) {
                                        setFieldArray(name, defaultSchema)
                                    } else {
                                        removeFieldArray(name, index)
                                    }
                                }}>
                                <Icon name={index === lastIndex ? "plus" : "trash-alt"}/>
                            </span>
                        )}/>
                )
            })}
            {((showAction && immidiate && states.length > 1) || !immidiate)&& (
                <Button
                    className="mb-3 d-block"
                    disabled={props.disabled}
                    onClick={() => {
                        if(states.length > 0) {
                            removeFieldArray(name, immidiate ? 0 : undefined, immidiate)
                        } else {
                            setFieldArray(name, defaultSchema)
                        }
                    }}>
                    {states.length > 0 ? "REMOVE ALL" : `CREATE ${name.toLocaleUpperCase()}`}
                </Button>
            )}
        </>
    )
}

FieldArray.defaultProps = {
    immidiate: true,
    showAction: true,
}

export default FieldArray;