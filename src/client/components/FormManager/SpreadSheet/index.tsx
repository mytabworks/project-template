// remove isolatedModules error
export type {}
// import React, { useMemo, useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
// import { useFormField, FieldStateNested, transformSchemaToJSON } from 'formydable'
// import Button from 'react-bootstrap/Button'
// import Icon from '../../Icon'
// import TableData from './TableData'
// import Placeholder from '../../Placeholder'
// import { ActionProps } from '../GridField'
// // import './index.scss'
// import classNames from 'classnames'
// import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
// import Popover from 'react-bootstrap/Popover'

// export interface SpreadSheetProps {
//     name: string;
//     schema: {
//         [name: string]: {
//             rules?: string;
//             label?: string;
//             labelNode?: React.ReactNode;
//             value?: any;
//             type?: string;
//             placement?: "auto" | "auto-start" | "auto-end" | "top" | "bottom" | "right" | "left" | "top-start" | "top-end" | "bottom-start" | "bottom-end" | "right-start" | "right-end" | "left-start" | "left-end",
//             as?: React.ElementType;
//             render?: (state: Record<string, any>, context: Record<string, any>) => any;
//             allowPassStateProp?: boolean;
//             dynamicProps?: (state: Record<string, any>, index: number, context: Record<string, any>) => Record<string, any>;
//             onCellChange?: (event: any, state: Record<string, any>, index: number, context: Record<string, any>) => void;
//             mutateOnChange?: (event: any, state: Record<string, any>, index: number) => ({ name: string, value: any });
//             mutateOnRowChange?: (event: any, state: Record<string, any>, index: number) => Record<string, any>;
//             [name: string]: any;
//         }
//     };
//     type?: string;
//     value?: Record<string, any>[];
//     addLabel?: React.ReactNode;
//     noDataChildren?: React.ReactNode;
//     noRecordDisplayText?: string;
//     staticMode?: boolean;
//     loading?: boolean;
//     allowRowContext?: boolean;
//     actions?: ActionProps[];
//     showDefaultRemoveAction?: boolean;
//     transformedRawStates?: boolean;
//     dynamicPropsRawStateArgument?: boolean;
//     showAddRow?: boolean;
//     onRemove?: (event: {remove: (() => void), state: FieldStateNested, context: Record<string, any>}) => void;
//     appendRow?: (rawStates: FieldStateNested[], columnDisplay: string[]) => React.ReactNode;
//     prependFooter?: (rawStates: FieldStateNested[]) => React.ReactNode;
//     appendFooter?: (rawStates: FieldStateNested[]) => React.ReactNode;
//     filterData?: (rawStates: FieldStateNested, index: number) => boolean;
// }

// export type SpreadSheetReferenceType = {
//     editRow: (item: Record<string, any>, index: number) => void;
//     addRow: (item: Record<string, any>) => void;
//     removeRow: (index: number) => void;
//     totalItems: number;
//     getValueData: () => Record<string, any>[];
//     removeAll: () => void;
// }

// const SpreadSheet = forwardRef<SpreadSheetReferenceType, SpreadSheetProps>(({
//     name, 
//     schema, 
//     type, 
//     value, 
//     addLabel, 
//     noDataChildren,
//     noRecordDisplayText, 
//     staticMode, 
//     loading, 
//     allowRowContext, 
//     actions,
//     showDefaultRemoveAction,
//     transformedRawStates,
//     dynamicPropsRawStateArgument,
//     showAddRow,
//     onRemove, 
//     appendRow, 
//     prependFooter, 
//     appendFooter, 
//     filterData
// }, ref) => {
//     const context = useRef<Record<any, Record<string, any>>>({})
//     const { formUpdate, getFieldArray, setFieldArray, setFieldArrays, removeFieldArray, setDirty, setFieldValue, setFieldValues, clearFieldError } = useFormField()

