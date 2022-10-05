// remove isolatedModules error
export type {}
// import SelectDropdown from '../../Fields/SelectDropdown'
// import FormManager from '../../FormManager'
// import Input, { InputProps } from '../../FormManager/Input'
// import ModalForm, { ModalFormProps } from '../../Modal/Form'
// import Toaster from '../../Toaster'
// import React, { forwardRef, useRef } from 'react'
// import { useAuthAPI } from '../../../common/hooks/useAuthAPI'
// import { AliasFunction } from '../../types'
// import Button, { ButtonProps } from '../../Button'
// import Icon from '../../Icon'
// import classNames from 'classnames'
// import { useFormField } from 'formydable'
// import { AxiosResponse } from 'axios'
// import './index.scss'
// import branding from '@client/config/branding'

// export interface InputWithAddProps extends InputProps {
//     responsePKKey?: string;
//     buttonInputGroup?: boolean;
//     buttonProps?: ButtonProps;
//     modalFormProps: ModalFormProps & {
//         endpoint: string;
//         managePayload: (FORM_DATA: Record<string, any>) => any;
//         getToasterName: (FORM_DATA: Record<string, any>) => string;
//         onResponse?: (response: AxiosResponse<any>) => void;
//         onError?: (error: any) => void;
//         // onRefetchGraph?: (data: ApolloQueryResult<any>) => void;
//     };
// }
// const InputWithAdd: AliasFunction<typeof SelectDropdown.Graph, InputWithAddProps> = forwardRef(({
//     as: Component = SelectDropdown.Graph, 
//     responsePKKey,
//     buttonInputGroup,
//     buttonProps,
//     modalFormProps: { endpoint, managePayload, getToasterName, onResponse, onError, ...modalFormProps}, 
//     ...props
// }, ref) => {
//     const { setFieldValue } = useFormField()
//     const dropdownGraphRef = useRef<any>(null)
//     const requestAdd = useAuthAPI(endpoint)
//     const handleAdd = (_: any) => {
//         const recursivePromptForm = () => {
//             ModalForm({
//                 ...modalFormProps
//             }).then((event) => {
//                 if (event.isSubmit) {
//                     const FORM_DATA = event.json();
//                     const payload = managePayload(FORM_DATA)
//                     const name = getToasterName(FORM_DATA)
//                     const toast = Toaster(`Saving ${name}`);

//                     requestAdd
//                         .call({ data: payload })
//                         .then((response) => {
//                             if (response.data.success) {
//                                 event.closeModal();

//                                 toast.success(`Successfully saved ${name}`);
//                                 dropdownGraphRef.current?.refetch().then((data: any) => {
//                                     setFieldValue(props.name, response.data[responsePKKey!] || '')
//                                     // if(onRefetchGraph) {
//                                     //     onRefetchGraph(data)
//                                     // }
//                                 })
//                             } else {
//                                 toast.fail(response.data.message || branding.messages.fail);
//                                 FormManager.setBackendValidation(event, response.data.errors);
//                                 event.setValidationMessages(response.data.errors?.map((error: any) => error.errorMessage))
//                                 recursivePromptForm();
//                             }

//                             if(onResponse) {
//                                 onResponse(response)
//                             }
//                         })
//                         .catch((error) => {
//                             recursivePromptForm();
//                             event.setError(error?.response.data.message || branding.messages.error);
//                             toast.error();
//                             if(onError) {
//                                 onError(error)
//                             }
//                         })
//                         .finally(() => {
//                             event.removeLoading();
//                         });
//                     }
//                 });
//         };
    
//         recursivePromptForm();
//     };
    
//     return (
//         //@ts-ignore
//         <Input
//             ref={(target: any) => {
//                 dropdownGraphRef.current = target
//                 if(ref) {
//                     (ref as any).current = target
//                 }
//             }} 
//             as={Component}
//             {...props}
//             {...({
//                 [buttonInputGroup ? 'append' : 'formGroupAppend']: (
//                     <Button type="button" {...buttonProps} className={classNames(buttonInputGroup ? '' : 'btn-input-add', null, buttonProps?.className)} onClick={handleAdd}/>
//                 )
//             })}
//         />
//     )
// })

// InputWithAdd.defaultProps = {
//     buttonInputGroup: false,
//     responsePKKey: 'primaryKey',
//     buttonProps: {
//         children: <><Icon name="plus"/> Add</>
//     }
// }

// InputWithAdd.displayName = 'InputWithAdd'

// export default InputWithAdd
