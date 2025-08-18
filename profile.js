// فایل: profile.js (نسخه نهایی با قابلیت آپلود آواتار)

const PROFILE_SUPABASE_URL = 'https://tcamhroyhkmktogtvyoy.supabase.co';
const PROFILE_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjYW1ocm95aGtta3RvZ3R2eW95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzUwODksImV4cCI6MjA3MDE1MTA4OX0.TVc2ijRRIEMv4s-eO5XG_IGXuCq5v_sRc7s3yDhLYd0';

const supabase = window.supabase.createClient(PROFILE_SUPABASE_URL, PROFILE_SUPABASE_ANON_KEY);

let currentUser = null;

// --- تابع برای آپلود آواتار ---
async function uploadAvatar(event) {
    const fileInput = event.target;
    const file = fileInput.files[0];
    const messageElement = document.getElementById('profile-message');

    if (!file) {
        return; // اگر فایلی انتخاب نشده بود، کاری نکن
    }

    if (!currentUser) {
        messageElement.textContent = 'خطا: کاربر شناسایی نشد.';
        messageElement.style.color = '#f44336';
        return;
    }

    messageElement.textContent = 'در حال آپلود عکس...';
    messageElement.style.color = '#ccc';

    // نام فایل را بر اساس ID کاربر + یک عدد تصادفی برای جلوگیری از کش شدن می‌سازیم
    const fileExt = file.name.split('.').pop();
    const filePath = `${currentUser.id}.${fileExt}`;

    // آپلود فایل در سطل 'avatars'
    // upsert: true یعنی اگر فایلی با این نام وجود داشت، آن را بازنویسی کن
    const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

    if (uploadError) {
        console.error('Error uploading avatar:', uploadError);
        messageElement.textContent = 'خطا در آپلود عکس.';
        messageElement.style.color = '#f44336';
        return;
    }

    // دریافت آدرس عمومی فایل آپلود شده
    const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

    const publicUrl = data.publicUrl;

    // آپدیت متادیتای کاربر با آدرس عکس جدید
    const { error: updateUserError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
    });

    if (updateUserError) {
        console.error('Error updating user metadata:', updateUserError);
        messageElement.textContent = 'خطا در ذخیره آدرس عکس.';
        messageElement.style.color = '#f44336';
    } else {
        // نمایش عکس جدید در صفحه
        document.getElementById('profile-image').src = publicUrl;
        messageElement.textContent = 'عکس پروفایل با موفقیت به‌روز شد!';
        messageElement.style.color = '#4CAF50';
    }
}


// --- تابع اصلی که هنگام بارگذاری صفحه اجرا می‌شود ---
document.addEventListener('DOMContentLoaded', async () => {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
        console.error('Error getting session:', error.message);
        return;
    }

    if (!session) {
        window.location.href = 'login.html';
        return;
    }

    currentUser = session.user; // ذخیره اطلاعات کاربر فعلی

    // قرار دادن اطلاعات در صفحه
    const profileWelcomeName = document.getElementById('profile-welcome-name');
    const emailInput = document.getElementById('email');
    const profileImage = document.getElementById('profile-image');
    const fileInput = document.getElementById('profile-pic-upload');

    if (profileWelcomeName) {
        profileWelcomeName.textContent = `خوش آمدید، ${currentUser.user_metadata.full_name || 'کاربر عزیز'}!`;
    }

    if (emailInput) {
        emailInput.value = currentUser.email;
    }

    // اگر کاربر عکس پروفایل داشت، آن را نمایش بده
    if (currentUser.user_metadata.avatar_url) {
        profileImage.src = currentUser.user_metadata.avatar_url;
    }

    // اتصال رویداد به دکمه انتخاب فایل
    if (fileInput) {
        fileInput.addEventListener('change', uploadAvatar);
    }
});
