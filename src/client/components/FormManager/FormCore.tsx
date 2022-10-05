import React, { memo } from 'react'
import { FormProvider, FormProviderProps } from 'formydable'

export interface FormCoreProps extends Omit<React.HTMLProps<HTMLFormElement>, 'value'>{
    value: FormProviderProps["value"];
    disabled?: boolean;
    onSubmit: (event: any) => void;
}

const Form = memo<FormCoreProps>(({ value, onSubmit, children, ...props }) => {
    const { formSubmit } = value
    
    const handleSubmit = formSubmit(onSubmit)

    return (
        <FormProvider value={value}>
            <form role="form" onSubmit={handleSubmit} {...props}>
                {children}
            </form>
        </FormProvider>
    )
})

Form.displayName = 'FormCore'

export default Form
