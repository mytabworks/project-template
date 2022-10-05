import { FormEvent } from "formydable"

export type ErrorType = {
    field: string;
    errorMessage: string;
}

const setBackendValidation = (event: FormEvent, errors: ErrorType[] = [], aliases: Record<string, string> = {}) => {
    const errorRecord = errors.reduce<Record<string, string>>((result, error) => {

        const field = aliases[error.field] 
            // if no alias is found aliases we will lowercase the first capitals to match the field name
            || (error.field.split('.').length > 1 ? error.field.split('.').pop() || "" : error.field).replace(/^[A-Z]+/, (firstCapitals) => {
                const length = firstCapitals.length
                return length > 1 
                    ? firstCapitals.substr(0, length - 1).toLocaleLowerCase() + firstCapitals.substr(length - 1) 
                    : firstCapitals.toLocaleLowerCase()
            })

        if(field) {
            result[field] = error.errorMessage
        }

        return result
    }, {})

    event.setFieldErrors(errorRecord)
}

export default setBackendValidation