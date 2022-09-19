import React from 'react'

interface ToggleProps extends React.HTMLProps<HTMLAnchorElement> {
    children: React.ReactNode;
}

const Toggle = React.forwardRef<any, ToggleProps>(({ children, onClick }, ref) => (
    <a
        href="#"
        ref={ref}
        className="px-3"
        onClick={(e) => {
            
            e.preventDefault()

            if(onClick) {
                onClick(e)
            }
        }}
        >
        {children}
    </a>
))

Toggle.displayName = 'Toggle'

export default Toggle
