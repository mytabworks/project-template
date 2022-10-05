import { FieldStateNested, transformSchemaToJSON, useFormField } from 'formydable'
import React, { useEffect, useMemo } from 'react'
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputCore from './InputCore';
import Icon from '../Icon';
import Button from '../Button';
import { normalize } from '../../common/utils/case'
import { InputExtendProps } from './Input';

type RowEventProps = FieldStateNested & { 
    remove: () => void;
    add: () => void;
    isLastIndex: boolean; 
    isFirstIndex: boolean; 
}
export interface FieldArrayMultipleProps extends Omit<InputExtendProps, 'append' | 'prepend'> {
    name: string;
    schema: {
        [name: string]: {
            rules?: string;
            label?: string;
            value?: any;
            placeholder?: string;
            as?: React.ElementType;
            showWhen?: (value: Record<string, any>) => boolean;
            dynamicAttr?: (value: Record<string, any>) => Record<string, any> | null;
            [name: string]: any;
        }
    };
    template?: {
        as?: React.ElementType;
        append?: (event: RowEventProps) => React.ReactNode;
        prepend?: (event: RowEventProps) => React.ReactNode;
        [props: string]: any;
    };
    column?: number;
    disabled?: boolean;
    immidiate?: boolean;
    showAction?: boolean;
    showIconAction?: boolean;
    rowClassName?: string;
    value?: Record<string, any>[];
    append?: (event: { 
        remove: (index?: number) => void;
        add: () => void;
    }) => React.ReactNode;
    prepend?: (event: { 
        remove: (index?: number) => void;
        add: () => void;
    }) => React.ReactNode;
}

const FieldArrayMultiple: React.FunctionComponent<FieldArrayMultipleProps> = ({
    template: {
        as: Template = React.Fragment, 
        append: templateAppend,
        prepend: tempaltePrepend,
        ...templateProps 
    } = {},
    name, 
    schema, 
    disabled,
    column = 2, 
    immidiate, 
    showAction, 
    showIconAction,
    rowClassName,
    value,
    append,
    prepend
}) => {
    const { formUpdate, getFieldArray, setFieldArray, setFieldArrays, removeFieldArray } = useFormField()

    const defaultSchema = useMemo(() => {
        return Object.keys(schema).reduce((result: any, key: string) => {
            const {rules, label, value = ""} = schema[key]
            result[key] = { rules, label, value }
            return result
        }, {})
    }, [])

    const states: Array<FieldStateNested> = getFieldArray(name)

    const count = states.length

    useEffect(() => {
        if((value && value.length > 0)) {
            const defaultArrayValues = value.map((item) => {
                return Object.keys(defaultSchema).reduce<Record<string, any>>((result, key) => {
                    result[key] = {
                        ...defaultSchema[key],
                        value: item[key]
                    }
                    return result
                }, {})
            })

            setFieldArrays(name, defaultArrayValues, true)
        } else if(immidiate) {
            setFieldArray(name, defaultSchema, true)
        }

        return () => removeFieldArray(name)
    }, [value])

    const appendEvent = useMemo(() => ({
        count,
        remove: (index?: number) => removeFieldArray(name, index),
        add: () => setFieldArray(name, defaultSchema, true)
    }), [defaultSchema, count])

    return (
        <>
            {prepend && prepend(appendEvent)}
            {states.map((state, index, array) => {
                const lastIndex = array.length - 1
                const keys = Object.keys(state).filter((key) => !!state[key].label)
                const clusters = new Array(Math.ceil(keys.length/column)).fill(0).map((_, index) => keys.slice(index * column, (index + 1) * column))
                const isLastIndex = index === lastIndex
                const isFirstIndex = index === 0
                return (
                    <Template key={index} {...templateProps}>
                        {tempaltePrepend && tempaltePrepend({
                            ...(state as any), 
                            remove: () => {
                                removeFieldArray(name, index)
                            },
                            add: () => {
                                setFieldArray(name, defaultSchema, true)
                            },
                            isLastIndex,
                            isFirstIndex
                        })}
                        {clusters.map((cluster, clusterIndex) => {
                            return (
                                <Row key={clusterIndex} className={rowClassName}>
                                    
                                    {cluster.map((key, keyIndex) => {
                                        const {value, showWhen, dynamicAttr, ...props} = schema[key]
                                        const transformedState = (showWhen || dynamicAttr) ? transformSchemaToJSON(state) : null
                                        return (showWhen ? showWhen(transformedState!) : true) ? (
                                            <Col key={keyIndex} sm={12/cluster.length}>
                                                <InputCore 
                                                    name={`${name}[${index}].${key}`} 
                                                    onChange={formUpdate} 
                                                    state={state[key]}
                                                    disabled={disabled}
                                                    iconAppend={showIconAction && (clusterIndex === 0 && keyIndex === column - 1) ? (
                                                        <span
                                                            title={isLastIndex ? 'add more' : 'remove'}
                                                            className="d-inline-flex align-items-center"
                                                            style={{cursor: "pointer"}}
                                                            onClick={() => {
                                                                if(isLastIndex) {
                                                                    setFieldArray(name, defaultSchema, true)
                                                                } else {
                                                                    removeFieldArray(name, index)
                                                                }
                                                            }}>
                                                            <Icon name={isLastIndex ? "plus" : "trash-alt"}/>
                                                        </span>
                                                    ) : undefined}
                                                    {...props}
                                                    {...(dynamicAttr && dynamicAttr(transformedState!))}/>
                                            </Col>
                                        ) : null
                                    })}
                                </Row>
                            )
                        })}
                        {templateAppend && templateAppend({
                            ...(state as any), 
                            remove: () => {
                                removeFieldArray(name, index)
                            },
                            add: () => {
                                setFieldArray(name, defaultSchema, true)
                            },
                            isLastIndex,
                            isFirstIndex
                        })}
                    </Template>
                )
            })}
            {append && append(appendEvent)}
            {((showAction && immidiate && states.length > 1) || !immidiate)&& (
                <Button 
                    className="mb-3 d-block"
                    disabled={disabled}
                    onClick={() => {
                        if(states.length > 0) {
                            removeFieldArray(name, immidiate ? 0 : undefined, immidiate)
                        } else {
                            setFieldArray(name, defaultSchema, true)
                        }
                    }}>
                    {states.length > 0 ? "REMOVE ALL" : `CREATE ${normalize(name).toLocaleUpperCase()}`}
                </Button>
            )}
        </>
    )
}

FieldArrayMultiple.defaultProps = {
    immidiate: true,
    showAction: true,
    showIconAction: true,
    column: 2,
}

export default FieldArrayMultiple;