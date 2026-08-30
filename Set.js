/* =====================================================
   SET
   One working set: a weight and a number of reps.
   Only stores what has a direct purpose.
===================================================== */

export class Set {

    constructor(weight, reps) {

        const w = Number(weight);
        const r = Number(reps);

        if (
            !Number.isFinite(w) ||
            w < 0
        ) {
            throw new Error(
                "Set weight must be a non-negative number."
            );
        }

        if (
            !Number.isInteger(r) ||
            r < 0
        ) {
            throw new Error(
                "Set reps must be a non-negative integer."
            );
        }

        this.weight = w;
        this.reps = r;
    }


    /*
        Derived — useful for PRs and future
        volume views, not stored separately.
    */

    get volume() {

        return this.weight * this.reps;
    }
}
