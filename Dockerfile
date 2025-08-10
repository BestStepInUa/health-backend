# Базовий Node образ (остання LTS)
FROM node:lts-alpine

# Робоча директорія всередині контейнера
WORKDIR /app

# Копіюємо package.json та package-lock.json
COPY package*.json ./

# Встановлюємо залежності
RUN npm install

# Копіюємо увесь код
COPY . .

# Збираємо проект
RUN npm run build

# Відкриваємо порт
EXPOSE 3000

# Запускаємо додаток
CMD ["npm", "run", "start:dev"]