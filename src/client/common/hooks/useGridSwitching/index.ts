import { useEffect } from "react"
import Draggerjs from 'draggerjs'
import browserAgent from '../../utils/browserAgent'
// import './index.scss'

export type UseGridSwitchingProps ={
    orderFieldName?: string;
    container?: string;
    droppable?: string;
    draggable?: string;
    autoscroll?: boolean;
    stopPropagation?: boolean;
    dataKey?: string;
    axis?: 'x' | 'y';
    onDragEnded?: (event: { dataIndex: string; listOrder: number }[]) => void;
}

export const useGridSwitching = ({
    container, droppable, 
    draggable, 
    autoscroll = true, 
    stopPropagation = false,
    orderFieldName, 
    dataKey = 'data-index', 
    axis = 'y',
    onDragEnded
}: UseGridSwitchingProps) => {
    
    useEffect(() => {
        if(!(draggable && droppable && container && orderFieldName)) return

        const dragger = new Draggerjs(`#${container}`, {
            draggable,
            droppable,
            autoscroll,
            allowPointerEvent: !browserAgent.mobile
        })
        // fixed the glitch in cursor. in (edge) at the moment there is no solution except this extra call prior to this glitch
        const glitchFixer = browserAgent.edge ? new Draggerjs(`#${container}`) : null

        dragger.on('dragstart', (event, ctx) => {
            if (event.isDraggableElement) {
                let target = event.target
                event.preventDefault()

                if(stopPropagation) {
                    event.stopPropagation()
                }
                // if(target.matches('.ksb-module')) {
                    if(target.nextElementSibling?.classList.contains('collapsible')) {
                        ctx.collapsible = target.nextElementSibling
                    }
                    
                    ctx.draggableContainer = target.closest(droppable)

                    ctx.ember = target.cloneNode(true) as HTMLDivElement
                    ctx.ember.classList.add('is-ember')
                    ctx.draggableContainer?.insertBefore(ctx.ember, target)

                    target.classList.add('is-grabbed')

                    event.container.appendChild(target)
                    setTimeout(() => {
                        target.style.width = `${ctx.ember.clientWidth}px`
                    })
                // }
            }
        })

        let prevY = -1;
        let prevX = -1;

        const switchingAlgorithm = (e: any, elementToInsert: any, switchOnClass: string, axis = 'x') => {
            const droppableTarget = e.droppableTarget && e.droppableTarget.closest(switchOnClass)
            const hasPreventSwith = droppableTarget && (droppableTarget.matches('[data-prevent-switch="true"]') || !!droppableTarget.querySelector('[data-prevent-switch="true"]'));
            const currentDroppable = e.srcDroppable  
            if(!hasPreventSwith && droppableTarget && currentDroppable 
                && droppableTarget !== elementToInsert 
                && droppableTarget !== currentDroppable
                && e.container.contains(currentDroppable)) {
                const droppableRect = droppableTarget.getBoundingClientRect()
                // const siblings = currentDroppable.querySelectorAll(switchOnClass)
                // const isFirstChild = siblings[0] === droppableTarget
                // const isLastChild = siblings[siblings.length - 1] === droppableTarget
                // const divident = isFirstChild ? 0 : isLastChild ? droppableRect[axis === 'y' ? 'height' : 'width'] : 2
                const isGoingLeft = e.clientX < prevX
                const isGoingTop = e.clientY < prevY
                const mappedLocation = e[axis === 'y' ? 'clientY' : 'clientX'] - droppableRect[axis === 'y' ? 'top' : 'left']
                const divident = isGoingLeft || isGoingTop ? 1.2 : 6;
                const locationBasis = droppableRect[axis === 'y' ? 'height' : 'width']/divident
                const isBefore = mappedLocation < locationBasis;
                const next = droppableTarget.nextElementSibling
                if(!next && !isBefore) {
                    currentDroppable.appendChild(elementToInsert)
                }
                currentDroppable.insertBefore(elementToInsert, isBefore ? droppableTarget : next )
            }
            prevY = e.clientY
            prevX = e.clientX
        }

        dragger.on('dragover', (event, ctx) => {
            if(stopPropagation) {
                event.stopPropagation()
            }
            switchingAlgorithm(event, ctx.ember, draggable, axis)
        })

        dragger.on('dragend', (event, ctx) => {
            if(stopPropagation) {
                event.stopPropagation()
            }
            prevY = -1;
            prevX = -1;
            const target = event.target
            if (event.isDraggableElement) {

                target.style.width = null as any
                target.classList.remove('is-grabbed')

                if(ctx.ember.nextElementSibling?.classList.contains('collapsible') && ctx.ember.nextElementSibling !== ctx.collapsible) {
                    const collapsible = ctx.ember.nextElementSibling

                    if(!!collapsible.nextElementSibling) {
                        if(!!ctx.collapsible) {
                            ctx.draggableContainer?.insertBefore(ctx.collapsible, collapsible.nextElementSibling)
                        }

                        ctx.draggableContainer?.insertBefore(target, collapsible.nextElementSibling)

                    } else {
                        ctx.draggableContainer?.appendChild(target)

                        if(!!ctx.collapsible) {
                            ctx.draggableContainer?.appendChild(ctx.collapsible)
                        }
                    }
                    
                } else {
                    
                    ctx.draggableContainer?.insertBefore(target, ctx.ember)

                    if(!!ctx.collapsible) {
                        ctx.draggableContainer?.insertBefore(ctx.collapsible, ctx.ember)
                    }
                }

                ctx.ember.remove()

                event.container.querySelector('.is-droppable')?.classList.remove('is-droppable')

                setTimeout(() => {
                    if(onDragEnded) {
                        onDragEnded(Array.from(ctx.draggableContainer!.children).filter((node: any) => node.getAttribute(dataKey)).map((node: any, index) => {
                            return {
                                dataIndex: node.getAttribute(dataKey),
                                listOrder: index + 1
                            }
                        }))
                    }
                })
            }
        })

        dragger.on('drop', (event, ctx) => {
            if(stopPropagation) {
                event.stopPropagation()
            }
            if (event.isDraggableElement && ctx.isDragOnKSBItem && event?.srcDroppable!.matches(droppable)) {

                event.srcDroppable?.classList.remove('is-droppable')
            }
        })

        dragger.on('dragenter', (event: any, ctx) => {
            if(stopPropagation) {
                event.stopPropagation()
            }
            if (event.isDraggableElement && ctx.isDragOnKSBItem && event?.srcDroppable.matches(droppable) && ctx.ember.closest(droppable) !== event?.srcDroppable) {
                event?.srcDroppable.classList.add('is-droppable')
            }
        })

        dragger.on('dragexit', (event: any) => {
            if(stopPropagation) {
                event.stopPropagation()
            }
            event?.srcDroppable.classList.remove('is-droppable')
        })

        return () => {
            dragger.destroy()
            glitchFixer?.destroy()
        }
        // eslint-disable-next-line
    }, [])
}