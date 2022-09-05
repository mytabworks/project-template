import { FilterDataType, FilterType, SortOrder } from '../utils/data';
import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';

type ChangeEvent = React.ChangeEvent<
	HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
>;

export type SortState = {
	order: null | SortOrder;
	orderBy: null | string;
};

interface FilterProps {
	dataIndex: string | string[];
	type: FilterType;
	value?: string;
	multiple?: boolean;
	autoSubmit?: boolean;
}

interface SortProps {
	dataIndex: string;
	sortOrder?: SortOrder[];
	render: (sort: SortOrder | null) => React.ReactNode;
}

type HookFunction<P = any, R = any> = (props: P) => R

export interface TableStates {
    page: number;
    perPage: number;
	filters: FilterDataType[];
	sort: SortState;
}

const defaultTableStates = {
    page: 1,
    perPage: 10,
	filters: [],
	sort: { 
		order: null, 
		orderBy: null
	}
}

export const useTable = ({
        page = 1,
        perPage = 10,
		filters = [],
		sort: { 
			order = null, 
			orderBy = null 
		} = defaultTableStates.sort
	}: Partial<TableStates> = defaultTableStates) => {

	const [states, setStates] = useState<TableStates>({
		page,
        perPage,
		filters,
        sort: { order, orderBy },
	})

	const observableFilters = useRef<FilterDataType[]>(filters)

	useEffect(() => {
		observableFilters.current = [...states.filters]
	}, [states.filters])

	const filterProps: HookFunction<FilterProps> = useCallback(({
		dataIndex,
		value,
		type,
		multiple = false,
		autoSubmit = false
	}) => {
		return {
			onChange: (event: ChangeEvent) => {
				const obfilters = observableFilters.current
				const target = event.target
				const targetType = target.type
				const targetValue = target.value

				let filters = obfilters.filter((filter) => !(`${filter.dataIndex}` === `${dataIndex}` && filter.type === type));
				let updateOrNewFilter: FilterDataType | undefined
				if(["checkbox", "radio"].includes(targetType)) {
					const isChecked = (target as any).checked
					const current = obfilters.find((filter) => `${filter.dataIndex}` === `${dataIndex}`)
					
					if(targetType === "radio") {
						updateOrNewFilter = { dataIndex, type, value: multiple ? [value] : value }
					} else {
						if (multiple) {
							let values = (current?.value as string[]).filter((v: string) => v !== value)
	
							if(isChecked) {
								updateOrNewFilter = { dataIndex, type, value: [...values, value] }
								
							} else if(values.length) {
	
								updateOrNewFilter = { dataIndex, type, value: values }
							}
						} else if(isChecked) {
							updateOrNewFilter = { dataIndex, type, value: value }
						}
					}
					
				} else if (targetValue && value?.includes("{search}")) {
					updateOrNewFilter = { 
						dataIndex,
						type,
						value: value.replace("{search}", targetValue) 
					}
				} else if((multiple ? (Array.isArray(targetValue) && targetValue.length > 0) : targetValue)) {
					updateOrNewFilter = { 
						dataIndex,
						type,
						value: targetValue
					}
				}

				if(updateOrNewFilter) {
					filters = [...filters, updateOrNewFilter];
				}

				observableFilters.current = filters

				if(autoSubmit) {
					filterSubmit()
				}
			}
		}
		// eslint-disable-next-line
	}, [states.filters]);

	const filterSubmit = useCallback(() => {
		setStates((prev) => ({
			...prev,
			filters: [...observableFilters.current],
			page: 1,
		}))
	}, [])

	const filterReset = useCallback((dataIndex?: FilterDataType["dataIndex"]) => {

		let obfilters = dataIndex ? observableFilters.current : []

		if(dataIndex) {

			obfilters = observableFilters.current = obfilters.filter(filter => `${filter.dataIndex}` !== `${dataIndex}`)
		} else {
			observableFilters.current = obfilters
		}
		
		setStates((prev) => ({
			...prev,
			filters: [...obfilters],
			page: 1,
		}))
	}, [])

	const sortProps: HookFunction<SortProps> = useCallback(({
			dataIndex,
			sortOrder = [SortOrder.ASC, SortOrder.DESC],
			render
		}) => {
			let sort: SortState
			const prevSort = states.sort
			if (prevSort.orderBy !== dataIndex) {
				sort = {
					order: sortOrder[0],
					orderBy: dataIndex,
				};
			} else if (
				prevSort.orderBy === dataIndex &&
				sortOrder.length >= 2 &&
				prevSort.order === sortOrder[0]
			) {
				sort = {
					order: sortOrder[1],
					orderBy: dataIndex,
				};
			} else {
				sort = {
					order: null,
					orderBy: null,
				};
			}
		return {
			"data-index": dataIndex,
			"data-order": states.sort.orderBy === dataIndex ? states.sort.order : undefined,
			"data-next-order": sort.order || undefined,
			children: render(states.sort.orderBy === dataIndex ? states.sort.order : null),
			onClick: () => {
				setStates((prev) => {
					return {
						...prev,
						sort
					}
				});
			}
		}
	}, [states.sort])

	const paginateProps: HookFunction<number> = useCallback((page: number, activable: boolean = false) => {
		return {
			"data-page": page,
			"data-active": activable ? page === states.page : undefined,
			onClick: (event: React.MouseEvent<any>) => {
				event.preventDefault()
				setStates((prev) => ({
					...prev,
					page
				}))
			}
		}
    }, [states.page])
    
    const setPerPage = useCallback((perPage: number) => {
        setStates(prev => ({...prev, perPage, page: 1}))
	}, [])
	
	const setPage = useCallback((page: number) => {
        setStates(prev => ({...prev, page}))
	}, [])
	
	const setSort = useCallback((sort: SortState) => {
        setStates(prev => ({...prev, sort}))
	}, [])
	
	const setFilters = useCallback((filters: FilterDataType[] | ((prev: FilterDataType[]) => FilterDataType[])) => {
        setStates(prev => ({...prev, filters: Array.isArray(filters) ? filters : filters(prev.filters)}))
    }, [])

	return useMemo(() => {
		return {
			...states,
			filterProps,
			filterSubmit,
			filterReset,
			sortProps,
            paginateProps,
			setPerPage,
			setPage,
			setSort,
			setFilters
		}
	// eslint-disable-next-line
	}, [states])
}
