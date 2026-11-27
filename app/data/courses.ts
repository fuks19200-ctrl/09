export const programs = [
  { name: "BASIC", label: "Базовая программа", description: "Знакомство с нейросетями, составление запросов и решение повседневных задач.", price: "7 900", theme: "basis" },
  { name: "ULTRA", label: "Комплексная программа", description: "Работа с AI-инструментами в нескольких направлениях и создание собственных проектов.", price: "99 900", theme: "ultra" },
];

export const courses = [
  { name: "Создание контента", description: "Создание контента для социальных сетей", price: "14 900 ₽", code: "01", theme: "creator" },
  { name: "Дизайн и брендинг", description: "Графический дизайн и визуальные материалы", price: "14 900 ₽", code: "02", theme: "design" },
  { name: "Видео и анимация", description: "Генерация видео и анимация", price: "20 900 ₽", code: "03", theme: "video" },
  { name: "3D-графика", description: "Создание трёхмерной графики", price: "25 900 ₽", code: "04", theme: "three" },
  { name: "Создание сайтов", description: "Разработка сайтов с помощью AI", price: "49 900 ₽", code: "05", theme: "websites" },
  { name: "Разработка игр", description: "Создание игр", price: "45 900 ₽", code: "06", theme: "games" },
  { name: "ИИ-агенты", description: "Разработка AI-агентов", price: "59 900 ₽", code: "07", theme: "agents" },
  { name: "Автоматизация", description: "Автоматизация рабочих процессов", price: "59 900 ₽", code: "08", theme: "automation" },
  { name: "Маркетинг", description: "Дополнительный курс по маркетингу", price: "5 900 ₽", code: "09", theme: "marketing" },
  { name: "Создание ИИ-продуктов", description: "Дополнительный курс по созданию AI-продуктов", price: "10 900 ₽", code: "10", theme: "product" },
];

export const directions = [
  { name: "Творчество и дизайн", code: "01", theme: "creative", slug: "creative", description: "Контент, графический дизайн, видео и анимация.", modules: ["Создание контента", "Дизайн и брендинг", "Видео и анимация"] },
  { name: "Разработка", code: "02", theme: "development", slug: "development", description: "Разработка сайтов, игр и интерактивных проектов.", modules: ["Создание сайтов", "Разработка игр"] },
  { name: "3D-графика", code: "03", theme: "three", slug: "3d", description: "Создание трёхмерной графики, моделей и объектов.", modules: ["3D-графика"] },
  { name: "ИИ-системы", code: "04", theme: "systems", slug: "systems", description: "AI-агенты и автоматизация рабочих процессов.", modules: ["ИИ-агенты", "Автоматизация"] },
  { name: "Бизнес и маркетинг", code: "05", theme: "business", slug: "business", description: "Создание, продвижение и монетизация AI-продуктов.", modules: ["Маркетинг", "Создание ИИ-продуктов"] },
];

export const creativeBundle = {
  name: "Творчество и дизайн",
  theme: "creative-bundle",
  price: "38 900 ₽",
  includes: ["creator", "design", "video"],
};

export const contact = "https://t.me/multumai";



export const customProgramMin = 3;
export const customProgramDiscount = 40;
export const parseCoursePrice = (price: string) => Number(price.replace(/[^0-9]/g, ""));
export const customCoursePrice = (price: number) => Math.round(price * (100 - customProgramDiscount) / 100);
