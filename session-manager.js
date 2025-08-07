// فایل: session-manager.js (نسخه نهایی و کامل)

const SM_SUPABASE_URL = 'آدرس_URL_پروژه_شما_در_SUPABASE';
const SM_SUPABASE_ANON_KEY = 'کلید_ANON_PUBLIC_شما_در_SUPABASE';

const sm_supabase = window.supabase.createClient(SM_SUPABASE_URL, SM_SUPABASE_ANON_KEY);

// --- تابع برای به‌روزرسانی UI بر اساس وضعیت ورود ---
function updateUI(user) {
    const loggedInElements = document.querySelectorAll('.logged-in');
    const loggedOutElements = document.querySelectorAll('.logged-out');
    const welcomeMessageElement = document.getElementById('welcome-message');

    if (user) {
        // کاربر وارد شده است
        loggedInElements.forEach(el => {
            el.style.display = el.tagName === 'NAV' ? 'flex' : 'block';
        });
        loggedOutElements.forEach(el => el.style.display = 'none');

        // نمایش پیام خوش‌آمدگویی در صفحه اصلی
        if (welcomeMessageElement) {
            const userName = user.user_metadata.full_name || 'کاربر عزیز';
            welcomeMessageElement.innerHTML = `خوش آمدید، <strong>${userName}</strong>! برای مشاهده سفارش‌ها به پروفایل خود بروید.`;
        }

    } else {
        // کاربر خارج شده است
        loggedInElements.forEach(el => el.style.display = 'none');
        loggedOutElements.forEach(el => {
            el.style.display = el.tagName === 'NAV' ? 'flex' : 'block';
        });
    }
}

// --- تابع برای خروج ---
async function handleLogout() {
    await sm_supabase.auth.signOut();
    localStorage.removeItem('session_expiry');
    window.location.href = 'index.html';
}

// --- رویداد اصلی برای چک کردن وضعیت کاربر ---
sm_supabase.auth.onAuthStateChange((event, session) => {
    const expiryTimestamp = localStorage.getItem('session_expiry');
    if (expiryTimestamp && Date.now() > parseInt(expiryTimestamp)) {
        sm_supabase.auth.signOut();
        localStorage.removeItem('session_expiry');
        updateUI(null);
        return;
    }
    updateUI(session ? session.user : null);
});

// --- اتصال دکمه خروج به تابع ---
document.addEventListener('DOMContentLoaded', () => {
    const logoutButtons = document.querySelectorAll('.btn-logout');
    logoutButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); // جلوگیری از رفرش شدن صفحه قبل از خروج
            handleLogout();
        });
    });
});
