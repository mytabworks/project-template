import { camel } from "./case"
import is from "./is"

const d = window?.document
export const root = d.documentElement

export function qs(query: string, finder?: Element) {
    return (finder || d).querySelector(query)
}
export function qsa(query: string, finder?: Element) {
    return Array.from((finder || d).querySelectorAll(query))
}
export function on(element: Element, event: string, callback: (e: any) => void) {
    element.addEventListener(event, callback, false)
}
export function off(element: Element, event: string, callback: (e: any) => void) {
    element.removeEventListener(event, callback, false)
}
export function triggerEvent(el: Element, event: any, opt?: any) {
    var custom: any = new CustomEvent(event, opt || {})
    for(let key in opt) {
        custom[key as any] = opt[key]
    }
    return el.dispatchEvent(custom)
}
export const css = (
	element: Element,
	key: string | Record<string, any>,
	value?: any
) => {
	const style = (element as any).style;
	return is.set(value)
		? camel(key as string) in style && (style[camel(key as string)] = value)
		: is.obj(key)
		? Object.keys(key).forEach(function (each) {
				camel(each) in style && (style[camel(each)] = (key as Record<string, any>)[each]);
		  })
		: parseFloat(
				window.getComputedStyle(element).getPropertyValue(key as string).replace('px', '')
		  );
};

export const hasClass = (element: Element, find: string) => (' '+element.className+' ').indexOf(' '+find.trim()+' ') !== -1
  
export const addClass = (_el: Element, _class: string) => {
	var clname = _el.className
	_class.split(/\s{1,10}/).forEach(function(cl) {
		if(hasClass(_el, cl)) return
		clname += (clname ? ' ' : '') + cl
	})
	_el.className = clname.trim()
}
  
export const removeClass = (_el: Element, _class: string) => {
	var clname = _el.className
	_class.split(/\s{1,10}/).forEach(function(cl) {
	  if(hasClass(_el, cl)) clname = clname.replace(new RegExp('\\s{0,20}?'+cl+'\\s{0,20}?','g'),'')
	})
	_el.className = clname.trim()
}
  
export const toggleClass = (_el: Element, _class: string) => {
	var added = false, removed = false
	_class.split(/\s{1,10}/).slice(0,2).forEach(function(cl) {
		if(hasClass(_el, cl) && !removed) {
			removeClass(_el, cl)
			removed = true
		} else if(!added) {
			addClass(_el, cl)
			added = true
		}
	})
}