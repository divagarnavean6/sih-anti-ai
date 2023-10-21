import * as Scheduler from 'scheduler';

const runWithLowPriority = cb => Scheduler.unstable_runWithPriority(Scheduler.unstable_LowPriority, () => {
  cb();
});

export { runWithLowPriority };