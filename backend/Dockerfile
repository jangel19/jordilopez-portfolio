FROM denoland/deno:alpine-1.37.2

WORKDIR /app
COPY . .

ENV PORT=8000
EXPOSE 8000

CMD ["run", "--allow-net", "--allow-env", "index.ts"]