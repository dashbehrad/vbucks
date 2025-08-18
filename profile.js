const PROFILE_SUPABASE_URL = 'https://tcamhroyhkmktogtvyoy.supabase.co';
const PROFILE_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjYW1ocm95aGtta3RvZ3R2eW95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzUwODksImV4cCI6MjA3MDE1MTA4OX0.TVc2ijRRIEMv4s-eO5XG_IGXuCq5v_sRc7s3yDhLYd0';

const supabase = window.supabase.createClient(PROFILE_SUPABASE_URL, PROFILE_SUPABASE_ANON_KEY);

let currentUser = null;

// --- تابع برای آپلود آواتار (بدون تغییر) ---
async function uploadAvatar(event) {
    const fileInput = event.target;
    const file = fileInput.files[0];
    const messageElement = document.getElementById('profile-message');
    if (!file) return;
    if (!currentUser) {
        messageElement.textContent = 'خطا: کاربر شناسایی نشد.';
        messageElement.style.color = '#f44336';
        return;
    }
    messageElement.textContent = 'در حال آپلود عکس...';
    messageElement.style.color = '#ccc';
    const fileExt = file.name.split('.').pop();
    const filePath = `${currentUser.id}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
    if (uploadError) {
        console.error('Error uploading avatar:', uploadError);
        messageElement.textContent = 'خطا در آپلود عکس.';
        messageElement.style.color = '#f44336';
        return;
    }
    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    const publicUrl = data.publicUrl;
    const { error: updateUserError } = await supabase.auth.updateUser({ data: { avatar_url: publicUrl } });
    if (updateUserError) {
        console.error('Error updating user metadata:', updateUserError);
        messageElement.textContent = 'خطا در ذخیره آدرس عکس.';
        messageElement.style.color = '#f44336';
    } else {
        document.getElementById('profile-image').src = publicUrl;
        messageElement.textContent = 'عکس پروفایل با موفقیت به‌روز شد!';
        messageElement.style.color = '#4CAF50';
    }
}

// --- تابع برای مدیریت فرم پروفایل (بخش جدید و مهم) ---
async function handleProfileUpdate(event) {
    event.preventDefault(); // جلوگیری از رفرش شدن صفحه
    const messageElement = document.getElementById('profile-message');
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const currentPassword = document.getElementById('current-password').value;

    // --- منطق تغییر رمز عبور ---
    // فقط در صورتی ادامه بده که کاربر رمز جدیدی وارد کرده باشد
    if (newPassword) {
        // ۱. بررسی اینکه آیا رمز فعلی وارد شده است (برای امنیت UI)
        if (!currentPassword) {
            messageElement.textContent = 'برای تغییر رمز، باید رمز عبور فعلی خود را وارد کنید.';
            messageElement.style.color = '#f44336';
            return;
        }

        // ۲. بررسی اینکه آیا دو فیلد رمز جدید با هم مطابقت دارند
        if (newPassword !== confirmPassword) {
            messageElement.textContent = 'رمزهای عبور جدید با یکدیگر مطابقت ندارند.';
            messageElement.style.color = '#f44336';
            return;
        }

        // ۳. بررسی طول رمز جدید (حداقل ۶ کاراکتر طبق پیش‌فرض Supabase)
        if (newPassword.length < 6) {
            messageElement.textContent = 'رمز عبور جدید باید حداقل ۶ کاراکتر باشد.';
            messageElement.style.color = '#f44336';
            return;
        }

        messageElement.textContent = 'در حال به‌روزرسانی رمز عبور...';
        messageElement.style.color = '#ccc';

        // ۴. ارسال درخواست تغییر رمز به Supabase
        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (error) {
            console.error('Error updating password:', error);
            // یک پیام خطای عمومی‌تر نمایش می‌دهیم چون ممکن است رمز فعلی اشتباه باشد
            messageElement.textContent = 'خطا در تغییر رمز عبور. لطفاً دوباره تلاش کنید.';
            messageElement.style.color = '#f44336';
        } else {
            messageElement.textContent = 'رمز عبور شما با موفقیت تغییر کرد!';
            messageElement.style.color = '#4CAF50';
            // پاک کردن فیلدهای رمز عبور پس از موفقیت
            document.getElementById('current-password').value = '';
            document.getElementById('new-password').value = '';
            document.getElementById('confirm-password').value = '';
        }
    } else {
        // اگر کاربر رمز جدیدی وارد نکرده بود، فقط یک پیام کلی نمایش بده
        messageElement.textContent = 'تغییری برای ذخیره وجود ندارد.';
        messageElement.style.color = '#ccc';
    }
}


// --- تابع اصلی که هنگام بارگذاری صفحه اجرا می‌شود ---
document.addEventListener('DOMContentLoaded', async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) {
        window.location.href = 'login.html';
        return;
    }
    currentUser = session.user;

    // قرار دادن اطلاعات اولیه در صفحه
    document.getElementById('profile-welcome-name').textContent = `خوش آمدید، ${currentUser.user_metadata.full_name || 'کاربر عزیز'}!`;
    document.getElementById('email').value = currentUser.email;
    if (currentUser.user_metadata.avatar_url) {
        document.getElementById('profile-image').src = currentUser.user_metadata.avatar_url;
    }

    // اتصال رویدادها به المان‌ها
    document.getElementById('profile-pic-upload').addEventListener('change', uploadAvatar);
    document.getElementById('profile-form').addEventListener('submit', handleProfileUpdate);
});
