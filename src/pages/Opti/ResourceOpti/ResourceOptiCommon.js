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
function numberProcess(number, fixed) {
  return number
    ? Number(number)
        .toFixed(fixed || 2)
        .toLocaleString()
    : 0;
}

function numberCutDecimal(number) {
  return number ? Math.floor(number).toLocaleString() : 0;
}

export { numberProcess, chartColorByNumber, numberCutDecimal };
