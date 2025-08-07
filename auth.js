// فایل: auth.js (نسخه نهایی و ساده شده)

const SUPABASE_URL = 'https://tcamhroyhkmktogtvyoy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjYW1ocm95aGtta3RvZ3R2eW95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzUwODksImV4cCI6MjA3MDE1MTA4OX0.TVc2ijRRIEMv4s-eO5XG_IGXuCq5v_sRc7s3yDhLYd0';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function handleAuth(event, authFunction) {
    event.preventDefault();
    const form = event.target;
    const messageElement = form.querySelector('#form-message');
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;
    const rememberMe = form.querySelector('#remember-me')?.checked;

    messageElement.textContent = 'در حال پردازش...';
    messageElement.style.color = '#ccc';

    const { data, error } = await authFunction({ email, password });

    if (error) {
        messageElement.textContent = 'خطا: ' + error.message;
        messageElement.style.color = '#f44336';
    } else {
        // پیام موفقیت را تغییر می‌دهیم چون دیگر ایمیلی ارسال نمی‌شود
        messageElement.textContent = 'موفقیت! در حال هدایت شما به پروفایل...';
        messageElement.style.color = '#4CAF50';

        if (rememberMe) {
            localStorage.removeItem('session_expiry');
        } else {
            const oneDay = 24 * 60 * 60 * 1000;
            const expiryTimestamp = Date.now() + oneDay;
            localStorage.setItem('session_expiry', expiryTimestamp);
        }

        setTimeout(() => {
            window.location.href = 'profile.html';
        }, 1500);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            const fullname = signupForm.querySelector('#fullname').value;
            handleAuth(e, (credentials) => supabase.auth.signUp({
                ...credentials,
                options: { data: { full_name: fullname } }
            }));
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            handleAuth(e, (credentials) => supabase.auth.signInWithPassword(credentials));
        });
    }
});