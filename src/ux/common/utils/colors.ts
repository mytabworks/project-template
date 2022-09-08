export const colorParse = (color: string) => {
    let r, g, b;
    
	if (color.match(/^rgb/)) {
		// If RGB --> store the red, green, blue values in separate variables
		[, r, g, b] = Array.from(color.match(
			/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
        ) || [], (value) => parseInt(value));
        
	} else {
		// If hex --> Convert it to RGB
		const scheme = +('0x' + color.slice(1).replace((color.length < 5 && /./g) as any, '$&$&'));

		r = scheme >> 16;
		g = (scheme >> 8) & 255;
		b = scheme & 255;
	}

	return { r, g, b };
};

const hexing = (colorpart: number, percent: number) => Math.max(Math.min(Math.floor(colorpart - (100 * percent)), 255), 0).toString(16);

const colorShade = (color: string, percent: number) => {
	const { r, g, b } = colorParse(color)
	
    const hexcolor = [hexing(r, percent), hexing(g, percent), hexing(b, percent)].map((hex) => hex.length === 1 ? '0' + hex : hex)
    
	return '#' + hexcolor.join('')
}

export const lightenColor = (color: string, percent: number) => colorShade(color, -percent)

export const darkenColor = (color: string, percent: number) => colorShade(color, percent)

export const isColorDark = (color: string, returnHsp?: boolean) => {
    const { r, g, b } = colorParse(color);
    const hsp = Math.sqrt(
        0.299 * (r * r) +
        0.587 * (g * g) +
        0.114 * (b * b)
        );
    return returnHsp ? hsp : hsp < 150
}

export const colorOpacity = (color: string, opacity: number) => {
	const { r, g, b } = colorParse(color);

	return `rgba(${r}, ${g}, ${b}, ${opacity})`
}