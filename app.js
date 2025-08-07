// این کد زمانی اجرا می‌شود که تمام محتوای HTML صفحه به طور کامل بارگذاری شده باشد.
// این کار برای جلوگیری از خطا ضروری است، چون ما می‌خواهیم روی المان‌های HTML کار کنیم.
document.addEventListener('DOMContentLoaded', () => {

    // 1. خواندن پارامترها از URL
    // یک شیء جدید برای کار با پارامترهای URL صفحه فعلی ایجاد می‌کنیم.
    // window.location.search به بخشی از URL که با '?' شروع می‌شود، دسترسی دارد.
    // مثلاً: "?product=2,800%20ویباکس&price=۳۵۰,۰۰۰%20تومان"
    const urlParams = new URLSearchParams(window.location.search);

    // 2. استخراج مقادیر
    // با استفاده از متد .get()، مقدار هر پارامتر را بر اساس نامش استخراج می‌کنیم.
    const productName = urlParams.get('product'); // مقدار پارامتر 'product' را می‌خواند
    const productPrice = urlParams.get('price');  // مقدار پارامتر 'price' را می‌خواند

    // 3. پیدا کردن المان‌های HTML در صفحه
    // المان‌هایی که در checkout.html برای نمایش نام و قیمت محصول ساختیم را با id پیدا می‌کنیم.
    const productNameElement = document.getElementById('product-name');
    const productPriceElement = document.getElementById('product-price');

    // 4. قرار دادن مقادیر در HTML
    // بررسی می‌کنیم که آیا پارامترها و المان‌ها با موفقیت پیدا شده‌اند یا نه.
    if (productName && productPrice && productNameElement && productPriceElement) {
        // اگر همه چیز درست بود، محتوای متنی (textContent) المان‌ها را با مقادیر خوانده شده از URL جایگزین می‌کنیم.
        productNameElement.textContent = productName; // نام محصول را نمایش می‌دهد
        productPriceElement.textContent = productPrice; // قیمت محصول را نمایش می‌دهد
    } else {
        // اگر کاربر مستقیماً به صفحه checkout.html برود (بدون کلیک روی محصول)،
        // پارامترها در URL وجود نخواهند داشت. در این حالت یک پیام پیش‌فرض نمایش می‌دهیم.
        if (productNameElement) {
            productNameElement.textContent = 'محصولی انتخاب نشده است';
        }
        if (productPriceElement) {
            productPriceElement.textContent = '۰ تومان';
        }
        console.error('اطلاعات محصول در URL یافت نشد یا المان‌های نمایش در صفحه وجود ندارند.');
    }
});