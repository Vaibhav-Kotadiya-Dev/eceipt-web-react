FROM nginx:1.17
COPY build/ /usr/share/nginx/html

# Stage 2 - the production environment
COPY default.conf /etc/nginx/conf.d/default.conf
COPY build/ /usr/share/nginx/html
EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
CMD ["sh", "-c", "cd /usr/share/nginx/html/ &&  chmod +x update_config.sh && ./update_config.sh && nginx -g 'daemon off;'"]

