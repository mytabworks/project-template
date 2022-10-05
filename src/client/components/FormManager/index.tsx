import React, { memo } from 'react'
import { useForm, Validozer } from 'formydable'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import FormCore, { FormCoreProps } from './FormCore'
import Input from './Input'
import BooleanField from './Boolean'
import Condition from './Condition'
import States from './States'
// import SpreadSheet from './SpreadSheet'
// import Grid from './GridField'
import SingleFieldInObjectArray from './SingleFieldInObjectArray'
import FieldArray from './FieldArray'
import FieldArrayMultiple from './FieldArrayMultiple'
// import InputWithAdd from './InputWithAdd'
import setBackendValidation from './setBackendValidation'
import { MemoFunction } from '../types'
// import './customize-field.scss'

// export * from './SpreadSheet'
// export * from './GridField'
export * from './SingleFieldInObjectArray'
export * from './FieldArray'
export * from './FieldArrayMultiple'
export * from './SingleFieldInObjectArray'
// export * from './InputWithAdd'

export type FormManagerProps = Omit<FormCoreProps, 'value'>
interface FormManagerFunction<P> extends MemoFunction<P> {
    Boolean: typeof BooleanField;
    Input: typeof Input;
    // InputWithAdd: typeof InputWithAdd;
    SingleFieldInObjectArray: typeof SingleFieldInObjectArray;
    Core: typeof FormCore;
    Condition: typeof Condition;
    States: typeof States;
    // SpreadSheet: typeof SpreadSheet;
    // Grid: typeof Grid;
    FieldArray: typeof FieldArray;
    FieldArrayMultiple: typeof FieldArrayMultiple;
    Row: typeof Row;
    Col: typeof Col;
    setBackendValidation: typeof setBackendValidation;
}
//@ts-ignore
const FormManager: FormManagerFunction<FormManagerProps> = memo((props) => {
    const value = useForm()
    
    return (
        <FormCore value={value} {...props}/>
    )
})

FormManager.Boolean = BooleanField
FormManager.Input = Input
// FormManager.InputWithAdd = InputWithAdd
FormManager.SingleFieldInObjectArray = SingleFieldInObjectArray
FormManager.Core = FormCore
FormManager.Condition = Condition
FormManager.States = States
// FormManager.SpreadSheet = SpreadSheet
// FormManager.Grid = Grid
FormManager.FieldArray = FieldArray
FormManager.FieldArrayMultiple = FieldArrayMultiple
FormManager.Row = Row
FormManager.Col = Col
FormManager.setBackendValidation = setBackendValidation

Validozer.rulesExtend({
    required_number: {
        message: "':attribute' is required and missing",
        exe: ({ received }) => typeof received !== 'number'
    },
    required_object: {
        message: "':attribute' is required and missing",
        exe: ({ received }) => !received
    },
    required_file_url: {
        message: "':attribute' is required and missing",
        exe: ({ received }) => !received || (Array.isArray(received) && received.length === 0)
    },
    not_includes_number: {
        message: "':attribute' is not available",
        exe: ({ received, parameter }) => (parameter || '').split(',').map((each) => parseFloat(each)).includes(received)
    },
    not_includes: {
        message: "':attribute' is not available",
        exe: ({ received, parameter }) => (parameter || '').split(',').map((each) => each.trim()).includes(received)
    },
    custom_mimes: {
        message: 'The :attribute only allows :custom_mimes.',
        exe({received, parameter}: any) {
            return !Array.from(received).every((file: any) => {
                const filename = file.split('.');
                return parameter.includes(filename[filename.length - 1].toLowerCase());
            });
        },
    },
    max_size_md: {
        exe({received, parameter}: any) {
            const max_size = parseInt(parameter) * 1000;
            return (
                received.length &&
                Array.from(received).some((value: any) => value.size / 1000 > max_size)
            );
        },
        message: 'The :attribute must not be greater than `:max_size_md MB`'
    },
    min_size_md: {
        exe({received, parameter}: any) {
            const max_size = parseInt(parameter) * 1000;
            return (
                received.length &&
                Array.from(received).some((value: any) => value.size / 1000 < max_size)
            );
        },
        message: 'The :attribute must not be less than `:min_size_md MB`'
    },
})

Validozer.rulesUpdateMessage("required", "':attribute' is required and missing")

FormManager.displayName = 'FormManager'

export default FormManager
