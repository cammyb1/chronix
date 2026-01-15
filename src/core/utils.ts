export function convertArray(array: any[], type: any) {
  if (!array || array.constructor === type) return array;

  if (typeof type.BYTES_PER_ELEMENT === 'number') {
    return new type(array); // create typed array
  }

  return Array.prototype.slice.call(array); // create Array
}
