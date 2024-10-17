export function formattedDate(date: number) {
  let result = '';
  const d = new Date(date);
  result += `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()
  } ${d.getHours()}:${d.getMinutes()}:${
    d.getSeconds()}`;
  return result;
}
