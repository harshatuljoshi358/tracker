import { getSupabaseClient } from "./supabase.js";


const supabase = getSupabaseClient();


export async function signUp(email, password) {
    const { data, error } =
        await supabase.auth.signUp({
            email,
            password
        });

    if (error) {
        throw error;
    }

    return data;
}


export async function signIn(email, password) {
    const { data, error } =
        await supabase.auth.signInWithPassword({
            email,
            password
        });

    if (error) {
        throw error;
    }

    return data;
}


export async function signOut() {
    const { error } =
        await supabase.auth.signOut();

    if (error) {
        throw error;
    }
}


export async function getCurrentUser() {
    const { data, error } =
        await supabase.auth.getUser();

    if (error) {
        return null;
    }

    return data.user || null;
}


// ============================================================
// AUTH UI
// ============================================================

const mainEl = document.querySelector("main.page");
const authScreenEl = document.getElementById("auth-screen");
const authFormEl = document.getElementById("auth-form");
const emailInput = document.getElementById("auth-email");
const passwordInput = document.getElementById("auth-password");
const signInBtn = document.getElementById("auth-signin-btn");
const signUpBtn = document.getElementById("auth-signup-btn");
const authMessageEl = document.getElementById("auth-message");
const signOutBtn = document.getElementById("signout-btn");
const userEmailEl = document.getElementById("user-email");

let showTracker = null;


function showAuth() {

    if (authScreenEl) {
        authScreenEl.style.display = "flex";
    }

    if (mainEl) {
        mainEl.style.display = "none";
    }
}


function showTrackerUI() {

    if (authScreenEl) {
        authScreenEl.style.display = "none";
    }

    if (mainEl) {
        mainEl.style.display = "block";
    }
}


function clearAuthMessage() {

    if (authMessageEl) {
        authMessageEl.textContent = "";
        authMessageEl.className = "auth-message";
    }
}


function showAuthError(message) {

    if (authMessageEl) {
        authMessageEl.textContent = message;
        authMessageEl.className = "auth-message auth-message--error";
    }
}


function showAuthSuccess(message) {

    if (authMessageEl) {
        authMessageEl.textContent = message;
        authMessageEl.className = "auth-message auth-message--success";
    }
}


function lockForm(locked) {

    if (signInBtn) {
        signInBtn.disabled = locked;
    }

    if (signUpBtn) {
        signUpBtn.disabled = locked;
    }
}


async function startTracker(user) {

    showTrackerUI();

    if (userEmailEl) {
        userEmailEl.textContent = user && user.email
            ? user.email
            : "";
    }

    if (showTracker) {
        showTracker();
        return;
    }

    try {
        const { initApp } =
            await import("./app.js");

        showTracker = initApp;

        showTracker();
    } catch (error) {
        console.error(
            "Failed to start tracker:",
            error
        );
        showAuthError(
            "Could not start the tracker. Try reloading the page."
        );
    }
}


function resetTracker() {

    showTracker = null;

    window.localStorage.removeItem(
        "daily-tracker-data"
    );
}


async function handleSignIn() {

    clearAuthMessage();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        showAuthError(
            "Please enter your email and password."
        );
        return;
    }

    lockForm(true);

    try {
        await signIn(email, password);
    } catch (error) {
        const message =
            error && error.message
                ? error.message
                : "Sign in failed. Please try again.";

        showAuthError(message);
        lockForm(false);
    }
}


async function handleSignUp() {

    clearAuthMessage();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        showAuthError(
            "Please enter your email and password."
        );
        return;
    }

    if (password.length < 6) {
        showAuthError(
            "Password must be at least 6 characters."
        );
        return;
    }

    lockForm(true);

    try {
        await signUp(email, password);
        showAuthSuccess(
            "Account created. You are now signed in."
        );
    } catch (error) {
        const message =
            error && error.message
                ? error.message
                : "Could not create an account. Please try again.";

        showAuthError(message);
        lockForm(false);
    }
}


async function handleSignOut() {

    try {
        await signOut();
    } catch (error) {
        console.error(
            "Sign out failed:",
            error
        );
    }

    resetTracker();

    window.location.reload();
}


function bindEvents() {

    if (authFormEl) {
        authFormEl.addEventListener(
            "submit",
            event => {
                event.preventDefault();
                handleSignIn();
            }
        );
    }

    if (signInBtn) {
        signInBtn.addEventListener(
            "click",
            handleSignIn
        );
    }

    if (signUpBtn) {
        signUpBtn.addEventListener(
            "click",
            handleSignUp
        );
    }

    if (signOutBtn) {
        signOutBtn.addEventListener(
            "click",
            handleSignOut
        );
    }
}


function registerAuthListener() {

    supabase.auth.onAuthStateChange(
        (event, session) => {

            const user =
                session && session.user
                    ? session.user
                    : null;

            if (
                event === "SIGNED_IN" ||
                (event === "INITIAL_SESSION" && user)
            ) {
                startTracker(user);
            }
        }
    );
}


async function initialise() {

    bindEvents();
    registerAuthListener();

    // Show a neutral state while auth is resolved.
    if (authScreenEl) {
        authScreenEl.style.display = "flex";
    }

    if (mainEl) {
        mainEl.style.display = "none";
    }

    const {
        data: { session }
    } = await supabase.auth.getSession();

    if (session && session.user) {
        startTracker(session.user);
    } else {
        showAuth();
    }
}


initialise();
