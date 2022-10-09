export function tryCatch<T>(fn: () => T): [T, null] | [null, any] {
  try {
    return [fn(), null]
  } catch (e) {
    return [null, e]
  }
}

export async function asyncTryCatch<T>(
  fn: () => Promise<T>,
): Promise<[T, null] | [null, any]> {
  try {
    return [await fn(), null]
  } catch (e) {
    return [null, e]
  }
}
