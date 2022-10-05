import React, { useLayoutEffect, useRef } from 'react'
import browserAgent from '../../../../common/utils/browserAgent'
interface TRManageDragProps extends React.HTMLProps<HTMLTableRowElement> {
    onPointerDown?: (event: any) => void;
}

const TRManageDrag: React.FunctionComponent<TRManageDragProps> = ({onPointerDown, ...props}) => {
    const ref = useRef<HTMLTableRowElement>(null)

    useLayoutEffect(() => {
        if(!onPointerDown) return;
        const eventListener = browserAgent.mobile ? 'touchstart' : 'pointerdown'
        ref.current?.addEventListener(eventListener, onPointerDown)

        return () => ref.current?.removeEventListener(eventListener, onPointerDown)
    }, [onPointerDown])

    return (
        <tr ref={ref} {...props}/>
    )
}

export default TRManageDrag
