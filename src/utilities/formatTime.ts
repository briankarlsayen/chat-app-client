import moment from 'moment';

export const formatHourSec = (timestamp?: string) => {
  const momentTimestamp = moment(timestamp);

  const yesterday = momentTimestamp.diff(moment(), 'hours') < -24;
  const moreThanYesterday = momentTimestamp.diff(moment(), 'hours') < -48;
  let formatTime;
  // Check if the current time is more than 24 hours after the timestamp
  if (moreThanYesterday) {
    formatTime = momentTimestamp.format('YYYY-MM-DD HH:mm');
    return formatTime;
  } else if (yesterday) {
    return 'yesterday';
  } else {
    formatTime = momentTimestamp.format('HH:mm');
    return formatTime;
  }
};
