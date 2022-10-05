import React, { forwardRef } from 'react'
import ButtonRB, { ButtonProps as BSButtonProps } from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'

export interface ButtonProps extends BSButtonProps {
    loading?: boolean;
    form?: string;
    removeTextWhenLoading?: boolean;
    prependSpinner?: boolean; 
}

const Button = forwardRef<any, ButtonProps>(({removeTextWhenLoading, loading, prependSpinner, children, ...props}, ref) => {
    return (
        <ButtonRB ref={ref} disabled={loading} {...props}>
            {(loading && prependSpinner === true) && <Spinner animation="border" className={removeTextWhenLoading ? undefined : "ml-3"} size="sm" />}
            {loading && removeTextWhenLoading ? null : children}
            {(loading && prependSpinner === false) && <Spinner animation="border" className={removeTextWhenLoading ? undefined : "ml-3"} size="sm" />}
        </ButtonRB>
    )
})

Button.displayName = 'Button'

export default Button
