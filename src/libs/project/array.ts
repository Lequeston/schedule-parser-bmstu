//функция для удаления falsy значений из массива
export const deleteFalseValuesFilter = <T>(x: T | false | undefined | "" | 0): x is T => !!x;