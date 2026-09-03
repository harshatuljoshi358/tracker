import Task from "../models/Task.js";

export default class TaskService {
    constructor(logService) {
        this.logService = logService;
    }

    addTask(date, description) {

        if (
            !description ||
            typeof description !== "string"
        ) {
            throw new Error("Task description is required");
        }

        const trimmed = description.trim();

        if (!trimmed) {
            throw new Error("Task description cannot be empty");
        }

        const log = this.logService.getLog(date);

        if (!log) {
            throw new Error("No log found for the given date");
        }

        const task = new Task(trimmed);

        log.addTask(task);

        this.logService.saveLogs();

        return task;
    }

    toggleTask(date, index) {

        if (
            !Number.isInteger(index) ||
            index < 0
        ) {
            throw new Error("Invalid task index");
        }

        const log = this.logService.getLog(date);

        if (!log) {
            throw new Error("No log found for the given date");
        }

        const task = log.tasks[index];

        if (!task) {
            throw new Error("Task not found at the given index");
        }

        if (task.completed) {
            task.uncomplete();
        } else {
            task.complete();
        }

        this.logService.saveLogs();
    }

    updateTask(date, index, description) {

        if (
            !Number.isInteger(index) ||
            index < 0
        ) {
            throw new Error("Invalid task index");
        }

        if (
            !description ||
            typeof description !== "string"
        ) {
            throw new Error("Task description is required");
        }

        const trimmed = description.trim();

        if (!trimmed) {
            throw new Error("Task description cannot be empty");
        }

        const log = this.logService.getLog(date);

        if (!log) {
            throw new Error("No log found for the given date");
        }

        const task = log.tasks[index];

        if (!task) {
            throw new Error("Task not found at the given index");
        }

        task.description = trimmed;

        this.logService.saveLogs();
    }

    removeTask(date, index) {

        if (
            !Number.isInteger(index) ||
            index < 0
        ) {
            throw new Error("Invalid task index");
        }

        const log = this.logService.getLog(date);

        if (!log) {
            throw new Error("No log found for the given date");
        }

        log.removeTask(index);

        this.logService.saveLogs();
    }

    getTasks(date) {
        const log = this.logService.getLog(date);

        if (!log) {
            return [];
        }

        return log.tasks;
    }
}