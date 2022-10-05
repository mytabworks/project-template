import React, { useState, useEffect } from 'react'
import Spinner from 'react-bootstrap/Spinner'
import classNames from 'classnames'
import { CSSTransition } from 'react-transition-group'
// import './index.scss'

export interface LoaderProps extends Omit<React.HTMLProps<HTMLDivElement>, 'size'> {
    active: boolean;
    fixed?: boolean;
    noTransition?: boolean;
    hasSpinner?: boolean;
    transparent?: boolean;
    position?: 'center' | 'bottom' | 'top';
    size?: "sm";
}

const Loader: React.FunctionComponent<LoaderProps> = ({ 
    active, 
    fixed, 
    noTransition, 
    size, 
    position, 
    hasSpinner, 
    transparent, 
    className, 
    children, 
    ...props 
}) => {
    const [show, setShow] = useState<boolean>(false)
    
    useEffect(() => {
        setShow(active)
    }, [active])

    return (
        <CSSTransition in={show} timeout={150} classNames={{
                enter: '',
                enterActive: 'show',
                enterDone: 'show',
                exit: '',
                exitActive: '',
                exitDone: '',
            }}
            unmountOnExit>
            <div {...props} className={classNames("loader-spinner", { 'no-transition': noTransition, fixed, transparent }, className)}>
                <div className={classNames("loader-content", { [position!]: true })}>
                    {hasSpinner && <Spinner animation="border" size={size} variant="secondary" />}
                    {children}
                </div>
            </div>
        </CSSTransition>
    )
}

Loader.defaultProps = {
    hasSpinner: true,
    position: 'center'
}

export default Loader
