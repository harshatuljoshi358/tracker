export default class ActivityService {

    constructor(logService) {
        this.logService = logService;
    }


    // ========================================================
    // ADD ACTIVITY
    // ========================================================

    addActivity(date, activity) {

        if (
            !activity ||
            typeof activity !== "object"
        ) {
            throw new Error("Invalid activity");
        }

        if (
            !activity.type ||
            typeof activity.type !== "string"
        ) {
            throw new Error("Activity type is required");
        }

        let log = this.logService.getLog(date);


        // ----------------------------------------------------
        // Create the DailyLog if it doesn't exist
        // ----------------------------------------------------

        if (!log) {
            log = this.logService.createLog(date);
        }


        // ----------------------------------------------------
        // Add activity
        // ----------------------------------------------------

        log.addActivity(activity);


        // ----------------------------------------------------
        // Persist
        // ----------------------------------------------------

        this.logService.saveLogs();

        return activity;
    }


    // ========================================================
    // GET ACTIVITIES
    // ========================================================

    getActivities(date) {

        const log =
            this.logService.getLog(date);


        if (!log) {
            return [];
        }


        return log.activities;
    }


    // ========================================================
    // GET ACTIVITY DATES
    // ========================================================

    getActivityDates(type) {

        const dates = [];

        const logs =
            this.logService.getAllLogs();


        for (const log of logs) {

            const hasActivity =
                log.activities.some(
                    activity =>
                        activity.type === type
                );


            if (hasActivity) {
                dates.push(log.date);
            }
        }


        return dates;
    }


    // ========================================================
    // REMOVE ACTIVITY
    // ========================================================

    removeActivity(date, index) {

        if (
            !Number.isInteger(index) ||
            index < 0
        ) {
            throw new Error("Invalid activity index");
        }

        const log =
            this.logService.getLog(date);


        if (!log) {
            throw new Error("No log found for the given date");
        }


        if (
            index >= log.activities.length
        ) {
            throw new Error("Activity not found at the given index");
        }


        log.removeActivity(index);

        this.logService.saveLogs();
    }


    // ========================================================
    // EDIT ACTIVITY
    // ========================================================

    editActivity(date, index, activity) {

        if (
            !Number.isInteger(index) ||
            index < 0
        ) {
            throw new Error("Invalid activity index");
        }

        if (
            !activity ||
            typeof activity !== "object"
        ) {
            throw new Error("Invalid activity");
        }

        if (
            !activity.type ||
            typeof activity.type !== "string"
        ) {
            throw new Error("Activity type is required");
        }

        const log =
            this.logService.getLog(date);


        if (!log) {
            throw new Error("No log found for the given date");
        }


        if (
            index >= log.activities.length
        ) {
            throw new Error("Activity not found at the given index");
        }


        log.updateActivity(index, activity);

        this.logService.saveLogs();

        return activity;
    }
}