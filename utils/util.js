function formatTime(date) {
  let time = new Date(date);
  let hours = time.getHours();
  let minus = time.getMinutes();
  if (hours < 10) {
    hours = '0' + hours;
  }
  if (minus < 10) {
    minus = '0' + minus;
  }
  return hours + ':' + minus;
}

module.exports = {
  formatTime: formatTime
}