//     const defaultSchema = useMemo(() => {
//         return Object.keys(schema).reduce<Record<string, {rules?: string;label?: string;value?: any;}>>((result, key) => {
//             const {rules, label, value = "", type: pType} = schema[key as keyof typeof schema]
//             const isCheckbox = (type === 'checkbox' || pType === 'checkbox')

//             result[key] = {
//                 rules, label, value: isCheckbox ? false : value
//             }
//             return result
//         }, {})
        
//     }, [schema])

//     const states: FieldStateNested[] = getFieldArray(name)

//     useEffect(() => {
//         if(value && value.length > 0) {
//             const defaultArrayValues = value.map((item) => {
//                 const defaultValue = Object.keys(defaultSchema).reduce<Record<string, any>>((result, key) => {
//                     result[key] = {
//                         ...defaultSchema[key],
//                         value: item[key]
//                     }
//                     return result
//                 }, {})
                
//                 if(allowRowContext) {
//                     defaultValue.contextKey = {
//                         value: Math.random()
//                     }

//                     context.current[defaultValue.contextKey.value] = {}
//                 }

//                 return defaultValue
//             })
            
//             setFieldArrays(name, defaultArrayValues, true)
//         }

//         return () => removeFieldArray(name)
//     }, [value])

//     useImperativeHandle(ref, () => ({
//         editRow: (item: Record<string, any>, index: number) => {
           
//             setFieldValues(Object.keys(item).reduce<Record<string, any>>((result, key) => {
//                 result[`${name}[${index}].${key}`] = item[key]
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

//             if(allowRowContext) {
//                 newRow.contextKey = {
//                     value: Math.random()
//                 }
    
//                 context.current[newRow.contextKey.value] = {}
//             }

//             setFieldArray(name, newRow, true)
//             setDirty(true)
//         },
//         totalItems: states.length,
//         getValueData: () => {
//             return states.map((state) => {
//                 return transformSchemaToJSON(state)
//             })
//         },
//         removeRow: (index: number) => {
//             removeFieldArray(name, index)
//             setDirty(true)
//         },
//         removeAll: () => {
//             removeFieldArray(name)
//             setDirty(true)
//         },
//         // eslint-disable-next-line
//     }), [states])

//     const handleAddRow = () => {
//         const appendValue = {...defaultSchema}

//         if(allowRowContext) {
//             appendValue.contextKey = {
//                 value: Math.random()
//             }

//             context.current[appendValue.contextKey.value] = {}
//         }

//         setFieldArray(name, appendValue as any, true)
//         setDirty(true)
//     }

//     const handleNavigation = (event: any) => {
//         if(event.charCode === 13 || event.which === 13) {
//             event.preventDefault();
//             event.stopPropagation();
//             const parentTarget = (event as any).target.closest('td')
//             const recursive = (target: HTMLTableCellElement) => {
//                 // go to next cell 
//                 if(target.matches('td') && target?.nextElementSibling && target?.nextElementSibling?.querySelector('input, select')) {
//                     const toFocus = target?.nextElementSibling?.querySelector<HTMLInputElement>('input, select')
//                     if(toFocus) {
//                         if(!toFocus?.disabled) {
//                             toFocus.focus()
//                         } else {
//                             recursive(target?.nextElementSibling as HTMLTableCellElement)
//                         }
//                     }
//                 } else {
//                     // go to next row
//                     const tr = target.closest('tr')
//                     if(tr?.nextElementSibling && tr?.nextElementSibling?.matches('tr')) {
//                         const toFocus = tr.nextElementSibling?.firstElementChild?.querySelector<HTMLInputElement>('input, select')
//                         if(toFocus) {
//                             if(!toFocus?.disabled) {
//                                 toFocus.focus()
//                             } else {
//                                 recursive(tr.nextElementSibling?.firstElementChild as HTMLTableCellElement)
//                             }
//                         }
//                     }
//                 }
//             }

//             recursive(parentTarget)
//         }
//     }

