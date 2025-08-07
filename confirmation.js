// فایل: confirmation.js

// اطلاعات پروژه Supabase خود را اینجا قرار دهید
const CONFIRM_SUPABASE_URL = 'https://tcamhroyhkmktogtvyoy.supabase.co';
const CONFIRM_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjYW1ocm95aGtta3RvZ3R2eW95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzUwODksImV4cCI6MjA3MDE1MTA4OX0.TVc2ijRRIEMv4s-eO5XG_IGXuCq5v_sRc7s3yDhLYd0';

const supabase = window.supabase.createClient(CONFIRM_SUPABASE_URL, CONFIRM_SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', () => {
    const messageElement = document.getElementById('confirmation-message');
    const detailsElement = document.getElementById('confirmation-details');

    // onAuthStateChange زمانی اجرا می‌شود که وضعیت ورود کاربر تغییر کند.
    // وقتی کاربر روی لینک تایید کلیک می‌کند، Supabase به صورت خودکار او را لاگین می‌کند
    // و این رویداد با event 'SIGNED_IN' اجرا می‌شود.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session) {
            // تایید با موفقیت انجام شد
            messageElement.textContent = 'ایمیل شما با موفقیت تایید شد!';
            messageElement.style.color = '#4CAF50'; // سبز
            detailsElement.textContent = 'عالی! حالا شما یک کاربر تایید شده هستید. در حال هدایت شما...';

            // پس از چند ثانیه، کاربر را به صفحه پروفایل هدایت کن
            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 3000); // 3 ثانیه تاخیر

            // دیگر نیازی به گوش دادن به تغییرات نیست
            subscription.unsubscribe();
        }
    });
});