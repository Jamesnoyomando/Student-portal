"use strict";

(function () {
    var form = document.getElementById("registrationForm");
    var messageBox = document.getElementById("message");

    //Each rule returns an error string, or "" when the value is valid.
    var rules = {
        studentId: function (v) {
            if (!v) return "Student ID is required.";
            if (!/^[A-Za-z0-9]{6,12}$/.test(v)) {
                return "Use 6 to 12 letters or numbers, with no spaces.";
            }
            return "";
        },
        fullName: function (v) {
            if (!v) return "Full name is required.";
            if (!/^[A-Za-z][A-Za-z'\- ]+$/.test(v) || v.split(/\s+/).length < 2) {
                return "Enter your first and last name using letters only.";
            }
            return "";
        },
        email: function (v) {
            if (!v) return "Email is required.";
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
                return "Enter a valid email address, like name@example.com.";
            }
            return "";
        },
        phone: function (v) {
            if (!v) return "Phone number is required.";
            var digits = v.replace(/[\s\-()]/g, "");
            // Accepts 0971234567, +260971234567 or 260971234567
            if (!/^(\+?260|0)\d{9}$/.test(digits)) {
                return "Enter a valid number, like 0971234567 or +260971234567.";
            }
            return "";
        },
        programme: function (v) {
            return v ? "" : "Select your degree programme.";
        },
        year: function (v) {
            return v ? "" : "Select your year of study.";
        },
        password: function (v) {
            if (!v) return "Password is required.";
            if (v.length < 8) return "Password must be at least 8 characters.";
            if (!/[a-z]/.test(v) || !/[A-Z]/.test(v) || !/\d/.test(v)) {
                return "Include an upper case letter, a lower case letter and a number.";
            }
            return "";
        },
        confirmPassword: function (v) {
            if (!v) return "Confirm your password.";
            if (v !== document.getElementById("password").value) {
                return "Passwords do not match.";
            }
            return "";
        }
    };

    function getValue(id) {
        var el = document.getElementById(id);
        // Passwords keep their spaces; everything else is trimmed.
        return el.type === "password" ? el.value : el.value.trim();
    }

    function validateField(id) {
        var el = document.getElementById(id);
        var errorEl = document.getElementById(id + "Error");
        var field = el.closest(".field");
        var error = rules[id](getValue(id));

        errorEl.textContent = error;
        field.classList.toggle("invalid", error !== "");
        field.classList.toggle("valid", error === "");
        el.setAttribute("aria-invalid", error !== "" ? "true" : "false");
        if (error) {
            el.setAttribute("aria-describedby", id + "Error");
        } else {
            el.removeAttribute("aria-describedby");
        }
        return error === "";
    }

    var fieldIds = Object.keys(rules);

    // Validate a field once the user leaves it, then re-check as they type.
    fieldIds.forEach(function (id) {
        var el = document.getElementById(id);
        var touched = false;

        el.addEventListener("blur", function () {
            touched = true;
            validateField(id);
        });

        var live = el.tagName === "SELECT" ? "change" : "input";
        el.addEventListener(live, function () {
            if (touched || el.closest(".field").classList.contains("invalid")) {
                validateField(id);
            }
            // Keep the confirmation in step when the password changes.
            if (id === "password") {
                var confirm = document.getElementById("confirmPassword");
                if (confirm.value) validateField("confirmPassword");
            }
        });
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        messageBox.className = "";
        messageBox.textContent = "";

        var firstInvalid = null;
        fieldIds.forEach(function (id) {
            if (!validateField(id) && !firstInvalid) {
                firstInvalid = document.getElementById(id);
            }
        });

        if (firstInvalid) {
            firstInvalid.focus();
            return;
        }
        
        // 1. Get the student's full name
        var fullName = getValue("fullName");
        
        // 2. Extract just the first name (optional, but looks nicer)
        var firstName = fullName.split(" ")[0];

        // 3. Save the name in sessionStorage so the portal can read it
        sessionStorage.setItem("studentName", firstName);

        window.location.href = "Portal.html";  // pointing to the portal after registration is done
        
        var name = getValue("fullName").split(/\s+/)[0];
        messageBox.className = "success";
        messageBox.textContent =
            "Thank you, " + name + ". Your registration has been submitted.";

        
        form.reset();
        fieldIds.forEach(function (id) {
            var el = document.getElementById(id);
            var field = el.closest(".field");
            field.classList.remove("valid", "invalid");
            el.removeAttribute("aria-invalid");
        });
    });
})();
