// Данные роадмапа Data Science — с нуля до трудоустройства
const ROADMAP = [
  {
    id: "math",
    num: "01",
    title: "Математическая база",
    icon: "∑",
    color: "#7c5cff",
    duration: "2–3 месяца",
    level: "Новичок",
    desc: "Фундамент, без которого ML превращается в магию. Не нужно становиться математиком — нужно понимать, что происходит «под капотом» алгоритмов.",
    topics: [
      { id: "math-linalg", title: "Линейная алгебра", subs: ["Векторы и матрицы, операции", "Собственные значения и векторы", "Разложения (SVD, LU)", "Нормы и скалярное произведение"] },
      { id: "math-calc", title: "Математический анализ", subs: ["Производные и градиенты", "Частные производные, якобиан", "Оптимизация: градиентный спуск", "Интегралы (базово)"] },
      { id: "math-prob", title: "Теория вероятностей", subs: ["Случайные величины и распределения", "Условная вероятность, Байес", "Матожидание, дисперсия", "ЦПТ и закон больших чисел"] }
    ],
    resources: [
      { name: "3Blue1Brown — Essence of Linear Algebra", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab" },
      { name: "Stepik — Линейная алгебра", url: "https://stepik.org" }
    ]
  },
  {
    id: "python",
    num: "02",
    title: "Python с нуля",
    icon: "🐍",
    color: "#2dd4bf",
    duration: "2–3 месяца",
    level: "Новичок",
    desc: "Основной язык Data Science. Цель — уверенно писать чистый код и не бояться чужого.",
    topics: [
      { id: "py-basics", title: "Синтаксис и база", subs: ["Переменные, типы, циклы, условия", "Функции, lambda, *args/**kwargs", "Списки, словари, множества, генераторы", "Работа с файлами и исключениями"] },
      { id: "py-oop", title: "ООП и структура кода", subs: ["Классы, наследование, датаклассы", "Модули и пакеты", "Виртуальные окружения (venv, pip)", "Чистый код и PEP8"] },
      { id: "py-adv", title: "Продвинутый Python", subs: ["Итераторы и декораторы", "Контекстные менеджеры", "Type hints", "Основы асинхронности"] }
    ],
    resources: [
      { name: "Python-разработчик: документация", url: "https://docs.python.org/3/" },
      { name: "Практика: LeetCode / Codewars", url: "https://leetcode.com" }
    ]
  },
  {
    id: "data",
    num: "03",
    title: "Работа с данными",
    icon: "🗄️",
    color: "#f59e0b",
    duration: "1–2 месяца",
    level: "Новичок+",
    desc: "80% работы дата-сайентиста — добыть, почистить и подготовить данные.",
    topics: [
      { id: "data-sql", title: "SQL", subs: ["SELECT, WHERE, GROUP BY, HAVING", "JOIN всех видов", "Оконные функции", "Подзапросы и CTE", "Оптимизация запросов, индексы"] },
      { id: "data-np", title: "NumPy", subs: ["Массивы и векторные операции", "Индексация и срезы", "Broadcasting", "Базовая линейная алгебра в NumPy"] },
      { id: "data-pd", title: "Pandas", subs: ["DataFrame и Series", "Чтение CSV/Excel/JSON/parquet", "Группировки, pivot, merge", "Пропуски, дубликаты, выбросы", "Feature engineering"] },
      { id: "data-scrape", title: "Сбор данных", subs: ["REST API, requests", "Парсинг: BeautifulSoup", "Основы работы с Excel-отчётами"] }
    ],
    resources: [
      { name: "SQL-задачник sql-ex.ru", url: "https://sql-ex.ru" },
      { name: "Kaggle Datasets для практики", url: "https://www.kaggle.com/datasets" }
    ]
  },
  {
    id: "viz",
    num: "04",
    title: "Визуализация и EDA",
    icon: "📊",
    color: "#ec4899",
    duration: "3–4 недели",
    level: "Средний",
    desc: "Умение показать данные так, чтобы их понял и бизнес, и коллеги. Разведочный анализ — первый шаг любого проекта.",
    topics: [
      { id: "viz-mpl", title: "Matplotlib + Seaborn", subs: ["Линейные, столбчатые, scatter", "Гистограммы, boxplot, violin", "Heatmap корреляций", "Настройка стилей и подписей"] },
      { id: "viz-plotly", title: "Интерактив: Plotly", subs: ["Интерактивные графики", "Дашборды на Dash / Streamlit"] },
      { id: "viz-eda", title: "Методология EDA", subs: ["Постановка вопросов к данным", "Поиск закономерностей и аномалий", "Выводы и гипотезы по графикам"] }
    ],
    resources: [
      { name: "Seaborn gallery — примеры", url: "https://seaborn.pydata.org/examples/index.html" },
      { name: "Streamlit — дашборды за час", url: "https://streamlit.io" }
    ]
  },
  {
    id: "stats",
    num: "05",
    title: "Статистика и A/B-тесты",
    icon: "🎲",
    color: "#38bdf8",
    duration: "1–2 месяца",
    level: "Средний",
    desc: "То, что отличает аналитика от «человека с графиками». Проверка гипотез и статистическая значимость.",
    topics: [
      { id: "st-desc", title: "Описательная статистика", subs: ["Меры центра и разброса", "Квантили, асимметрия, эксцесс", "Корреляция ≠ причинность"] },
      { id: "st-inf", title: "Статистический вывод", subs: ["Доверительные интервалы", "p-value и уровни значимости", "Ошибки I и II рода", "Мощность теста и размер выборки"] },
      { id: "st-tests", title: "Тесты и A/B", subs: ["t-тест, z-тест, хи-квадрат", "Непараметрика: Манн-Уитни", "Дизайн A/B-эксперимента", "Бутстреп"] }
    ],
    resources: [
      { name: "Stepik — Основы статистики", url: "https://stepik.org/course/76" }
    ]
  },
  {
    id: "ml",
    num: "06",
    title: "Machine Learning",
    icon: "🤖",
    color: "#a3e635",
    duration: "3–4 месяца",
    level: "Продвинутый",
    desc: "Ядро профессии. Классические алгоритмы, валидация, метрики и главный рабочий инструмент — градиентный бустинг.",
    topics: [
      { id: "ml-base", title: "Основы ML", subs: ["Обучение с учителем / без учителя", "Train/valid/test, кросс-валидация", "Переобучение и регуляризация", "Метрики: accuracy, F1, ROC-AUC, RMSE"] },
      { id: "ml-lin", title: "Линейные модели", subs: ["Линейная и логистическая регрессия", "Регуляризация L1/L2", "Интерпретация коэффициентов"] },
      { id: "ml-trees", title: "Деревья и бустинг", subs: ["Деревья решений, случайный лес", "XGBoost / LightGBM / CatBoost", "Подбор гиперпараметров", "SHAP и важность признаков"] },
      { id: "ml-other", title: "Остальной зоопарк", subs: ["kNN, SVM, наивный Байес", "Кластеризация: k-means, DBSCAN", "Снижение размерности: PCA, t-SNE", "Пайплайны scikit-learn"] }
    ],
    resources: [
      { name: "Kaggle Learn — Intro to ML", url: "https://www.kaggle.com/learn" },
      { name: "ODS mlcourse.ai", url: "https://mlcourse.ai" }
    ]
  },
  {
    id: "dl",
    num: "07",
    title: "Deep Learning",
    icon: "🧠",
    color: "#fb7185",
    duration: "3–4 месяца",
    level: "Продвинутый",
    desc: "Нейросети: от перцептрона до трансформеров. Выбирайте направление — NLP, CV или табличные данные.",
    topics: [
      { id: "dl-base", title: "Основы нейросетей", subs: ["Перцептрон, функции активации", "Backpropagation и оптимизаторы", "PyTorch: тензоры и autograd", "Dropout, BatchNorm, lr-schedule"] },
      { id: "dl-cv", title: "Computer Vision", subs: ["Сверточные сети (CNN)", "Transfer learning, аугментации", "Детекция и сегментация (обзор)"] },
      { id: "dl-nlp", title: "NLP и трансформеры", subs: ["Эмбеддинги: word2vec", "Attention и Transformer", "Hugging Face: fine-tuning", "Основы LLM и промпт-инжиниринг"] }
    ],
    resources: [
      { name: "PyTorch Tutorials", url: "https://pytorch.org/tutorials/" },
      { name: "Hugging Face Course", url: "https://huggingface.co/learn" }
    ]
  },
  {
    id: "mlops",
    num: "08",
    title: "MLOps и продакшен",
    icon: "🚀",
    color: "#f97316",
    duration: "1–2 месяца",
    level: "Профи",
    desc: "Модель в ноутбуке не приносит денег. Учимся доводить решения до продакшена.",
    topics: [
      { id: "ops-git", title: "Инженерная база", subs: ["Git и GitHub уверенно", "Docker: контейнеризация", "Основы Linux и bash"] },
      { id: "ops-deploy", title: "Деплой моделей", subs: ["REST API на FastAPI", "Streamlit/Gradio демо", "Основы облаков (Yandex Cloud / AWS)"] },
      { id: "ops-track", title: "Воспроизводимость", subs: ["MLflow / Weights & Biases", "DVC — версионирование данных", "Мониторинг дрейфа модели"] }
    ],
    resources: [
      { name: "FastAPI — документация", url: "https://fastapi.tiangolo.com" },
      { name: "Made With ML (MLOps курс)", url: "https://madewithml.com" }
    ]
  },
  {
    id: "career",
    num: "09",
    title: "Портфолио и карьера",
    icon: "🎯",
    color: "#eab308",
    duration: "постоянно",
    level: "Финал",
    desc: "Знания без доказательств не работают. Собираем портфолио и выходим на рынок.",
    topics: [
      { id: "car-pet", title: "Пет-проекты", subs: ["3–4 проекта «под ключ» на GitHub", "README с выводами и метриками", "Один проект с продакшен-деплоем"] },
      { id: "car-kaggle", title: "Соревнования", subs: ["Kaggle: 2–3 соревнования", "Хакатоны и Datathon"] },
      { id: "car-job", title: "Трудоустройство", subs: ["Резюме под DS-вакансии", "Подготовка к SQL/Python live-кодингу", "Теоретические вопросы на собеседованиях", "Pet-тестовые задания"] }
    ],
    resources: [
      { name: "Kaggle Competitions", url: "https://www.kaggle.com/competitions" }
    ]
  }
];
