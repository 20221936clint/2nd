// Wait for the DOM to load before running the script
document.addEventListener("DOMContentLoaded", () => {
    // Initialize Supabase
    const supabase = window.supabase.createClient(
        "https://njvefntioxjogqmmmflp.supabase.co", 
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qdmVmbnRpb3hqb2dxbW1tZmxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwNzg1MTMsImV4cCI6MjA1ODY1NDUxM30.2IWYWe_rPC9Dv-vxOeufpO2lqVbpcpTSj5OYmUMcd_Q"
    );

    // Function to validate reCAPTCHA
    function validateCaptcha() {
        let captchaResponse = grecaptcha.getResponse();
        if (captchaResponse.length === 0) {
            alert("Please complete the CAPTCHA before proceeding.");
            return false;
        }
        return true;
    }

    // LOGIN EVENT LISTENER
    document.getElementById("login-form").addEventListener("submit", async function(event) {
        event.preventDefault();

        if (!validateCaptcha()) return; // Stop if CAPTCHA is not completed

        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            alert("Login failed: " + error.message);
        } else {
            alert("Login successful! Redirecting...");
            window.location.href = "dashboard.html";
        }
    });

    // REGISTER EVENT LISTENER
    document.getElementById("register-form").addEventListener("submit", async function(event) {
        event.preventDefault();

        if (!validateCaptcha()) return; // Stop if CAPTCHA is not completed

        const email = document.getElementById("register-email").value;
        const password = document.getElementById("register-password").value;

        const { error } = await supabase.auth.signUp({ email, password });

        if (error) {
            alert("Registration failed: " + error.message);
        } else {
            alert("Registration successful! Please check your email to confirm your account.");
            document.getElementById("register-container").style.display = "none";
            document.getElementById("login-container").style.display = "block";
        }
    });

    // LOGOUT FUNCTION
    async function logout() {
        await supabase.auth.signOut();
        window.location.href = "index.html"; // Redirect to login page
    }

    // If on dashboard, check for logout button and attach event
    if (window.location.pathname.includes("dashboard.html")) {
        document.getElementById("logout-button").addEventListener("click", logout);
    }

    // Toggle between Login and Register forms
    document.getElementById("show-register").addEventListener("click", function(event) {
        event.preventDefault();
        document.getElementById("login-container").style.display = "none";
        document.getElementById("register-container").style.display = "block";
    });

    document.getElementById("show-login").addEventListener("click", function(event) {
        event.preventDefault();
        document.getElementById("register-container").style.display = "none";
        document.getElementById("login-container").style.display = "block";
    });

    // Check if the user is logged in
    async function checkUser() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user && window.location.pathname.includes("dashboard.html")) {
            window.location.href = "index.html"; // Redirect to login if not authenticated
        }
    }
    checkUser();
});