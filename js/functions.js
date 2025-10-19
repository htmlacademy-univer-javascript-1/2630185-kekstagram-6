function isMeetingWithinWorkday(workStart, workEnd, meetingStart, meetingDuration) {
  // Вспомогательная функция для перевода "часы:минуты" → минуты
  const toMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const workStartMin = toMinutes(workStart);
  const workEndMin = toMinutes(workEnd);
  const meetingStartMin = toMinutes(meetingStart);
  const meetingEndMin = meetingStartMin + meetingDuration;

  // Проверяем, укладывается ли встреча в рабочий день
  return meetingStartMin >= workStartMin && meetingEndMin <= workEndMin;
}
export{isMeetingWithinWorkday};
