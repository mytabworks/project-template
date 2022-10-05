import React, { useEffect } from 'react'
import { useFormField, FieldStateNested, FieldState } from 'formydable'
import InputCore from './InputCore'
import { InputExtendProps } from './Input'

export interface SingleFieldInObjectArrayProps extends InputExtendProps {
    name: string;
    keyName: string;
    defaultSchema: { 
        [name: string]: {
            rules?: string;
            label?: string;
            value?: any;
        }
    }[];
    placeholder?: string;
    disabled?: boolean;
    dynamicProps?: (states: Record<string, FieldState>) => Record<string, any>;
    [name: string]: any;
    asWrapper?: React.ElementType;
}

const SingleFieldInObjectArray: React.FunctionComponent<SingleFieldInObjectArrayProps> = ({name, keyName, defaultSchema, dynamicProps, asWrapper: Wrapper = React.Fragment, ...props}) => {
    const { formUpdate, getFieldArray, setFieldArray, setFieldArrays, removeFieldArray } = useFormField()

    const states: Array<FieldStateNested> = getFieldArray(name)

    useEffect(() => {
        
        setFieldArrays(name, defaultSchema, true)
        
        return () => removeFieldArray(name)
    // eslint-disable-next-line
    }, [defaultSchema])

    return (
        <>
            {states.map((state, index) => {
                const mapDynamicProps = dynamicProps && dynamicProps(state)
                
                return (
                    <Wrapper key={index}>
                        <InputCore 
                            key={index}
                            {...props}
                            {...mapDynamicProps}
                            name={`${name}[${index}].${keyName}`}
                            label={state[keyName]?.label}
                            onChange={formUpdate}
                            state={state[keyName]}
                            />
                    </Wrapper>
                )
            })}
        </>
    )
}

SingleFieldInObjectArray.defaultProps = {}

export default SingleFieldInObjectArray;