# Backend

## set up
- Apollo Server
```
$ npm install apollo-server graphql
$ npm install nodemon --save-dev
// package.json
"scripts": {
    "dev": "nodemon --exec node server.js"
},
```
- babel 없이 import 사용 
- node 14부터 사용가능
```
// package.json
"type": "module"
```
- babel 설정
```
$ npm install @babel/core --save-dev
$ npm install @babel/preset-env --save-dev // code update
$ npm i @babel/node --save-dev // 기본적인 콘솔에서 js 실행

$ touch babel.config.json
// babel.config.json
{
  "presets": ["@babel/preset-env"]
}
// package.json
"scripts": {
    "dev": "nodemon --exec babel-node server"
},
```
- Prisma Setup
```
$ npm i @prisma/cli -D
$ npx prisma init
```
  - PostgreSQL 설치
  - `CREATE DATABASE 데이터베이스명`
  - `.env`파일 DATABASE_URL 수정

- Prisma Migrage
  - shema.prisma 파일의 데이터 모델을 쓰고 설명할 수 있게 해줌
  - model == data
  - `autoincrement()` 자동으로 증가 시켜줌
  - `$ npx prisma migrate dev --preview-feature`
    - prisma를 sql로 변환
  
- Schema Merge
  - `$ npm install graphql-tools@latest `
  ```
  const loadedTypes = loadFilesSync(`${__dirname}/**/*.typeDefs.js`);
  const loadedResolvers = loadFilesSync(
    `${__dirname}/**/*.{queries, mutations}.js`
  );

  const typeDefs = mergeTypeDefs(loadedTypes);
  const resolvers = mergeResolvers(loadedResolvers);

  const schema = makeExecutableSchema(typeDefs, resolvers);

  ```