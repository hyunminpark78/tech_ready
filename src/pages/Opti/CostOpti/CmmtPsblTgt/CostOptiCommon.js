function chartColorByNumber(percent) {
  // const chartColor = [{ color: 'red' }, { color: 'orange' }, { color: 'green' }];
  if (percent < 70) {
    return '#ea1818';
  } else if (percent >= 70 && percent < 80) {
    return '#ea6e18';
  } else if (percent >= 80) {
    return '#1ae3bb';
  }
}
// 사용률에 따른 칼라 변경
function chartColorByUseRate(percent) {
  // const chartColor = [{ color: 'red' }, { color: 'orange' }, { color: 'green' }];
  if (percent < 100) {
    return '#1ae3bb';
  } else {
    return '#ea1818';
  }
}
function numberProcess(number, fixed) {
  return number
    ? fixed === 0
      ? Number(number).toFixed().toLocaleString()
      : Number(number)
          .toFixed(fixed || 2)
          .toLocaleString()
    : 0;
}

function numberCutDecimal(number) {
  return number ? Math.floor(number).toLocaleString() : '0';
}

function numberCutDecimalSum(...numbers) {
  let sum = 0;
  for (const number of numbers) {
    sum += typeof number === 'number' ? Math.floor(number) : 0;
  }
  return sum.toLocaleString();
}

export { numberProcess, chartColorByNumber, chartColorByUseRate, numberCutDecimal, numberCutDecimalSum };
