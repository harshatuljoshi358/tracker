/* =====================================================
   APP ENTRY POINT
   Boots the dashboard once the DOM is ready.
===================================================== */

import { Dashboard } from "./Dashboard.js";

document.addEventListener(
    "DOMContentLoaded",
    () => {

        new Dashboard();

    }
);
