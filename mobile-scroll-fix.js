// Исправление проблем со скроллом на iOS для мобильной формы
document.addEventListener('DOMContentLoaded', function() {
    const mobileForm = document.querySelector('.new-catalogForm');
    
    if (mobileForm) {
        // Функция для принудительного обновления скролла
        function refreshScroll(element) {
            const scrollTop = element.scrollTop;
            element.scrollTop = scrollTop + 1;
            element.scrollTop = scrollTop;
        }
        
        // Обработчики для предотвращения конфликтов touch-событий
        mobileForm.addEventListener('touchstart', function(e) {
            // Не блокируем touchstart
            e.stopPropagation();
        }, { passive: true });
        
        mobileForm.addEventListener('touchmove', function(e) {
            // Разрешаем скролл внутри элемента
            e.stopPropagation();
            // Обновляем скролл при каждом движении
            refreshScroll(this);
        }, { passive: false });
        
        mobileForm.addEventListener('touchend', function(e) {
            // Не блокируем touchend
            e.stopPropagation();
        }, { passive: true });
        
        // Обработчик для обновления скролла при активации модалки
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (mobileForm.classList.contains('mobile_visible')) {
                        // При открытии модалки обновляем скролл
                        setTimeout(() => {
                            refreshScroll(mobileForm);
                        }, 100);
                    }
                }
            });
        });
        
        observer.observe(mobileForm, {
            attributes: true,
            attributeFilter: ['class']
        });
        
        // Обработчик для предотвращения скролла body при открытой модалке
        function preventBodyScroll(e) {
            if (mobileForm.classList.contains('mobile_visible')) {
                e.preventDefault();
            }
        }
        
        // Добавляем обработчик для body
        document.body.addEventListener('touchmove', preventBodyScroll, { passive: false });
        
        // Удаляем обработчик при закрытии модалки
        const closeButtons = document.querySelectorAll('.new-catalogForm__mobile-header__close, .new-catalogForm__filter__mobile-header__close');
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                setTimeout(() => {
                    if (!mobileForm.classList.contains('mobile_visible')) {
                        document.body.removeEventListener('touchmove', preventBodyScroll);
                    }
                }, 100);
            });
        });
    }
    
    // Дополнительная обработка для select_wrapper
    const selectWrappers = document.querySelectorAll('.select_wrapper');
    selectWrappers.forEach(wrapper => {
        wrapper.addEventListener('touchstart', function(e) {
            e.stopPropagation();
        }, { passive: true });
        
        wrapper.addEventListener('touchmove', function(e) {
            e.stopPropagation();
        }, { passive: false });
        
        wrapper.addEventListener('touchend', function(e) {
            e.stopPropagation();
        }, { passive: true });
    });
});

// Функция для открытия мобильной формы
function openMobileForm() {
    const body = document.body;
    const mobileForm = document.querySelector('.new-catalogForm');
    
    if (mobileForm) {
        // Показываем модалку
        mobileForm.classList.add('mobile_visible');
        
        // Фокусируемся на модалке
        mobileForm.focus();
        
        // Обновляем скролл
        setTimeout(() => {
            const scrollTop = mobileForm.scrollTop;
            mobileForm.scrollTop = scrollTop + 1;
            mobileForm.scrollTop = scrollTop;
        }, 100);
    }
}

// Функция для закрытия мобильной формы
function closeMobileForm() {
    const body = document.body;
    const mobileForm = document.querySelector('.new-catalogForm');
    
    if (mobileForm) {
        // Скрываем модалку
        mobileForm.classList.remove('mobile_visible');
    }
} 