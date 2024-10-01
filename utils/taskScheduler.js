const Schedule = require('../models/schedule');
const urgencyWeights = { low: 1, medium: 2, high: 3 };

// Calculate task score based on urgency and due date
function calculateTaskScore(task) {
  const dueInDays = (task.dueDate - new Date()) / (1000 * 60 * 60 * 24);
  const urgencyWeight = urgencyWeights[task.urgency] || 1;
  return Math.round((urgencyWeight * 10) / Math.max(1, dueInDays));
}

// Sort tasks by score
function sortTasksByScore(tasks) {
  tasks.forEach(task => task.score = calculateTaskScore(task));
  return tasks.sort((a, b) => b.score - a.score);
}

// Find available time slots and schedule tasks
async function findTimeSlotAndScheduleTask(tasks) {
  let currentTime = new Date();
  let schedule = await Schedule.find().sort('startTime');

  for (const task of tasks) {
    const estimatedTimeInMinutes = task.estimatedTime || 0;
    let taskScheduled = false;

    for (let i = 0; i < schedule.length; i++) {
      const gapStart = currentTime;
      const nextTaskStart = schedule[i].startTime;
      const availableTime = (nextTaskStart - gapStart) / (1000 * 60);

      if (availableTime >= estimatedTimeInMinutes) {
        const startTime = gapStart;
        const endTime = new Date(gapStart.getTime() + estimatedTimeInMinutes * 60000);

        await new Schedule({ event: task._id, startTime, endTime }).save();
        taskScheduled = true;
        break;
      }
      currentTime = schedule[i].endTime;
    }

    if (!taskScheduled) {
      const lastTaskEndTime = schedule.length ? schedule[schedule.length - 1].endTime : new Date();
      const startTime = lastTaskEndTime;
      const endTime = new Date(lastTaskEndTime.getTime() + estimatedTimeInMinutes * 60000);
      await new Schedule({ event: task._id, startTime, endTime }).save();
    }
  }
}

module.exports = {
  calculateTaskScore,
  sortTasksByScore,
  findTimeSlotAndScheduleTask
};
