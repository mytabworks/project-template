import React, { memo } from 'react'
import classNames from 'classnames'
interface IconProps extends React.HTMLProps<HTMLElement> {
    name: string;
    type?: 'fa' | 'fas' | 'fab' | 'far';
    size?: number;
    color?: string;
    spin?: boolean;
}

const Icon: React.FunctionComponent<IconProps> = memo(({ type, name, size, style, color, className, spin, ...props}) => {
    return (
        <i className={classNames(`${type} fa-${name}`, { 'fa-spin': spin }, className)} style={{...style, fontSize: size && `${size}px`, color}} {...props}/>
    )
})

Icon.defaultProps = {
    type: 'fa'
}

Icon.displayName = 'Icon'

export default Icon
