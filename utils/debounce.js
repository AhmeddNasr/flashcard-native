export default function debounce(fn, delay) {
  let timeOut;
  return (...args) => {
    clearTimeout(timeOut);
    timeOut = setTimeout(() => fn(...args), delay);
  };
}
