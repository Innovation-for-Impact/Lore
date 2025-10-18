# Quickstart

## WSL2
For development on WSL, follow these instructions: https://github.com/expo/fyi/blob/main/wsl.md

Install dependencies
```
npm install
```
Follow the Quickstart in `backend/README.md`

Generate the types from OpenAPI schema
```
chmod +x get_docs
./bin/get_docs
```

Run the appropriate start script
```
#iOS
npm run start

#web
npm run web
```
