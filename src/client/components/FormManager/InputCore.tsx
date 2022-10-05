import React, { forwardRef } from 'react'
import { FormUpdateProp, FieldState } from 'formydable'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import classNames from 'classnames'
import { InputExtendProps } from './Input'
import { AliasFunction } from '../types'

export interface InputCoreProps extends InputExtendProps {
    onChange: (props: FormUpdateProp) => void;
    state: FieldState;
}

const InputCore: AliasFunction<typeof Form.Control, InputCoreProps> = forwardRef(({ 
    as: Component = Form.Control,
    label,
    labelAppend,
    labelPrepend,
    displayLabel = true,
    value, 
    rules, 
    name, 
    id,
    onChange, 
    state,
    required,
    validable,
    formGroupClassName,
    description,
    helpText,
    length,
    iconAppend,
    iconPrepend,
    prepend,
    append,
    barelyAppend,
    barelyPrepend,
    formGroupAppend,
    stripped,
    ...props 
}, ref) => {
    const isTextarea = props.type === 'textarea'
    return stripped ? (
        <Component
            ref={ref}
            {...props}
            as={isTextarea ? 'textarea' : undefined}
            name={name}
            id={id || name}
            value={props.type !== 'file' ? state.value : undefined}
            isInvalid={state.isInvalid}
            isValid={validable ? state.isValidated && !state.isInvalid : undefined}
            onChange={onChange}
            maxLength={length}
            />
    ) : (
        <Form.Group className={formGroupClassName}>
            {(displayLabel && label) && (
                <Form.Label htmlFor={id || name} className={!!helpText ? 'mb-0' : undefined}>
                    {labelPrepend}{label}{required && <span className="text-danger"> *</span>}{labelAppend}
                </Form.Label>
            )}
            {helpText && (
                <Form.Text className="form-help-text text-muted mt-0 mb-1">
                    {helpText}
                </Form.Text>
            )}
            {iconAppend || iconPrepend || prepend || append || barelyAppend || barelyPrepend ? (
                <InputGroup className={classNames('', { 'is-invalid': state.isInvalid, 'is-valid': validable ? state.isValidated && !state.isInvalid : undefined })}>
                    {iconPrepend && (
                        <InputGroup.Text>
                        {iconPrepend}
                        </InputGroup.Text>
                    )}
                    {prepend && (
                        <InputGroup.Text>
                         {prepend}
                        </InputGroup.Text>
                    )}
                    {barelyPrepend}
                    <Component
                        ref={ref}
                        {...props}
                        as={isTextarea ? 'textarea' : undefined}
                        name={name}
                        id={id || name}
                        value={props.type !== 'file' ? state.value : undefined}
                        isInvalid={state.isInvalid}
                        isValid={validable ? state.isValidated && !state.isInvalid : undefined}
                        onChange={onChange}
                        maxLength={length}
                        />
                    {barelyAppend}
                    {append && (
                        <InputGroup.Text>
                        {append}
                        </InputGroup.Text>
                    )}
                    {iconAppend && (
                        <InputGroup.Text>
                        {iconAppend}
                        </InputGroup.Text>
                    )}
                </InputGroup>
            ) : (
                <Component
                    ref={ref}
                    {...props}
                    as={isTextarea ? 'textarea' : undefined}
                    name={name}
                    id={id || name}
                    value={props.type !== 'file' ? state.value : undefined}
                    isInvalid={state.isInvalid}
                    isValid={validable ? state.isValidated && !state.isInvalid : undefined}
                    onChange={onChange}
                    maxLength={length}
                    />
            )}
            <Form.Control.Feedback type="invalid">
                {state.message}
            </Form.Control.Feedback>
            {(!state.isInvalid && description) && (
                <Form.Text className="form-description text-muted d-flex">
                    {description} {(length && typeof state.value === 'string') && <span className="ml-auto">({state.value.replace(/\<.+?\>/g, "")?.length}/{length})</span>}
                </Form.Text>
            )}
            {formGroupAppend}
        </Form.Group>
    )
})

InputCore.displayName = 'InputCore'

export default InputCore;
