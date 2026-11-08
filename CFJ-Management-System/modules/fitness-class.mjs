/** Shared response model. IDs are strings and availability is a non-negative integer. */
export function fitnessClassFromResponse(value) {
  if (value === null || typeof value !== 'object') throw new TypeError('Class data is required');
  for (const key of ['id', 'name', 'trainer']) {
    if (typeof value[key] !== 'string' || !value[key].trim()) throw new TypeError(`${key} is required`);
  }
  if (!Number.isSafeInteger(value.spaces) || value.spaces < 0) throw new TypeError('Invalid spaces');
  return Object.freeze({ id: value.id.trim(), name: value.name.trim(), trainer: value.trainer.trim(), spaces: value.spaces });
}
