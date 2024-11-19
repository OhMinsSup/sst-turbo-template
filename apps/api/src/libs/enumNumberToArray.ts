const StringIsNumber = (value: string) => isNaN(Number(value)) === true;

// Turn enum into array
export function EnumToArray<T>(enumme: T): T[] {
  return (
    Object.keys(enumme)
      .filter(StringIsNumber)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      .map((key) => enumme[key]) as T[]
  );
}