//     const columnDisplay = Object.keys(schema).filter((key) => typeof schema[key].label === 'string')
//     const totalColumn = columnDisplay.length + (staticMode ? 0 : 1)
//     const filteredStates = (filterData ? states.filter(filterData as any) : states)

//     let rawStates = filteredStates
    
//     if(transformedRawStates) {
//         rawStates = filteredStates.map((state) => transformSchemaToJSON(state))
//     }

//     return (
//         <div className="spread-sheet">
//             <table className="table table-bordered">
//                 <thead>
//                     <tr>
//                         {columnDisplay.map((key) => (
//                             <th key={key} data-checkbox={(type === 'checkbox' || schema[key]?.type === 'checkbox') || undefined}>
//                                 {schema[key].labelNode || schema[key].label}
//                             </th>
//                         ))}
//                         {!staticMode && <th className="action-column">Action</th>}
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {loading ? (
//                         new Array(5).fill(0).map((_, index) => (
//                             <tr key={index}>
//                                 {(staticMode ? columnDisplay : [...columnDisplay, "Actions"]).map((column, index) => {
//                                     return (
//                                         <td key={index} data-facade="true">
//                                             <Placeholder loading />
//                                         </td>
//                                     ) 
//                                 })}
//                             </tr>
//                         ))
//                     ) : filteredStates.length > 0 ? filteredStates.map((state) => {
//                         const index = states.findIndex(each => each === state)
//                         const transformedState = transformSchemaToJSON(state)
//                         const ctx = allowRowContext ? context.current[state.contextKey.value] : context.current
//                         return (
//                             <tr key={index} data-purpose="spreedsheet">
//                                 {columnDisplay.map((key, keyIndex) => {
//                                     const {
//                                         rules, 
//                                         label, 
//                                         value, 
//                                         as: Component = TableData, 
//                                         render, 
//                                         dynamicProps, 
//                                         onCellChange, 
//                                         mutateOnChange,
//                                         mutateOnRowChange,
//                                         allowPassStateProp,
//                                         placement = "bottom",
//                                         ...props
//                                     } = schema[key as keyof typeof schema]
//                                     const isCheckbox = type === 'checkbox' || props.type === 'checkbox'

//                                     const handleChange = (e: any) => {
//                                         if(onCellChange) {
//                                             onCellChange(e, transformedState, index, ctx)
//                                         }

//                                         if(mutateOnRowChange) {
//                                             const changeSchema = mutateOnRowChange(e, transformedState, index)

//                                             setFieldValues(changeSchema)
//                                         } else {
                                            
//                                             if(isCheckbox) {
//                                                 setFieldValue(`${name}[${index}].${key}`, e.target.checked)

//                                             } else {
                                                
//                                                 if(mutateOnChange) {
//                                                     const mutate = mutateOnChange(e, transformedState, index)
//                                                     setFieldValue(mutate.name, mutate.value)
//                                                 } else {
                                                    
//                                                     formUpdate(e)
//                                                 }

//                                             }
//                                         }

//                                     }

//                                     return (
//                                         <td 
//                                             key={keyIndex} 
//                                             data-checkbox={isCheckbox || undefined} 
//                                             onKeyDown={handleNavigation}>
//                                             {rules ? (
//                                                 <OverlayTrigger
//                                                     show={state[key]?.isInvalid}
//                                                     placement={placement}
//                                                     flip
//                                                     overlay={
//                                                         <Popover className="pop-validation-container" id={`${name}[${index}].${key}`}>
//                                                             <Popover.Body>
//                                                                 <div className="pop-validation"> 
//                                                                     <span className="pop-validation-message">{state[key]?.message}</span> 
//                                                                     <Icon name="times" className="pop-validation-close" onClick={() => clearFieldError(`${name}[${index}].${key}`)}/>
//                                                                 </div>
//                                                             </Popover.Body>
//                                                         </Popover>
//                                                     }>
//                                                     <Component
//                                                         type={type}
//                                                         {...props}
//                                                         className={classNames(props.className , { 'form-control': Component === 'input', 'is-invalid': state[key]?.isInvalid })}
//                                                         {...(dynamicProps && dynamicProps(dynamicPropsRawStateArgument ? state : transformedState, index, ctx))}
//                                                         name={`${name}[${index}].${key}`}
//                                                         onChange={handleChange} 
//                                                         isInvalid={state[key]?.isInvalid}
//                                                         value={render ? render(transformedState, ctx) : state[key]?.value}
//                                                         state={Component === TableData || allowPassStateProp ? state[key] : undefined}/>
//                                                 </OverlayTrigger>    
//                                             ) : (
//                                                 <Component
//                                                     type={type}
//                                                     {...props}
//                                                     className={classNames(props.className , { 'form-control': Component === 'input', 'is-invalid': state[key]?.isInvalid  })}
//                                                     {...(dynamicProps && dynamicProps(dynamicPropsRawStateArgument ? state : transformedState, index, ctx))}
//                                                     name={`${name}[${index}].${key}`}
//                                                     onChange={handleChange} 
//                                                     value={render ? render(transformedState, ctx) : state[key]?.value}
//                                                     state={Component === TableData || allowPassStateProp ? state[key] : undefined}/>
//                                             )}
//                                         </td>
//                                     )
//                                 })}
//                                 {!staticMode && (
//                                     <td className="action-cell">
//                                         <div className="action">
//                                             {actions?.filter(({ showWhen }) => showWhen ? showWhen(transformedState) : true).map(({ icon, title, className, onClick, children }, key) => (
//                                                 <button key={key} tabIndex={-1} type="button" title={title} className={`btn btn-sm${className ? ` ${className}` : ''}`} onClick={(event: any) => {
                                                    
//                                                     onClick(event, transformedState, index)
//                                                 }}>
//                                                     {children || <i className={icon} aria-hidden="true" />}
//                                                 </button>
//                                             ))}
//                                             {showDefaultRemoveAction && (
//                                                 <button tabIndex={-1} type="button" className="btn btn-sm" title="delete row" onClick={() => {
//                                                     if(allowRowContext) {
//                                                         delete context.current[state.contextKey.value]
//                                                     }
                                                    
//                                                     if(onRemove) {
//                                                         onRemove({
//                                                             state: transformedState,
//                                                             remove: () => {
//                                                                 removeFieldArray(name, index)
//                                                             },
//                                                             context: ctx
//                                                         })
//                                                     } else {
//                                                         removeFieldArray(name, index)
//                                                     }
//                                                 }}>
//                                                     <Icon name="trash" />
//                                                 </button>
//                                             )}
//                                         </div>
//                                     </td>
//                                 )}
//                             </tr>
//                         )
//                     }) : (
//                         <div
//                             // text={noRecordDisplayText}
//                             // totalColumn={totalColumn}
//                             >
//                             {!staticMode && showAddRow && (
//                                 <Button tabIndex={-1} type="button" className="mt-3" onClick={handleAddRow}>
//                                     {addLabel || <><Icon name="plus"/> Add Row</>}
//                                 </Button>
//                             )}
//                             {noDataChildren}
//                         </div>
//                     )}
//                     {appendRow && appendRow(rawStates, columnDisplay)}
//                 </tbody>
//             </table>
//             {!staticMode && (
//                 <div className="spread-sheet-footer">
//                     {prependFooter && prependFooter(rawStates)}
//                     {showAddRow && (
//                         <Button tabIndex={-1} type="button" disabled={loading} onClick={handleAddRow}>
//                             {addLabel || <><Icon name="plus"/> Add Row</>}
//                         </Button>
//                     )}
//                     {appendFooter && appendFooter(rawStates)}
//                 </div>
//             )}
//         </div>
//     )
// })

// SpreadSheet.defaultProps = {
//     showAddRow: true,
//     showDefaultRemoveAction: true
// }

// SpreadSheet.displayName = 'SpreadSheet'

// export default SpreadSheet;