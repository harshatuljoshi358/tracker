export default class StatsService {

    constructor(logService) {
        this.logService = logService;
    }


    // ========================================================
    // STUDY MINUTES BY DATE
    // ========================================================

    getStudyByDate() {

        const totals = {};

        const logs =
            this.logService.getAllLogs();

        for (const log of logs) {

            if (
                !Array.isArray(log.activities)
            ) {
                continue;
            }

            let sum = 0;

            for (const activity of log.activities) {

                if (
                    activity &&
                    activity.type === "study" &&
                    activity.duration
                ) {
                    sum += Number(activity.duration);
                }
            }

            if (sum > 0) {
                totals[log.date] =
                    (totals[log.date] || 0) + sum;
            }
        }

        return totals;
    }


    // ========================================================
    // FOOTBALL MINUTES BY DATE
    // ========================================================

    getFootballByDate() {

        const totals = {};

        const logs =
            this.logService.getAllLogs();

        for (const log of logs) {

            if (
                !Array.isArray(log.activities)
            ) {
                continue;
            }

            let sum = 0;

            for (const activity of log.activities) {

                if (
                    activity &&
                    activity.type === "football" &&
                    activity.duration
                ) {
                    sum += Number(activity.duration);
                }
            }

            if (sum > 0) {
                totals[log.date] =
                    (totals[log.date] || 0) + sum;
            }
        }

        return totals;
    }


    // ========================================================
    // STUDY MINUTES BY SUBJECT, BY DATE
    //
    // Returns: { dateString: { subject: minutes } }
    // ========================================================

    getStudyBySubjectByDate() {

        const byDate = {};

        const logs =
            this.logService.getAllLogs();

        for (const log of logs) {

            if (
                !Array.isArray(log.activities)
            ) {
                continue;
            }

            for (const activity of log.activities) {

                if (
                    activity &&
                    activity.type === "study"
                ) {

                    const subject =
                        activity.subject
                            ? String(activity.subject)
                            : "Study";

                    const minutes =
                        Number(activity.duration) || 0;

                    if (minutes <= 0) {
                        continue;
                    }

                    if (!byDate[log.date]) {
                        byDate[log.date] = {};
                    }

                    byDate[log.date][subject] =
                        (
                            byDate[log.date][subject] || 0
                        ) + minutes;
                }
            }
        }

        return byDate;
    }


    // ========================================================
    // AVAILABLE SPLITS
    // ========================================================

    getSplits() {

        const splits = [];

        const logs =
            this.logService.getAllLogs();

        for (const log of logs) {

            if (
                !Array.isArray(log.activities)
            ) {
                continue;
            }

            for (const activity of log.activities) {

                if (
                    activity &&
                    activity.type === "gym" &&
                    activity.name &&
                    !splits.includes(activity.name)
                ) {
                    splits.push(activity.name);
                }
            }
        }

        return splits;
    }


    // ========================================================
    // EXERCISES FOR A SPLIT
    // ========================================================

    getExercisesForSplit(split) {

        const exercises = new Set();

        const logs =
            this.logService.getAllLogs();

        for (const log of logs) {

            if (
                !Array.isArray(log.activities)
            ) {
                continue;
            }

            for (const activity of log.activities) {

                if (
                    activity &&
                    activity.type === "gym" &&
                    activity.name === split &&
                    Array.isArray(activity.exercises)
                ) {

                    for (const exercise of activity.exercises) {

                        if (exercise && exercise.name) {
                            exercises.add(exercise.name);
                        }
                    }
                }
            }
        }

        return Array.from(exercises);
    }


    // ========================================================
    // EXERCISE PROGRESSION
    //
    // Returns an array of entries sorted by date, each:
    //   { date, sets: [{ weight, reps }] }
    // ========================================================

    getExerciseProgression(split, exerciseName) {

        const entries = [];

        const logs =
            this.logService.getAllLogs();

        for (const log of logs) {

            if (
                !Array.isArray(log.activities)
            ) {
                continue;
            }

            for (const activity of log.activities) {

                if (
                    activity &&
                    activity.type === "gym" &&
                    activity.name === split &&
                    Array.isArray(activity.exercises)
                ) {

                    const exercise =
                        activity.exercises.find(
                            ex =>
                                ex &&
                                ex.name === exerciseName
                        );

                    if (!exercise) {
                        continue;
                    }

                    const sets =
                        Array.isArray(exercise.sets)
                            ? exercise.sets
                                .filter(
                                    s =>
                                        s &&
                                        Number(s.weight) > 0
                                )
                                .map(s => ({
                                    weight: Number(s.weight),
                                    reps: Number(s.reps)
                                }))
                            : [];

                    if (sets.length === 0) {
                        continue;
                    }

                    entries.push({
                        date: log.date,
                        sets
                    });
                }
            }
        }

        entries.sort(
            (a, b) =>
                a.date.localeCompare(b.date)
        );

        return entries;
    }
}
