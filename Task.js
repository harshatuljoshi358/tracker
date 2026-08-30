/* =====================================================
   TASK
   Plain domain entity. Holds its own state, knows
   how to toggle itself.
===================================================== */

export class Task {

    constructor(id, text, completed = false) {

        this.id = id;
        this.text = text;
        this.completed = completed;
    }


    toggle() {

        this.completed = !this.completed;
    }
}
