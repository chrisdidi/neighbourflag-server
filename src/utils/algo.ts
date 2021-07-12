export function randomDigits(n) {
  const add = 1;
  let max = 12 - add; // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.

  if (n > max) {
    return randomDigits(max) + randomDigits(n - max);
  }

  max = Math.pow(10, n + add);
  const min = max / 10; // Math.pow(10, n) basically
  const number = Math.floor(Math.random() * (max - min + 1)) + min;

  return ('' + number).substring(add);
}

export const makeQueryString = q =>
  q
    ? `?${Object.keys(q)
        .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(q[k])}`)
        .join('&')}`
    : '';

export const addMinutes = (date, minutes) => {
  return new Date(date.getTime() + minutes * 60000);
};

export const padWithChar = (
  input: number,
  length: number,
  char: string | number,
) => {
  let result = '' + input;
  while (result.length < length) {
    result = char + '' + result;
  }

  return result;
};
