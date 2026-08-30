/* =====================================================
   TASK MANAGER
   Owns the task list and renders it into the
   provided container. Tracks completion count.
===================================================== */

import { Task } from "./Task.js";

export class TaskManager {

    constructor(container, counter) {

        this.container = container;
        this.counter = counter;

        this.tasks = [
            new Task(1, "Gym / Push", true),
            new Task(2, "Study / GraphRAG", true),
            new Task(3, "Football / 19:00", false),
            new Task(4, "Read / 20 pages", false)
        ];

        this.render();
    }


    toggleTask(id) {

        const task = this.tasks.find(
            task => task.id === id
        );

        if (!task) {
            return;
        }

        task.toggle();

        this.render();
    }


    addTask(text) {

        if (!text.trim()) {
            return;
        }

        const task = new Task(
            Date.now(),
            text,
            false
        );

        this.tasks.push(task);

        this.render();
    }


    render() {

        this.container.innerHTML = "";

        this.tasks.forEach(task => {

            const element =
                document.createElement("div");

            element.classList.add("task");

            if (task.completed) {
                element.classList.add("completed");
            }

            element.innerHTML = `
                <div class="task-checkbox"></div>

                <span class="task-text">
                    ${task.text}
                </span>
            `;

            element.addEventListener(
                "click",
                () => this.toggleTask(task.id)
            );

            this.container.appendChild(element);
        });

        this.updateCounter();
    }


    updateCounter() {

        const completed =
            this.tasks.filter(
                task => task.completed
            ).length;

        this.counter.textContent =
            `${completed} / ${this.tasks.length}`;
    }
}
