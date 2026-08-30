/* =====================================================
   CALENDAR
   Renders a month grid. Stays activity-agnostic:
   the caller supplies a getLoggedDays(activity)
   strategy that returns a Set<number> of day numbers
   for the currently displayed month. This lets the
   gym view source its data from GymManager without
   the calendar knowing anything about it.
===================================================== */

export class Calendar {

    constructor(
        container,
        monthLabel,
        onDaySelected,
        options = {}
    ) {

        this.container = container;
        this.monthLabel = monthLabel;
        this.onDaySelected = onDaySelected;

        this.getLoggedDays =
            options.getLoggedDays ??
            (() => new Set());

        this.onDataChange =
            options.onDataChange ?? null;

        const today = new Date();

        this.year = today.getFullYear();
        this.month = today.getMonth();

        this.selectedActivity = "all";
        this.selectedDay =
            today.getFullYear() === this.year &&
            today.getMonth() === this.month
                ? today.getDate()
                : null;

        this.render();
    }


    setActivity(activity) {

        this.selectedActivity = activity;

        this.selectedDay = null;

        this.render();
    }


    getDaysInMonth() {

        return new Date(
            this.year,
            this.month + 1,
            0
        ).getDate();
    }


    getFirstDay() {

        const date = new Date(
            this.year,
            this.month,
            1
        );

        return (
            date.getDay() + 6
        ) % 7;
    }


    selectDay(day) {

        this.selectedDay = day;

        this.render();

        this.onDaySelected(
            day,
            this.selectedActivity
        );
    }


    /*
        Re-render without changing selection.
        Wired to GymManager changes by Dashboard.
    */

    refresh() {

        this.render();
    }


    render() {

        this.container.innerHTML = "";


        /*
            When viewing "all", no days are
            marked as logged — only today.
            Specific activities still show
            their own logged days.
        */

        const showLogged =
            this.selectedActivity !== "all";

        const loggedDays = showLogged
            ? this.getLoggedDays(
                this.selectedActivity
            )
            : new Set();

        const daysInMonth =
            this.getDaysInMonth();

        const firstDay =
            this.getFirstDay();


        const monthName =
            new Date(
                this.year,
                this.month
            ).toLocaleString(
                "en-US",
                {
                    month: "long"
                }
            );


        this.monthLabel.textContent =
            `${monthName.toUpperCase()} ${this.year}`;


        const today = new Date();


        /*
            Empty cells
        */

        for (
            let i = 0;
            i < firstDay;
            i++
        ) {

            const empty =
                document.createElement("span");

            empty.classList.add(
                "calendar-day",
                "empty"
            );

            this.container.appendChild(empty);
        }


        /*
            Calendar days
        */

        for (
            let day = 1;
            day <= daysInMonth;
            day++
        ) {

            const element =
                document.createElement("button");

            element.type = "button";

            element.classList.add(
                "calendar-day"
            );


            if (
                showLogged &&
                loggedDays.has(day)
            ) {

                element.classList.add(
                    "logged"
                );
            }


            if (
                today.getFullYear() === this.year &&
                today.getMonth() === this.month &&
                day === today.getDate()
            ) {

                element.classList.add(
                    "today"
                );
            }


            if (
                this.selectedDay === day
            ) {

                element.classList.add(
                    "selected"
                );
            }


            element.textContent = day;


            element.addEventListener(
                "click",
                () => this.selectDay(day)
            );


            this.container.appendChild(element);
        }
    }
}
