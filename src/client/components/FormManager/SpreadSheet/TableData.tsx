import React, { useState, useEffect, useRef } from 'react'
import { FieldState } from 'formydable'

interface TableDataProps {
    name: string;
    type?: string;
    onChange: (event: any) => void;
    state: FieldState;
}

const TableData: React.FunctionComponent<TableDataProps> = ({name, type, onChange, state, ...props}) => {
    const [showInput, setShowInput] = useState(false)
    const refInput = useRef<HTMLInputElement>(null)
    useEffect(() => {
        if(showInput) {
            refInput.current?.focus()
        }
    }, [showInput])

    const handleDoubleClick = (event: any) => {
        setShowInput(true)
    }

    const handleBlur = () => {
        setShowInput(false)
    }

    return (
        <div data-editable={showInput} onClick={handleDoubleClick}>
            <input
                ref={refInput}
                {...props}
                type={showInput ? type : 'hidden'}
                name={name}
                value={state.value}
                onChange={onChange}
                onBlur={handleBlur}
            />
            {showInput || (
                <span className="muted-data">{state.value}</span>
            )}
        </div>
    )
}

TableData.defaultProps = {
    type: 'text'
}

export default TableData
