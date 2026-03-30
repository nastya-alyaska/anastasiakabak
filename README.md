# Anastasiia Kabak

Сайт нутриціолога Анастасії Кабак.

Проєкт створений на `Vite`, `React`, `TypeScript`, `Tailwind CSS` та `shadcn/ui`.

## Робота з сайтом

Для локального запуску:

```bash
npm install
npm run dev
```

Для production-збірки:

```bash
npm run build
```

## Залежності

Основні залежності проєкту:

- `react`
- `typescript`
- `vite`
- `tailwindcss`
- `shadcn/ui`
- `@supabase/supabase-js`

Після зміни `package.json` потрібно оновити залежності командою:

```bash
npm install
```

## Робота з контентом

Сайт має адмін-панель за адресою `/admin`.

Контент і службові дані зберігаються в `Supabase`. Для роботи сайту потрібні змінні середовища:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Редагування текстів відбувається через адмін-панель і таблицю `site_content` у `Supabase`.
