import { chainedDataIndexExtractor } from "./chainedDataIndex";

export enum SortOrder {
	ASC = 'asc',
	DESC = 'desc',
}

export const sortData = <R = any>(sort: { order: SortOrder, orderBy: string }, data: R[]): R[] => {
	return sort.order && sort.orderBy
	  ? [...data].sort((a: any, b: any) => {
		  const orderBy = sort.orderBy || "";
		  const r =
		  chainedDataIndexExtractor(orderBy, a) < chainedDataIndexExtractor(orderBy, b) ? -1 : chainedDataIndexExtractor(orderBy, a) > chainedDataIndexExtractor(orderBy, b) ? 1 : 0;
		  return sort.order === SortOrder.ASC ? r : r * -1;
		})
	  : [...data];
};

export enum FilterType {
    LIKE = "like",
    GREATER_THAN = "gt",
    GREATER_THAN_EQUAL = "gte",
    LESS_THAN = "lt",
    LESS_THAN_EQUAL = "lte",
    MULTIPLE = "multiple",
    MULTIPLE_EXCLUSION = "multiple_exclusion",
    DROPDOWN = "dropdown",
    BOOLEAN = "bool",
    INTEGER = "integer",
    DECIMAL = "decimal",
    DATE = "date",
    MANUAL = "manual",
    PARAMETER = "parameter"
}
  
export type FilterDataType = { 
	dataIndex: string | string[]; 
	value: any, 
	type: FilterType 
}

const filterCondition = (type: FilterType, filterValue: any, value: any) => {
	let status = false
	
	switch (type) {
		case FilterType.MULTIPLE:
			status = filterValue.includes(value)
			break;
		case FilterType.LESS_THAN:
			status = value < filterValue
			break;
		case FilterType.LESS_THAN_EQUAL:
			status = value <= filterValue
			break;
		case FilterType.GREATER_THAN:
			status = value > filterValue
			break;
		case FilterType.GREATER_THAN_EQUAL:
			status = value >= filterValue
			break;
		default:
			status = new RegExp(
				`${filterValue}`.replace(
					// eslint-disable-next-line no-useless-escape
					/[\^\$\.\+\*\(\)\?\!\[\]]/g,
					(a: string) => `\\${a}`),
				"i"
			).test(`${value}`);
			break;
	}

	return status
}

export const filterData = <R = any>(filters: FilterDataType[], data: R[], dataIndexExtension: string = ''): R[] => {
	
	return filters.length
        ? [...data].filter((row: any) => {
            return filters.every((filter) => {
				if(Array.isArray(filter.dataIndex) ) {
					return filter.dataIndex.some((dataIndex) => {
						return filterCondition(filter.type, filter.value, chainedDataIndexExtractor(`${dataIndex}${dataIndexExtension}`, row))
					})
				} else {
					return filterCondition(filter.type, filter.value, chainedDataIndexExtractor(`${filter.dataIndex}${dataIndexExtension}`, row))
				}
            });
        })
        : [...data];
};

export const groupData = <R = any>(dataIndex: string, data: R[]): Record<any, R[]> => {
	return data.reduce<Record<any, R[]>>((result, item: any) => {
		const value = chainedDataIndexExtractor(dataIndex, item)
		if (value in result) {
		  	result[value].push(item);
		} else {
		  	result[value] = [item];
		}
		return result;
	}, {})
}

export const shuffleData = <R = any>(data: R[]): R[] => {
	return data.sort(() => Math.random() - 0.5)
}

export const uniqueData = <R = any>(dataIndex: string, data: R[]): R[] => {
	return data.reduce<R[]>((result, item) => {
		const value = chainedDataIndexExtractor(dataIndex, item)
		if(!result.some((each) => chainedDataIndexExtractor(dataIndex, each) === value)) {
			result.push(item)
		}
		return result
	}, [])
}

export const excludeDuplicate = <P = any>(data: P[]): P[] => {
	return data.reduce<P[]>((result, item) => {
		if(!result.includes(item)) {
			result.push(item)
		}
		return result
	}, [])
}

export const uniqueDataString = (data: string[]): string[] => {
	return excludeDuplicate(data)
}

export const objectByIndex = <P = any>(field: string, data: P[]): Record<any, P> => {
    return data.reduce<Record<any, P>>((result, item) => {
        result[chainedDataIndexExtractor(field, item) as keyof typeof result] = item
        return result
    }, {})
}

export const pickRecord = (record: Record<string, any>, picks: string[]): Record<string, any> => {
    return Object.keys(record).filter(key => picks.includes(key)).reduce<Record<string, any>>((result, key) => {
        result[key] = record[key]
        return result
    }, {})
}

export const omitRecord = (record: Record<string, any>, picks: string[]): Record<string, any> => {
    return Object.keys(record).filter(key => !picks.includes(key)).reduce<Record<string, any>>((result, key) => {
        result[key] = record[key]
        return result
    }, {})
}