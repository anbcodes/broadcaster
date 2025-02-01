import { Temporal } from "temporal-polyfill";

export function generateRandomId(length = 15) {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let result = '';
    const bytes = crypto.getRandomValues(new Uint8Array(length));
    for (let i = 0; i < length; i++) {
        result += characters.charAt(bytes[i] % charactersLength);
    }
    return result;
}

/**
 * @template {any} T
 * @param {T[]} arr 
 * @param {(v: T, i: number, a: T[]) => Promise<boolean>} predicate 
 * @returns {Promise<T[]>}
 */
export const asyncFilter = async (arr, predicate) => {
    const results = await Promise.all(arr.map(predicate));

    return arr.filter((_v, index) => results[index]);
}

// in miliseconds
const units = {
    year  : 24 * 60 * 60 * 1000 * 365,
    month : 24 * 60 * 60 * 1000 * 365/12,
    day   : 24 * 60 * 60 * 1000,
    hour  : 60 * 60 * 1000,
    minute: 60 * 1000,
    second: 1000
  }
  
let rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  
/**
 * 
 * @param {Temporal.ZonedDateTime} d1 
 * @param {Temporal.ZonedDateTime} d2 
 * @returns 
 */
export const getRelativeTime = (d1, d2 = Temporal.Now.zonedDateTimeISO()) => {
    let elapsed = d2.until(d1, {smallestUnit: 'second'}).total({unit: 'milliseconds'});
  
    // "Math.abs" accounts for both "past" & "future" scenarios
    
    for (const u in units) {
        const unit = /** @type {keyof typeof units} */ (u);
        if (Math.abs(elapsed) > units[unit] || u == 'second') {
            return rtf.format(Math.round(elapsed/units[unit]), unit)
        }
    }
      
  };