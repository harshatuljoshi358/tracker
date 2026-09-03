import Activity from "./Activity.js";

export default class FootballActivity extends Activity {
    constructor(date, duration) {
        super(date, "football");

        this.duration = duration;
    }
}