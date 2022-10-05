import React, { memo } from 'react'
import { FieldState, useFormField } from 'formydable'
import { FormCheckProps } from 'react-bootstrap/FormCheck'

interface ConditionProps extends FormCheckProps {
    name?: string;
    showWhen: (value: any) => boolean;
}

const Condition: React.FunctionComponent<ConditionProps> = memo(({ name, showWhen, children }) => {

    const { formState } = useFormField()

    const state = formState(name) as FieldState

    return <>{showWhen(name ? state.value : state) ? children : null}</>
})

Condition.displayName = 'Condition'

export default Condition;
