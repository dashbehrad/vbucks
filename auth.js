// اطلاعات پروژه Supabase خود را اینجا قرار دهید
const SUPABASE_URL = 'https://tcamhroyhkmktogtvyoy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjYW1ocm95aGtta3RvZ3R2eW95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzUwODksImV4cCI6MjA3MDE1MTA4OX0.TVc2ijRRIEMv4s-eO5XG_IGXuCq5v_sRc7s3yDhLYd0';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- تابع برای مدیریت ورود و ثبت نام ---
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
        messageElement.textContent = 'موفقیت! در حال هدایت شما...';
        messageElement.style.color = '#4CAF50';

        // مدیریت جلسه بر اساس "مرا به خاطر بسپار"
        if (rememberMe) {
            // اگر تیک خورده بود، هرگونه مُهر زمانی قبلی را پاک کن
            localStorage.removeItem('session_expiry');
        } else {
            // اگر تیک نخورده بود، یک مُهر زمانی برای 24 ساعت بعد تنظیم کن
            const oneDay = 24 * 60 * 60 * 1000;
            const expiryTimestamp = Date.now() + oneDay;
            localStorage.setItem('session_expiry', expiryTimestamp);
        }

        setTimeout(() => {
            window.location.href = 'profile.html'; // هدایت به صفحه پروفایل
        }, 1500);
    }
}

// --- اتصال به فرم‌ها ---
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
