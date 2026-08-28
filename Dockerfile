FROM nginx:alpine
COPY index.html studio.html landing.css styles.css favicon.svg app.js themes.js converter.js validator.js /usr/share/nginx/html/
COPY vendor/marked.min.js /usr/share/nginx/html/vendor/marked.min.js
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
