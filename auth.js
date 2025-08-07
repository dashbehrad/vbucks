// اطلاعات پروژه Supabase خود را اینجا قرار دهید
const SUPABASE_URL = 'https://tcamhroyhkmktogtvyoy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjYW1ocm95aGtta3RvZ3R2eW95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzUwODksImV4cCI6MjA3MDE1MTA4OX0.TVc2ijRRIEMv4s-eO5XG_IGXuCq5v_sRc7s3yDhLYd0';

// یک کلاینت Supabase بسازید
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const messageElement = document.getElementById('form-message');

    if (signupForm) {
        signupForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // جلوگیری از رفرش شدن صفحه

            // گرفتن مقادیر از فرم
            const fullname = signupForm.querySelector('#fullname').value;
            const email = signupForm.querySelector('#email').value;
            const password = signupForm.querySelector('#password').value;

            messageElement.textContent = 'در حال ثبت نام...';
            messageElement.style.color = '#ccc';

            // استفاده از تابع ثبت نام Supabase
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    // اطلاعات اضافی که می‌خواهیم ذخیره کنیم
                    data: {
                        full_name: fullname
                    }
                }
            });

            if (error) {
                // اگر خطایی رخ داد
                console.error('Error signing up:', error.message);
                messageElement.textContent = 'خطا در ثبت نام: ' + error.message;
                messageElement.style.color = '#f44336'; // قرمز
            } else {
                // اگر ثبت نام موفق بود
                console.log('User signed up:', data.user);
                messageElement.textContent = 'ثبت نام با موفقیت انجام شد! یک ایمیل تایید برای شما ارسال شد.';
                messageElement.style.color = '#4CAF50'; // سبز

                // (اختیاری) می‌توانید اطلاعات کاربر را در جدول users خودتان هم ذخیره کنید
                // این کار برای زمانی خوب است که بخواهید اطلاعات بیشتری ذخیره کنید
                const { error: insertError } = await supabase
                    .from('users')
                    .insert([{ id: data.user.id, fullname: fullname }]);

                if (insertError) {
                    console.error('Error inserting user data:', insertError.message);
                }

                setTimeout(() => {
                    window.location.href = 'login.html'; // هدایت به صفحه ورود
                }, 3000);
            }
        });
    }
});