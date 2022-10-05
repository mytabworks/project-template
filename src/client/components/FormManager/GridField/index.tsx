// remove isolatedModules error
export type {}
// import React, { forwardRef, useMemo, useEffect, useImperativeHandle, useState, useRef } from 'react'
// import { useFormField, FieldStateNested, transformSchemaToJSON } from 'formydable'
// import NoData from '../../Grid/NoData'
// import Facade from '../../Facade'
// import Loader from '../../Loader'
// import { ForwardRefFunction } from '../../types'
// import { GridContext } from '../../Grid/hook'
// import Grid from '../../Grid'
// import { filterData, FilterDataType, sortData, SortOrder } from '../../../common/utils/data'
// import { useGridSwitching } from '../../../common/hooks/useGridSwitching'
// import Icon from '../../Icon'
// import TRManageDrag from './TRManageDrag'
// import { useTable } from '../../../common/hooks/useTable'
// import './index.scss'
// export interface GridFieldProps {
//     name: string;
//     schema: {
//         [name: string]: {
//             rules?: string;
//             label?: string;
//             value?: any;
//             render?: (cell: any, row: Record<string, any>, index: number) => React.ReactNode;
//             showColumnWhen?: () => boolean;
//         }
//     };
//     value?: Record<string, any>[];
//     actions?: ActionProps[];
//     asynchronous?: boolean;
//     loading?: boolean;
//     children?: React.ReactNode;
//     draggableConfig?: {
//         container: string;
//         orderFieldName: string;
//         autoscroll?: boolean;
//     },
//     appendRow?: (rawStates: FieldStateNested[], columnDisplay: string[]) => React.ReactNode;
// }

// export interface ActionProps {
//     icon: string;
//     title?: string;
//     onClick: (event: any, row: any, index: number) => void;
//     className?: string;
//     children?: React.ReactNode;
//     showWhen?: (row?: any, index?: number) => boolean;
// }

// export type GridFieldReferenceType = {
//     editRow: (item: Record<string, any>, index: number) => void;
//     addRow: (item: Record<string, any>) => void;
//     removeRow: (index: number) => void;
//     reOrderItems: () => void;
//     totalItems: number;
//     getValueData: () => Record<string, any>[];
//     removeAll: () => void;
//     updateAsync: () => void;
// }

// interface GridFieldComponent<T, P> extends ForwardRefFunction<T, P> {
//     Filter: typeof Grid.Filter
// }
// //@ts-ignore
// const GridField: GridFieldComponent<GridFieldReferenceType, GridFieldProps> = forwardRef(({
//     name, 
//     schema, 
//     actions, 
//     value,
//     asynchronous,
//     loading: showFacade,
//     draggableConfig,
//     appendRow,
//     children
// }, ref) => {
//     const tableprops = useTable()
//     const { filters } = tableprops
//     const { getFieldArray, setFieldArray, setFieldArrays, removeFieldArray, setDirty, setFieldValue, setFieldValues } = useFormField()
//     const [loaderActive, setLoaderActive] = useState(false)
//     const mounted = useRef(false)

//     const defaultSchema = useMemo(() => {
//         // removing render prop in schema 
//         return Object.keys(schema).reduce<Record<string, any>>((result, key) => {

//             const { render, ...data } = schema[key]
            
//             result[key] = data

//             return result
//         }, {})
//         // eslint-disable-next-line
//     }, [])

//     const states: Array<FieldStateNested> = getFieldArray(name)

//     const isDraggable = !!(draggableConfig?.container && draggableConfig?.orderFieldName)

//     const columnDisplay = Object.keys(schema).filter((key) => !!schema[key].label && (schema[key].showColumnWhen ? schema[key].showColumnWhen!() : true))

//     const totalColumn = columnDisplay.length + ((actions) ? 1 : 0) + ((isDraggable) ? 1 : 0)

//     const orderByListStates = isDraggable
//         ? sortData({ order: SortOrder.ASC, orderBy: `${draggableConfig?.orderFieldName}.value`}, states) 
//         : states

//     useGridSwitching({
//         ...draggableConfig!,
//         droppable: '.grid-field-container',
//         draggable: '.grid-field-item',
//         onDragEnded: (event) => {
//             setFieldValues(event.reduce<Record<string, any>>((result, each) => {
//                 result[`${name}[${each.dataIndex}].${draggableConfig?.orderFieldName}`] = each.listOrder
//                 return result
//             }, {}))
//         }
//     })

//     useImperativeHandle(ref, () => ({
//         editRow: (item: Record<string, any>, index: number) => {
           
//             setFieldValues(Object.keys(item).reduce<Record<string, any>>((result, key) => {
//                 result[`${name}[${index}].${key}`] = item[key]
//                 // setFieldValue(`${name}[${index}].${key}`, item[key])
//                 return result
//             }, {}))
//             setDirty(true)
//         },
//         addRow: (item: Record<string, any>) => {
            
//             const newRow = Object.keys(defaultSchema).reduce<Record<string, any>>((result, key) => {
//                 result[key] = {
//                     ...defaultSchema[key],
//                     value: item[key] || defaultSchema[key].value
//                 }
//                 return result
//             }, {})

