const types: any = {
	b: 'boolean',
	f: 'function',
	s: 'string',
	o: 'object',
	u: 'undefined',
	n: 'number',
	e: 'element',
	a: 'array',
	j: 'json',
};

const type_of = (type: string) => (a: any) => typeof a === types[type];

const is = {
	set: (a: any) => typeof a !== types.u,
	str: type_of('s'),
	int: type_of('n'),
	fnc: type_of('f'),
	und: type_of('u'),
	bol: type_of('b'),
	obj: (a: any) => !!a && a !== '[object Object]' && a.toString() === '[object Object]',
	nll: (a: any) => a === null,
	arr: (a: any) => Array.isArray(a),
	ele: (a: any) => !!a && a.nodeType === 1,
	now: {
		gt: (date: string | Date | number) => Date.now() > new Date(date).getTime(),
		gte: (date: string | Date | number) => Date.now() >= new Date(date).getTime(),
		lt: (date: string | Date | number) => Date.now() < new Date(date).getTime(),
		lte: (date: string | Date | number) => Date.now() <= new Date(date).getTime()
	}
};

export default is