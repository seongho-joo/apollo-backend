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
