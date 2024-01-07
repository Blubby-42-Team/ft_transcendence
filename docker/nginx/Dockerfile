FROM nginx:1.25.3-alpine

COPY docker/nginx/init.sh /init.sh

RUN chmod +x /init.sh

ENTRYPOINT [ "sh", "/init.sh" ]