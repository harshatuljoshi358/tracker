export default class DailyLog {
    constructor(date) {
        this.date = date;

        this.highlight = "";
        this.journal = "";

        this.tasks = [];
        this.activities = [];
    }

    setHighlight(highlight) {
        this.highlight = highlight;
    }

    setJournal(journal) {
        this.journal = journal;
    }

    addTask(task) {
        this.tasks.push(task);
    }

    removeTask(index) {
        if (index >= 0 && index < this.tasks.length) {
            this.tasks.splice(index, 1);
        }
    }

    addActivity(activity) {
        this.activities.push(activity);
    }

    removeActivity(index) {
        if (index >= 0 && index < this.activities.length) {
            this.activities.splice(index, 1);
        }
    }

    updateActivity(index, activity) {
        if (index >= 0 && index < this.activities.length) {
            this.activities[index] = activity;
        }
    }
}