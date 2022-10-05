import React, { memo } from 'react'
import { FieldState, useFormField } from 'formydable'

interface StatesProps {
    children: (states: Record<string, FieldState>) => React.ReactNode;
}

const States: React.FunctionComponent<StatesProps> = memo(({ children }) => {

    const { formState } = useFormField()

    const states = formState()

    return <>{children(states)}</>
})

States.displayName = 'States'

export default States;
