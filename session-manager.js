// فایل: session-manager.js

// اطلاعات پروژه را دوباره اینجا قرار دهید
const SM_SUPABASE_URL = 'آدرس_URL_پروژه_شما_در_SUPABASE';
const SM_SUPABASE_ANON_KEY = 'کلید_ANON_PUBLIC_شما_در_SUPABASE';

const sm_supabase = window.supabase.createClient(SM_SUPABASE_URL, SM_SUPABASE_ANON_KEY);

// --- تابع برای به‌روزرسانی UI بر اساس وضعیت ورود ---
function updateUI(user) {
    const loggedInElements = document.querySelectorAll('.logged-in');
    const loggedOutElements = document.querySelectorAll('.logged-out');

    if (user) {
        // کاربر وارد شده است
        loggedInElements.forEach(el => el.style.display = 'flex');
        loggedOutElements.forEach(el => el.style.display = 'none');
    } else {
        // کاربر خارج شده است
        loggedInElements.forEach(el => el.style.display = 'none');
        loggedOutElements.forEach(el => el.style.display = 'flex');
    }
}

// --- تابع برای خروج ---
async function handleLogout() {
    await sm_supabase.auth.signOut();
    localStorage.removeItem('session_expiry'); // پاک کردن مُهر زمانی
    window.location.href = 'index.html'; // هدایت به صفحه اصلی
}

// --- رویداد اصلی برای چک کردن وضعیت کاربر ---
sm_supabase.auth.onAuthStateChange((event, session) => {
    // 1. بررسی انقضای جلسه سفارشی ما
    const expiryTimestamp = localStorage.getItem('session_expiry');
    if (expiryTimestamp && Date.now() > parseInt(expiryTimestamp)) {
        // جلسه منقضی شده، کاربر را خارج کن
        sm_supabase.auth.signOut();
        localStorage.removeItem('session_expiry');
        updateUI(null); // UI را برای حالت خروج به‌روز کن
        return;
    }

    // 2. به‌روزرسانی UI بر اساس جلسه Supabase
    updateUI(session ? session.user : null);
});

// --- اتصال دکمه خروج به تابع ---
document.addEventListener('DOMContentLoaded', () => {
    const logoutButtons = document.querySelectorAll('.btn-logout');
    logoutButtons.forEach(button => {
        button.addEventListener('click', handleLogout);
    });
});