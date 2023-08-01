FROM php:fpm

RUN apt-get update && apt-get install -y \
  wget \
  libonig-dev \
  sqlite3 \
  libzip-dev \
  cron

RUN docker-php-ext-install zip

WORKDIR /app
COPY . .
RUN cp .env.example .env
RUN COMPOSER_ALLOW_SUPERUSER=1 ./composer.phar install

RUN touch database/database.sqlite
RUN php artisan migrate

RUN chown -R www-data:www-data /app

COPY seed-cron /etc/cron.d/seed-cron
RUN chmod 0644 /etc/cron.d/seed-cron
RUN crontab /etc/cron.d/seed-cron
RUN touch /var/log/cron.log

EXPOSE 9000

CMD ./start-cron.sh && php-fpm