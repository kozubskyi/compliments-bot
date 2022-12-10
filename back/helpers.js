exports.createDate = function () {
  const addLeadingZero = d => (d < 10 ? '0' + d : d);
  const addTwoLeadingZeros = d => {
    if (d < 10) return '00' + d;
    if (d < 100) return '0' + d;
    return d;
  };

  const date = new Date();
  const Y = date.getFullYear();
  const M = addLeadingZero(date.getMonth() + 1);
  const D = addLeadingZero(date.getDate());
  const h = addLeadingZero(date.getHours());
  const m = addLeadingZero(date.getMinutes());
  const s = addLeadingZero(date.getSeconds());
  const ms = addTwoLeadingZeros(date.getMilliseconds());

  return `${Y}-${M}-${D}T${h}:${m}:${s}.${ms}`;
};
