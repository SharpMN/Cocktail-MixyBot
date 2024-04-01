import { Notify } from 'quasar';

export const toast = async (
  message: string,
  position: 'top' | 'center' | 'bottom' = 'bottom',
  timeout = 1500,
  type = 'info'
): Promise<void> => {
  Notify.create({
    message,
    timeout,
    position,
    type
  });
}

export const eventsMap = {
  message: (string: string, cb?: (data: string | number) => void): void => {
    string && toast(string)
    cb && cb(string)
  },
  duration: (duration: number, cb?: (data: number) => void): void => {
    const startTime = new Date().getTime()
    const endTime = startTime + duration;

    setInterval(function () {
      const curTime = new Date().getTime()
      const progress = getProgressBarValue(curTime, startTime, endTime);
      cb && cb(progress);
    }, 1000)
  },
}

const getProgressBarValue = (curTime: number, startTime: number, endTime: number): number => {
  // Calculate the elapsed time since start
  const elapsedTime = curTime - startTime;

  // Prevent negative elapsed time (handles cases where curTime might be slightly before startTime due to system time adjustments)
  const nonNegativeElapsedTime = Math.max(elapsedTime, 0);

  // Calculate progress ratio (0-1)
  const progressRatio = nonNegativeElapsedTime / (endTime - startTime);

  // Convert progress ratio to percentage (0-100)
  const progressValue = progressRatio * 100;

  // Clamp progress between 0 and 100 for completeness
  return Math.min(Math.max(progressValue, 0), 100);
}
