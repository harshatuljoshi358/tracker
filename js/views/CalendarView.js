export default class CalendarView {

    constructor(container, onDateSelected, onFilterChange) {
        this.container = container;
        this.onDateSelected = onDateSelected;
        this.onFilterChange = onFilterChange;

        this.currentDate = new Date();

        this.selectedDate =
            this.formatDate(this.currentDate);

        // Dates that contain each activity type.
        // Keyed by activity type -> Set of date strings.
        this.activityTypeDates = {};

        // "all" or one of the activity types.
        this.selectedFilter = "all";

        // Dates that contain journal or highlight text.
        this.journalDates = new Set();
    }


    // ========================================================
    // RENDER
    // ========================================================

    render() {

        this.container.innerHTML = "";

        const year =
            this.currentDate.getFullYear();

        const month =
            this.currentDate.getMonth();

        const firstDay =
            new Date(year, month, 1);

        const lastDay =
            new Date(year, month + 1, 0);


        const monthName =
            this.currentDate.toLocaleString(
                "default",
                {
                    month: "long"
                }
            );


        this.renderFilters();

        this.renderHeader(
            monthName,
            year
        );

        this.renderWeekdays();

        this.renderDays(
            year,
            month,
            firstDay.getDay(),
            lastDay.getDate()
        );
    }


    // ========================================================
    // FILTERS
    // ========================================================

    renderFilters() {

        const filterBar =
            document.createElement("div");

        filterBar.classList.add(
            "calendar-filters"
        );


        const filters = [
            { key: "all", label: "All" },
            { key: "study", label: "Study" },
            { key: "gym", label: "Gym" },
            { key: "football", label: "Football" }
        ];


        for (const filter of filters) {

            const button =
                document.createElement("button");

            button.type = "button";

            button.textContent =
                filter.label;

            button.classList.add(
                "calendar-filter"
            );

            if (
                this.selectedFilter ===
                filter.key
            ) {

                button.classList.add(
                    "active"
                );
            }

            button.addEventListener(
                "click",
                () => {
                    this.setFilter(
                        filter.key
                    );
                }
            );

            filterBar.appendChild(
                button
            );
        }


        this.container.appendChild(
            filterBar
        );
    }


    setFilter(key) {

        this.selectedFilter = key;

        this.render();

        if (this.onFilterChange) {
            this.onFilterChange(key);
        }
    }


    // ========================================================
    // HEADER
    // ========================================================

    renderHeader(monthName, year) {
        const header =
            document.createElement("div");

        header.classList.add(
            "calendar-header"
        );


        const previousButton =
            document.createElement("button");

        previousButton.type = "button";
        previousButton.textContent = "‹";


        previousButton.addEventListener(
            "click",
            () => {
                this.previousMonth();
            }
        );


        const title =
            document.createElement("h2");

        title.textContent =
            `${monthName} ${year}`;


        const nextButton =
            document.createElement("button");

        nextButton.type = "button";
        nextButton.textContent = "›";


        nextButton.addEventListener(
            "click",
            () => {
                this.nextMonth();
            }
        );


        header.append(
            previousButton,
            title,
            nextButton
        );


        this.container.appendChild(
            header
        );
    }


    // ========================================================
    // WEEKDAYS
    // ========================================================

    renderWeekdays() {

        const weekdays =
            document.createElement("div");

        weekdays.classList.add(
            "calendar-weekdays"
        );


        const names = [
            "Sun",
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat"
        ];


        for (const name of names) {

            const day =
                document.createElement("div");

            day.textContent = name;

            weekdays.appendChild(day);
        }


        this.container.appendChild(
            weekdays
        );
    }


    // ========================================================
    // DAYS
    // ========================================================

    renderDays(
        year,
        month,
        startingDay,
        numberOfDays
    ) {

        const daysContainer =
            document.createElement("div");

        daysContainer.classList.add(
            "calendar-days"
        );


        // Empty cells before first day
        for (
            let i = 0;
            i < startingDay;
            i++
        ) {

            const emptyDay =
                document.createElement("div");

            emptyDay.classList.add(
                "calendar-day",
                "empty"
            );

            daysContainer.appendChild(
                emptyDay
            );
        }


        // Actual days
        for (
            let dayNumber = 1;
            dayNumber <= numberOfDays;
            dayNumber++
        ) {

            const date =
                new Date(
                    year,
                    month,
                    dayNumber
                );


            const dateString =
                this.formatDate(date);


            const day =
                document.createElement("button");

            day.type = "button";

            day.classList.add(
                "calendar-day"
            );

            day.textContent =
                dayNumber;


            // ------------------------------------------------
            // TODAY
            // ------------------------------------------------

            if (
                dateString ===
                this.formatDate(new Date())
            ) {

                day.classList.add(
                    "today"
                );
            }


            // ------------------------------------------------
            // SELECTED DATE
            // ------------------------------------------------

            if (
                dateString ===
                this.selectedDate
            ) {

                day.classList.add(
                    "selected"
                );
            }


            // ------------------------------------------------
            // ACTIVITY DATE
            // ------------------------------------------------

            if (
                this.isActiveDate(dateString)
            ) {

                day.classList.add(
                    "active"
                );
            }


            // ------------------------------------------------
            // JOURNAL DATE
            // ------------------------------------------------

            if (
                this.journalDates.has(
                    dateString
                )
            ) {

                day.classList.add(
                    "journal"
                );
            }


            // ------------------------------------------------
            // CLICK
            // ------------------------------------------------

            day.addEventListener(
                "click",
                () => {
                    this.selectDate(
                        dateString
                    );
                }
            );


            daysContainer.appendChild(
                day
            );
        }


        this.container.appendChild(
            daysContainer
        );
    }


    // ========================================================
    // SELECT DATE
    // ========================================================

    selectDate(date) {

        this.selectedDate = date;

        this.render();

        this.onDateSelected(date);
    }


    // ========================================================
    // SET ACTIVITY TYPE DATES
    // ========================================================

    setActivityTypeDates(typeDates) {

        this.activityTypeDates = {};

        for (
            const type
            of Object.keys(typeDates || {})
        ) {

            this.activityTypeDates[type] =
                new Set(
                    typeDates[type] || []
                );
        }
    }


    // ========================================================
    // IS ACTIVE DATE
    // ========================================================

    isActiveDate(dateString) {

        // If no per-type data, fall back to false.
        if (
            Object.keys(
                this.activityTypeDates
            ).length === 0
        ) {
            return false;
        }

        if (
            this.selectedFilter === "all"
        ) {

            // On "All", only the currently selected date
            // shows a mark (if it has any activity).

            if (
                dateString !== this.selectedDate
            ) {
                return false;
            }

            return Object.values(
                this.activityTypeDates
            ).some(
                set => set.has(dateString)
            );
        }

        const typeSet =
            this.activityTypeDates[
                this.selectedFilter
            ];

        return Boolean(
            typeSet &&
            typeSet.has(dateString)
        );
    }


    // ========================================================
    // SET JOURNAL DATES
    // ========================================================

    setJournalDates(dates) {

        this.journalDates =
            new Set(dates);
    }


    // ========================================================
    // PREVIOUS MONTH
    // ========================================================

    previousMonth() {

        this.currentDate.setMonth(
            this.currentDate.getMonth() - 1
        );

        this.render();
    }


    // ========================================================
    // NEXT MONTH
    // ========================================================

    nextMonth() {

        this.currentDate.setMonth(
            this.currentDate.getMonth() + 1
        );

        this.render();
    }


    // ========================================================
    // FORMAT DATE
    // ========================================================

    formatDate(date) {

        const year =
            date.getFullYear();

        const month =
            String(
                date.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                date.getDate()
            ).padStart(2, "0");


        return `${year}-${month}-${day}`;
    }
}