type DeScripted<T> = {
  [K in keyof T]: {
    readonly name: string;
    readonly value: T[K];
  }
}[keyof T];

/**
 * Helper to produce an array of enum descriptors.
 * @param enumeration Enumeration object.
 * @param separatorRegex Regex that would catch the separator in your enum key.
 */
export function enumToDeScriptedArray<T>(enumeration: T, separatorRegex: RegExp = /_/g): DeScripted<T>[] {
  return (Object.keys(enumeration as any) as Array<keyof T>)
    .filter((key) => isNaN(Number(key)))
    .filter((key) => typeof enumeration[key] === 'number' || typeof enumeration[key] === 'string')
    .map((key) => ({
      name: String(key).replace(separatorRegex, ' '),
      value: enumeration[key],
    }));
}

type NonFunctional<T> = T extends Function ? never : T;

/**
 * Helper to produce an array of enum values.
 * @param enumeration Enumeration object.
 */
export function enumToArray<T>(
  enumeration: T
): NonFunctional<T[keyof T]>[] {
  return Object.keys(enumeration as any)
    .filter((key) => isNaN(Number(key)))
    .map((key) => (enumeration as any)[key])
    .filter((val) => typeof val === 'number' || typeof val === 'string');
}

/**
 * Converts the given enum to a map of the keys to the values.
 * @param enumeration The enum to convert to a map.
 */
export function enumToMap(enumeration: any): Map<string, string | number> {
  const map = new Map<string, string | number>();
  for (const key in enumeration) {
    // TypeScript does not allow enum keys to be numeric
    if (isNaN(Number(key))) {
      const val = enumeration[key] as string | number;

      // TypeScript does not allow enum value to be null or undefined
      if (val !== undefined && val !== null) { map.set(key, val); }
    }
  }

  return map;
}
