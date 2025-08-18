# Розгортання Web App

## 🚀 Швидкий старт

### Вимоги
- HTTPS протокол (обов'язково для Telegram Web Apps)
- Веб-сервер з підтримкою статичних файлів
- Домен або субдомен

## 📦 Платформи для розгортання

### 1. Netlify (Рекомендовано)

**Переваги:** Безкоштовний, автоматичне HTTPS, швидке розгортання

#### Кроки:
1. **Завантажте файли на GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/username/tyres-calculator.git
   git push -u origin main
   ```

2. **Підключіть до Netlify:**
   - Відкрийте [netlify.com](https://netlify.com)
   - Натисніть "New site from Git"
   - Виберіть GitHub і ваш репозиторій
   - Налаштування за замовчуванням підходять

3. **Отримайте URL:**
   - `https://your-app-name.netlify.app`
   - Або налаштуйте власний домен

#### Налаштування:
```toml
# netlify.toml
[build]
  publish = "."
  command = ""

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "ALLOWALL"
    Content-Security-Policy = "frame-ancestors 'self' https://web.telegram.org"
```

### 2. Vercel

**Переваги:** Швидке розгортання, автоматичні оновлення

#### Кроки:
1. **Встановіть Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Розгорніть проект:**
   ```bash
   vercel
   ```

3. **Налаштування:**
   ```json
   // vercel.json
   {
     "headers": [
       {
         "source": "/(.*)",
         "headers": [
           {
             "key": "X-Frame-Options",
             "value": "ALLOWALL"
           },
           {
             "key": "Content-Security-Policy",
             "value": "frame-ancestors 'self' https://web.telegram.org"
           }
         ]
       }
     ]
   }
   ```

### 3. GitHub Pages

**Переваги:** Безкоштовний, інтеграція з Git

#### Кроки:
1. **Створіть репозиторій:**
   - Назва: `username.github.io` (для особистого сайту)
   - Або будь-яка назва для проекту

2. **Завантажте файли:**
   ```bash
   git clone https://github.com/username/username.github.io.git
   cp -r * username.github.io/
   cd username.github.io
   git add .
   git commit -m "Add tyres calculator"
   git push
   ```

3. **Налаштування:**
   - Відкрийте Settings → Pages
   - Source: Deploy from a branch
   - Branch: main
   - Folder: / (root)

### 4. Firebase Hosting

**Переваги:** Від Google, швидкий CDN

#### Кроки:
1. **Встановіть Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Ініціалізуйте проект:**
   ```bash
   firebase login
   firebase init hosting
   ```

3. **Налаштування:**
   ```json
   // firebase.json
   {
     "hosting": {
       "public": ".",
       "ignore": [
         "firebase.json",
         "**/.*",
         "**/node_modules/**"
       ],
       "headers": [
         {
           "source": "**",
           "headers": [
             {
               "key": "X-Frame-Options",
               "value": "ALLOWALL"
             },
             {
               "key": "Content-Security-Policy",
               "value": "frame-ancestors 'self' https://web.telegram.org"
             }
           ]
         }
       ]
     }
   }
   ```

4. **Розгорніть:**
   ```bash
   firebase deploy
   ```

### 5. Cloudflare Pages

**Переваги:** Швидкий CDN, безкоштовний

#### Кроки:
1. **Підключіть GitHub репозиторій**
2. **Налаштування:**
   - Build command: (залиште порожнім)
   - Build output directory: `.`
   - Root directory: `/`

3. **Додайте заголовки:**
   ```toml
   # _headers
   /*
     X-Frame-Options: ALLOWALL
     Content-Security-Policy: frame-ancestors 'self' https://web.telegram.org
   ```

## 🔧 Налаштування домену

### Власний домен

1. **Купіть домен** (Namecheap, GoDaddy, тощо)
2. **Налаштуйте DNS:**
   ```
   Type: CNAME
   Name: @
   Value: your-app.netlify.app
   ```

3. **Додайте домен в панелі хостингу**

### Субдомен

```
Type: CNAME
Name: tyres
Value: your-app.netlify.app
```

Результат: `https://tyres.yourdomain.com`

## 🔒 Безпека

### Обов'язкові заголовки

```http
X-Frame-Options: ALLOWALL
Content-Security-Policy: frame-ancestors 'self' https://web.telegram.org
```

### Додаткові заголовки

```http
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

### .htaccess (Apache)

```apache
Header always set X-Frame-Options "ALLOWALL"
Header always set Content-Security-Policy "frame-ancestors 'self' https://web.telegram.org"
Header always set X-Content-Type-Options "nosniff"
Header always set X-XSS-Protection "1; mode=block"
```

## 📱 Тестування

### Локальне тестування

```bash
# Python
python -m http.server 8000

# Node.js
npx serve .

# PHP
php -S localhost:8000
```

### Тестування в Telegram

1. **Створіть тестового бота**
2. **Налаштуйте Web App з локальним URL**
3. **Протестуйте функціональність**

### Чек-лист тестування

- [ ] Додаток відкривається в Telegram
- [ ] Всі функції працюють коректно
- [ ] Адаптивність на різних пристроях
- [ ] Темна тема працює
- [ ] Haptic feedback працює
- [ ] HTTPS працює
- [ ] Швидке завантаження

## 🚀 CI/CD

### GitHub Actions (Netlify)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Netlify

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v1.2
      with:
        publish-dir: '.'
        production-branch: main
        github-token: ${{ secrets.GITHUB_TOKEN }}
        deploy-message: "Deploy from GitHub Actions"
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

### Vercel (автоматично)

Vercel автоматично розгортає при кожному push до main гілки.

## 📊 Моніторинг

### Google Analytics

```html
<!-- Додайте в head -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Telegram Analytics

```javascript
// В calculator.js
if (tg && tg.sendData) {
  tg.sendData(JSON.stringify({
    action: 'calculation',
    tire1: tire1Input,
    tire2: tire2Input
  }));
}
```

## 🔄 Оновлення

### Автоматичні оновлення

1. **Зробіть зміни в коді**
2. **Commit і push до GitHub**
3. **Платформа автоматично розгорне оновлення**

### Ручні оновлення

```bash
# Netlify
netlify deploy --prod

# Vercel
vercel --prod

# Firebase
firebase deploy
```

## 🆘 Вирішення проблем

### Проблема: Додаток не відкривається в Telegram

**Рішення:**
- Перевірте HTTPS
- Перевірте заголовки X-Frame-Options
- Перевірте URL в налаштуваннях бота

### Проблема: Повільне завантаження

**Рішення:**
- Оптимізуйте зображення
- Мінімізуйте CSS/JS
- Використовуйте CDN

### Проблема: Не працює темна тема

**Рішення:**
- Перевірте CSS змінні
- Перевірте Telegram Web App API
- Перевірте підтримку браузера

## 📞 Підтримка

- **Документація:** [Telegram Web Apps](https://core.telegram.org/bots/webapps)
- **Сообщество:** [Telegram Developers](https://t.me/TelegramDevelopers)
- **GitHub Issues:** Створіть issue в репозиторії

---

**Успішного розгортання! 🚀**
