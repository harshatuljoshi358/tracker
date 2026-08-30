/* =====================================================
   ACTIVITY MANAGER
   Owns the activity selector buttons and keeps the
   rest of the UI in sync with the chosen activity.
===================================================== */

import { activities } from "./data.js";

export class ActivityManager {

    constructor(
        buttons,
        nameElement,
        summaryElement,
        calendar,
        onActivityChanged = null
    ) {

        this.buttons = buttons;
        this.nameElement = nameElement;
        this.summaryElement = summaryElement;
        this.calendar = calendar;
        this.onActivityChanged = onActivityChanged;

        this.currentActivity = "all";

        this.initialize();
    }


    initialize() {

        this.buttons.forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    this.selectActivity(
                        button.dataset.activity
                    );
                }
            );
        });

        this.render();
    }


    selectActivity(activity) {

        this.currentActivity = activity;


        this.buttons.forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.activity === activity
            );
        });


        this.calendar.setActivity(
            activity
        );


        if (activity === "all") {

            this.nameElement.textContent =
                "Today";

        } else {

            this.nameElement.textContent =
                activities[activity].name;
        }


        this.render();


        if (this.onActivityChanged) {

            this.onActivityChanged(activity);
        }
    }


    render() {

        // Summary block is hidden — chart /
        // recent-logs owns the panel now.

        this.summaryElement.classList.add(
            "is-hidden"
        );
    }
}
