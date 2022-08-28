## Node.js Version

v16.14.1

## Frameworks, Libraries

Main Framework: Nest.js v8 with Express.js

ORM: TypeORM v0.2

Testing Tool: jest

## Setup Databasae

MySQL Server 8.x 설치
src\config\envs\default.ts 파일에 DB 연결 관련 정보 세팅

## Installation

```bash
$ yarn install
```

## 로컬 서버 실행

```bash
$ yarn dev
```

## DB Schema 생성

서버 시작 시 자동으로 생성

## 글/댓글 생성 알림 구현

Nest.js 내장 로거 활용

(src/module/post/util/notify.ts)

## Test

Test

```bash
$ yarn test
```

Show test coverage

```bash
$ yarn test:cov
```

## Links

Local Server Endpoint: http://localhost:3000/

Local Server Docs: http://localhost:3000/docs

Local Server Demo: http://localhost:3000/demo

## Structure

\+ src

|---+ config // Environment Configuration

|---+ entity // TypeORM Entities

|---+ error // Error Objects

|---+ filter // Nest Filter File

|---+ module // Nest Module

|---+ type // Typing and Type Checker

|---|---+ \* // (Module Name)

|---|---|---+ controller // Nest Controllers

|---|---|---+ dto // DTO (Data Transfer Object) Schema, Validation

|---|---|---+ provider // Nest Providers

|---|---|---+ repository // TypeORM Repositories

|---|---|---+ provider // Response Schema

|---|---|---+ test // Test File for Each Module

|---|---|---+ util // Utils
