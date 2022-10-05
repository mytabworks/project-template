import classNames from 'classnames'
import React, { memo } from 'react'
// import './index.scss'

const rangeFactory = ([start = 100, end = 100] = []) => {
    const maxStart = Math.max(30, Math.min(start, 100));
    const maxEnd = Math.max(30, Math.min(end, 100));
    const startIsGreater = maxStart > maxEnd;
    const tempRange = Math.abs(maxEnd - maxStart);
    const tempResult = tempRange * Math.random();
    return tempResult + (startIsGreater ? maxEnd : maxStart);
}

interface PlaceholderProps extends React.HTMLProps<HTMLDivElement> {
    loading?: boolean;
    noMargin?: boolean;
    slant?: boolean;
    animated?: boolean;
    range?: [number, number]
}

const Placeholder: React.FunctionComponent<PlaceholderProps> = memo(({
    loading, 
    noMargin, 
    slant, 
    animated, 
    range,
    className, 
    children, 
    ...props
}) => {
    return loading ? (
        <div 
            {...props} 
            className={classNames("skeleton-placeholder", {'no-margin': noMargin, slant, animated}, className)}
            style={{
                width: `${rangeFactory(range)}%`
            }}
            />
    ) : (
        <>
            {children}
        </>
    )
})

Placeholder.defaultProps = {
    loading: true,
    animated: true
}

Placeholder.displayName = 'Placeholder'

export default Placeholder