//             setFieldArray(name, newRow, true)
//             setDirty(true)
//         },
//         totalItems: states.length,
//         getValueData: () => {
//             return states.map((state) => {
//                 return transformSchemaToJSON(state)
//             })
//         },
//         reOrderItems: () => {
//             if(isDraggable) {
//                 setFieldValues(orderByListStates.reduce<Record<string, any>>((result, state, index) => {
//                     const dataIndex = states.findIndex(each => each === state)
//                     result[`${name}[${dataIndex}].${draggableConfig?.orderFieldName}`] = index + 1
//                     return result
//                 }, {}))
//             }
//         },
//         removeRow: (index: number) => {
//             removeFieldArray(name, index)
//             setDirty(true)
//         },
//         removeAll: () => {
//             removeFieldArray(name)
//             setDirty(true)
//         },
//         updateAsync: () => {
//             if(asynchronous) {
//                 setLoaderActive(true)
//                 setDirty(true)
//             }
//         }
//         // eslint-disable-next-line
//     }), [isDraggable, states])

//     useEffect(() => {
//         if(value && value.length > 0) {
//             const defaultArrayValues = value.map((item) => {
//                 return Object.keys(defaultSchema).reduce<Record<string, any>>((result, key) => {
//                     result[key] = {
//                         ...defaultSchema[key],
//                         value: item[key]
//                     }
//                     return result
//                 }, {})
//             })

//             setFieldArrays(name, defaultArrayValues, true)
//         }

//         return () => removeFieldArray(name)
//         // eslint-disable-next-line
//     }, [value])

//     useEffect(() => {
//         if(mounted.current) {
//             setLoaderActive(false)
//         }
//         // eslint-disable-next-line
//     }, [value])

//     useEffect(() => {
//         mounted.current = true
//         // eslint-disable-next-line
//     }, [])
    
//     return (
//         <div id={draggableConfig?.container} className="grid-field grid-switching">
//             <GridContext.Provider value={tableprops as any}>
//                 {children}
//             </GridContext.Provider>
//             <table className="table">
//                 <thead>
//                     <tr>
//                         {isDraggable && <th style={{width: 20}}></th>}
//                         {columnDisplay.map((key) => (
//                             <th key={key} data-column={key}>{schema[key].label}</th>
//                         ))}
//                         {actions && (
//                             <th className="action-column">Actions</th>
//                         )}
//                     </tr>
//                 </thead>
//                 <tbody className="grid-field-container">
//                     {states.length > 0 ? filterData(filters as FilterDataType[], orderByListStates, '.value').map((state) => {
//                         const index = states.findIndex(each => each === state)
//                         const transformedState = transformSchemaToJSON(state)
//                         return (
//                             <TRManageDrag 
//                                 key={index}
//                                 data-index={index}
//                                 className="grid-field-item"
//                                 onPointerDown={(event: any) => {
//                                     if(!(event.target.matches('.grid-field-item-grab') || event.target.closest('.grid-field-item-grab'))) {
//                                         event.stopPropagation()
//                                     }
//                                 }} >
//                                 {isDraggable && (
//                                     <td className='grid-field-item-grab'><Icon name="grip-vertical"/></td>
//                                 )}
//                                 {columnDisplay.map((key, keyIndex) => {
//                                     return (
//                                         <td key={keyIndex} data-column={key}>
//                                             {'render' in schema[key] ? (
//                                                 schema[key].render!(transformedState[key], transformedState, index)
//                                             ) : (
//                                                 transformedState[key]
//                                             )}
//                                         </td>
//                                     )
//                                 })}
//                                 {(actions || isDraggable) && (
//                                     <td>
//                                         <div className="action-cell">
//                                             {actions?.filter(({ showWhen }) => showWhen ? showWhen(transformedState) : true).map(({ icon, title, className, onClick, children }, key) => (
//                                                 <button key={key} type="button" title={title} className={`btn btn-sm${className ? ` ${className}` : ''}`} onClick={(event: any) => {
                                                    
//                                                     onClick(event, transformedState, index)
//                                                 }}>
//                                                     {children || <i className={icon} aria-hidden="true" />}
//                                                 </button>
//                                             ))}
//                                         </div>
//                                     </td>
//                                 )}
//                             </TRManageDrag>
//                         )
//                     }) : asynchronous && showFacade && (!value || value.length === 0)? (
//                         new Array(5).fill(0).map((_, index) => (
//                             <tr key={index} data-facade>
//                                 {isDraggable && (
//                                     <td className='grid-item-grab'><Icon name="grip-vertical"/></td>
//                                 )}
//                                 {[
//                                     ...Object.values(schema).filter((each) => !!each.label), 
//                                     ...((actions) ? [{ label: 'Actions' }] : [])
//                                 ].map((column, index) => {
//                                     return (
//                                         <td key={index}>
//                                             <Facade loading rows={1} padding={false} range={column.label === "Actions" ? [100, 100] : [Math.min(totalColumn * 15, 100), Math.min(totalColumn * 20, 100)]}/>
//                                         </td>
//                                     )
//                                 })}
//                             </tr>
//                         ))
//                     ) : (
//                         <NoData totalColumn={totalColumn}/>
//                     )}
//                     {appendRow && appendRow(states, columnDisplay)}
//                 </tbody>
//             </table>
//             <Loader active={loaderActive} />
//         </div>
//     )
// })

// GridField.Filter = Grid.Filter

// export default GridField;