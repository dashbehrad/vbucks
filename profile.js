// فایل: profile.js

// اطلاعات پروژه Supabase خود را اینجا قرار دهید
const PROFILE_SUPABASE_URL = 'https://tcamhroyhkmktogtvyoy.supabase.co';
const PROFILE_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjYW1ocm95aGtta3RvZ3R2eW95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzUwODksImV4cCI6MjA3MDE1MTA4OX0.TVc2ijRRIEMv4s-eO5XG_IGXuCq5v_sRc7s3yDhLYd0';

const supabase = window.supabase.createClient(PROFILE_SUPABASE_URL, PROFILE_SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', async () => {
    // دریافت اطلاعات جلسه کاربر فعلی
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
        console.error('Error getting session:', error.message);
        return;
    }

    if (!session) {
        // اگر کاربر وارد نشده بود، او را به صفحه ورود هدایت کن
        window.location.href = 'login.html';
        return;
    }

    // اگر کاربر وارد شده بود، اطلاعات را در صفحه قرار بده
    const user = session.user;
    const profileWelcomeName = document.getElementById('profile-welcome-name');
    const emailInput = document.getElementById('email');

    if (profileWelcomeName) {
        // نام کامل کاربر را از متادیتا بخوان و نمایش بده
        profileWelcomeName.textContent = `خوش آمدید، ${user.user_metadata.full_name || 'کاربر عزیز'}!`;
    }

    if (emailInput) {
        // ایمیل کاربر را در فیلد مربوطه قرار بده
        emailInput.value = user.email;
    }
});