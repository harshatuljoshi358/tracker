import DailyLog from "../models/DailyLog.js";
import Task from "../models/Task.js";

import StudyActivity from "../models/StudyActivity.js";
import FootballActivity from "../models/FootballActivity.js";
import GymWorkout from "../models/GymWorkout.js";

import StorageService from "./StorageService.js";


export default class LogService {

    constructor() {
        this.storage = new StorageService();

        this.logs = new Map();

        this.cloudTimer = null;

        this.loadLogs();
    }


    // ========================================================
    // REMOTE (SUPABASE) LOAD
    // ========================================================

    async initRemote() {

        if (!this.storage.cloudEnabled()) {
            return;
        }

        // Merge cloud data into local data (cloud wins),
        // then persist everything locally and refresh UI.
        const rows =
            await this.storage.fetchAllFromCloud();

        for (const row of rows) {

            const logData =
                row && row.payload;

            if (
                !logData ||
                !logData.date
            ) {
                continue;
            }

            const reconstructed =
                this.reconstructLogFromData(logData);

            this.logs.set(
                reconstructed.date,
                reconstructed
            );
        }

        this.saveLogs();
    }


    // ========================================================
    // LOG CREATION
    // ========================================================

    createLog(date) {

        if (this.logs.has(date)) {
            return this.logs.get(date);
        }

        const log = new DailyLog(date);

        this.logs.set(date, log);

        this.saveLogs();

        return log;
    }


    // ========================================================
    // GET LOG
    // ========================================================

    getLog(date) {
        return this.logs.get(date);
    }


    // ========================================================
    // DELETE LOG
    // ========================================================

    deleteLog(date) {

        this.logs.delete(date);

        this.saveLogs();
    }


    // ========================================================
    // GET ALL LOGS
    // ========================================================

    getAllLogs() {

        return Array.from(
            this.logs.values()
        );
    }


    // ========================================================
    // SAVE LOGS
    // ========================================================

    saveLogs() {

        const logs = Array.from(
            this.logs.values()
        );

        this.storage.save(logs);

        if (this.storage.cloudEnabled()) {
            this.scheduleCloudPush(logs);
        }
    }


    scheduleCloudPush(logs) {

        clearTimeout(this.cloudTimer);

        const snapshot =
            JSON.parse(JSON.stringify(logs));

        this.cloudTimer = setTimeout(
            () => {
                this.storage.pushAllToCloud(snapshot);
            },
            600
        );
    }


    // ========================================================
    // LOAD LOGS
    // ========================================================

    loadLogs() {

        const storedLogs = this.storage.load();

        if (!storedLogs) {
            return;
        }

        if (!Array.isArray(storedLogs)) {
            console.error(
                "Stored data is not an array; ignoring."
            );
            return;
        }

        for (const data of storedLogs) {

            if (
                !data ||
                typeof data !== "object" ||
                !data.date
            ) {
                continue;
            }

            const log =
                this.reconstructLogFromData(data);

            this.logs.set(
                log.date,
                log
            );
        }
    }


    // ========================================================
    // RECONSTRUCT LOG FROM DATA
    // ========================================================

    reconstructLogFromData(data) {

        const log = new DailyLog(
            data.date
        );


        // ------------------------------------------------
        // Highlight
        // ------------------------------------------------

        log.highlight = data.highlight || "";


        // ------------------------------------------------
        // Journal
        // ------------------------------------------------

        log.journal = data.journal || "";


        // ------------------------------------------------
        // Tasks
        // ------------------------------------------------

        log.tasks = (data.tasks || []).map(
            taskData => {

                return new Task(
                    taskData && taskData.description
                        ? taskData.description
                        : "",
                    taskData && taskData.completed
                        ? taskData.completed
                        : false
                );

            }
        );


        // ------------------------------------------------
        // Activities
        // ------------------------------------------------

        log.activities = (
            data.activities || []
        )
            .map(
                activityData =>
                    this.reconstructActivity(
                        activityData
                    )
            )
            .filter(
                activity => activity !== null
            );


        return log;
    }


    // ========================================================
    // RECONSTRUCT ACTIVITY
    // ========================================================

    reconstructActivity(data) {

        if (!data || !data.type) {
            return null;
        }


        // ------------------------------------------------
        // STUDY
        // ------------------------------------------------

        if (data.type === "study") {

            return new StudyActivity(
                data.date,
                data.subject,
                data.duration
            );
        }


        // ------------------------------------------------
        // FOOTBALL
        // ------------------------------------------------

        if (data.type === "football") {

            return new FootballActivity(
                data.date,
                data.duration
            );
        }


        // ------------------------------------------------
        // GYM
        // ------------------------------------------------

        if (data.type === "gym") {

            const workout = new GymWorkout(
                data.date,
                data.name
            );


            for (
                const exerciseData
                of data.exercises || []
            ) {

                if (
                    !exerciseData ||
                    !exerciseData.name
                ) {
                    continue;
                }

                const exercise =
                    workout.addExercise(
                        exerciseData.name
                    );


                for (
                    const setData
                    of exerciseData.sets || []
                ) {

                    if (
                        !setData ||
                        typeof setData !== "object"
                    ) {
                        continue;
                    }

                    exercise.addSet(
                        setData.weight,
                        setData.reps
                    );
                }
            }


            return workout;
        }


        // ------------------------------------------------
        // UNKNOWN ACTIVITY
        // ------------------------------------------------

        return null;
    }
}