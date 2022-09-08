export const chainedDataIndexToObject = (dataIndex: string, dataIndexValue: any, rewrite: any = {}): any => {
  return dataIndex.split(".").reduce((result, value, index, array) => {
    const lastField = array.slice(0, index).reduce((r, v) => r[v], result)
    if(array.length - 1 === index) {
      lastField[value] = dataIndexValue
    } else {
      lastField[value] = lastField[value] || {}
    }
    return result
  }, rewrite)
}

export const chainedDataIndexExtractor = (dataIndex: string, item: any): any => {
  return dataIndex.split(".").reduce((result, value) => {
		const hasArray = value.match(/\[(\d+)\]$/)
		if(hasArray) {
			return result && result[value.substr(0, hasArray.index)][parseInt(hasArray[1])]
		}
		return result && result[value];
	}, item);
}