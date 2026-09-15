// =========================
// SIGNUP
// =========================

const signupForm = document.getElementById('signupForm');

if (signupForm) {

    signupForm.addEventListener('submit', async (event) => {

        event.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword =
            document.getElementById('confirmPassword').value;

        const message = document.getElementById('signupMessage');

        try {

            const response = await fetch('/api/auth/signup', {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    name,
                    email,
                    password,
                    confirmPassword
                })
            });

            const data = await response.json();

            message.textContent = data.message;

            if (data.success) {

                message.style.color = 'green';

                signupForm.reset();

                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);

            } else {

                message.style.color = 'red';
            }

        } catch (error) {

            console.error(error);

            message.textContent =
                'Unable to connect to the server';

            message.style.color = 'red';
        }
    });
}


// =========================
// LOGIN
// =========================

const loginForm = document.getElementById('loginForm');

if (loginForm) {

    loginForm.addEventListener('submit', async (event) => {

        event.preventDefault();

        const email =
            document.getElementById('loginEmail').value.trim();

        const password =
            document.getElementById('loginPassword').value;

        const message =
            document.getElementById('loginMessage');

        try {

            const response = await fetch('/api/auth/login', {

                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();

            message.textContent = data.message;

            if (data.success) {

                message.style.color = 'green';

                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);

            } else {

                message.style.color = 'red';
            }

        } catch (error) {

            console.error(error);

            message.textContent =
                'Unable to connect to the server';

            message.style.color = 'red';
        }
    });
}


// =========================
// DASHBOARD
// =========================

const userInfo = document.getElementById('userInfo');

if (userInfo) {

    fetch('/api/auth/me')
        .then(async (response) => {

            const data = await response.json();

            if (!response.ok || !data.success) {

                window.location.href = 'login.html';

                return;
            }

            userInfo.innerHTML = `
                <strong>Name:</strong> ${data.user.name}<br>
                <strong>Email:</strong> ${data.user.email}<br>
                <strong>User ID:</strong> ${data.user.id}
            `;
        })

        .catch((error) => {

            console.error(error);

            window.location.href = 'login.html';
        });
}


// =========================
// LOGOUT
// =========================

const logoutBtn = document.getElementById('logoutBtn');

if (logoutBtn) {

    logoutBtn.addEventListener('click', async () => {

        try {

            const response = await fetch('/api/auth/logout', {
                method: 'POST'
            });

            const data = await response.json();

            if (data.success) {
                window.location.href = 'login.html';
            }

        } catch (error) {

            console.error(error);

            alert('Logout failed');
        }
    });
}
// =========================
// FORGOT PASSWORD
// =========================

const forgotPasswordForm =
    document.getElementById('forgotPasswordForm');

if (forgotPasswordForm) {

    forgotPasswordForm.addEventListener('submit', async (event) => {

        event.preventDefault();

        const email =
            document.getElementById('forgotEmail').value.trim();

        const message =
            document.getElementById('forgotMessage');

        try {

            const response = await fetch('/api/auth/forgot-password', {

                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    email
                })
            });

            const data = await response.json();

            message.textContent = data.message;

            if (data.success) {

                message.style.color = 'green';

                // Show reset link during development
                if (data.resetLink) {

                    message.innerHTML = `
                        ${data.message}<br><br>
                        <a href="${data.resetLink}">
                            Click here to reset your password
                        </a>
                    `;
                }

            } else {

                message.style.color = 'red';
            }

        } catch (error) {

            console.error(error);

            message.textContent =
                'Unable to connect to the server';

            message.style.color = 'red';
        }
    });
}
// =========================
// RESET PASSWORD
// =========================

const resetPasswordForm =
    document.getElementById('resetPasswordForm');

if (resetPasswordForm) {

    resetPasswordForm.addEventListener('submit', async (event) => {

        event.preventDefault();

        const newPassword =
            document.getElementById('newPassword').value;

        const confirmNewPassword =
            document.getElementById('confirmNewPassword').value;

        const message =
            document.getElementById('resetMessage');

        // Get token from URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (!token) {
            message.textContent =
                'Invalid reset link';

            message.style.color = 'red';

            return;
        }

        try {

            const response = await fetch('/api/auth/reset-password', {

                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    token: token,
                    password: newPassword,
                    confirmPassword: confirmNewPassword
                })
            });

            const data = await response.json();

            message.textContent = data.message;

            if (data.success) {

                message.style.color = 'green';

                resetPasswordForm.reset();

                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);

            } else {

                message.style.color = 'red';
            }

        } catch (error) {

            console.error(error);

            message.textContent =
                'Unable to connect to the server';

            message.style.color = 'red';
        }
    });
}