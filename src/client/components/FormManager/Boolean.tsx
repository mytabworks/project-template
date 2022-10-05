import React, { memo, useEffect } from 'react'
import { FieldState, useFormField } from 'formydable'
import classNames from 'classnames'
import Form from 'react-bootstrap/Form'
import { FormCheckProps } from 'react-bootstrap/FormCheck'

interface BooleanProps extends FormCheckProps {
    label?: React.ReactNode;
    checked?: boolean;
    rules?: string;
    name: string;
    id?: string;
    disabled?: boolean;
    validable?: boolean;
    labelClass?: string;
    description?: string;
}

const Boolean: React.FunctionComponent<BooleanProps> = memo(({label, rules, name, checked, className, labelClass, description, required, ...props}) => {

    const { formState, formRegistry, setFieldValue } = useFormField()

    const state = formState(name) as FieldState
    
    useEffect(() => {
        return formRegistry({
            label: typeof label === 'string' ? label as string : name,
            value: checked,
            rules,
            name
        })
    // eslint-disable-next-line
    }, [checked])

    const handleChange = (e: any) => {
        setFieldValue(name, e.target.checked)
    }

    return (
        <Form.Group>
            <Form.Check custom id={name} {...props} checked={state.value} className={classNames(className, { 'is-invalid' : state.isInvalid })} isInvalid={state.isInvalid} label={label} onChange={handleChange}/>
            <Form.Control.Feedback className="mt-4" type="invalid">
                {state.message}
            </Form.Control.Feedback>
            {(!state.isInvalid && description) && (
                <Form.Text className="text-muted mt-4">
                    {description}
                </Form.Text>
            )}
        </Form.Group>
    )
})

Boolean.defaultProps = {
    checked: false
}

Boolean.displayName = 'Boolean'

export default Boolean;
