FROM node:16-alpine

RUN apk add mc
WORKDIR /app

RUN mkdir -p ./storage
RUN mkdir -p ./storage/uploads

COPY package*.json ./
RUN npm ci --only=production
RUN npm install -g pino-pretty

COPY . .

EXPOSE 3636
CMD ["npm", "start"]

### ПАМЯТКА РАБОТЫ С DOCKER ###

# Авторизация
# docker login <url>
# docker logout <url>

# Сборка и проверки
# docker build -t <name> .                              # собрать образ
# docker run --name <name> -d -p 443:3000 <name>        # запустить контейнер
# docker run --name <name> -d --rm -it <name> <command> # запустить при ошибках

# Публикация
# docker push <name>   # загрузить в репозиторий
# docker pull <name>   # выгрузить из репозитория

# Дополнительно
# docker ps                         # список активных контейнеров
# docker ps -a                      # список всех контейнеров
# docker images                     # список образов
# docker rmi <name>                 # удалить образ
# docker system prune               # очистить висящие образы
# docker save <name> > <name>.tar   # сохранить образ в проект
# docker exec -it <name> sh         # подключиться к контейнеру (выход exit)

# Документация Docker: https://docs.docker.com
# Репозиторий Docker: https://hub.docker.com
# Команды Docker: https://docs.docker.com/engine/reference/commandline/docker
### ПАМЯТКА РАБОТЫ С DOCKER ###

# Авторизация
# docker login <url>
# docker logout <url>

# Сборка и проверки
# docker build -t <name> .                              # собрать образ
# docker run --name <name> -d -p 443:3000 <name>        # запустить контейнер
# docker run --name <name> -d --rm -it <name> <command> # запустить при ошибках

# Публикация
# docker push <name>   # загрузить в репозиторий
# docker pull <name>   # выгрузить из репозитория

# Дополнительно
# docker ps                         # список активных контейнеров
# docker ps -a                      # список всех контейнеров
# docker images                     # список образов
# docker rmi <name>                 # удалить образ
# docker system prune               # очистить висящие образы
# docker save <name> > <name>.tar   # сохранить образ в проект
# docker exec -it <name> sh         # подключиться к контейнеру (выход exit)
#  docker stats -                   # Статус запущенных контейнеров

# Документация Docker: https://docs.docker.com
# Репозиторий Docker: https://hub.docker.com
# Команды Docker: https://docs.docker.com/engine/reference/commandline/docker
