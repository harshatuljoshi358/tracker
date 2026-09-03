import Activity from "./Activity.js";

export default class StudyActivity extends Activity {
    constructor(date, subject, duration) {
        super(date, "study");

        this.subject = subject;
        this.duration = duration;
    }
}