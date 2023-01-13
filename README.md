# Peekabook 

> 31st IN SOPT APP JAM <br>
>
> 프로젝트 기간 : 2022.12.11 ~ 2023.01.14

<br>

![서버](https://user-images.githubusercontent.com/81394850/210396757-7b6eed63-1f90-477f-b0c9-0167a0e5c29a.png)


<br>
<br>

## Team-Peekabook Server Developers


| 박현정 | 조에슬 |
| :---------:|:----------:|
|<img width="300" alt="image" src="https://user-images.githubusercontent.com/81394850/210358708-f6139bed-c2b6-43d9-8dc6-525ac8c68e9f.jpg"> | <img width="300" alt="image" src="https://user-images.githubusercontent.com/81394850/210397458-13875d52-7081-4f5b-9c65-a558b8efa57b.jpg"> | 
| [hyeonjeongs](https://github.com/hyeonjeongs) | [yeseul106](https://github.com/yeseul106) |



<br>

## 🔧Development Environment
<img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node.js&logoColor=white"/> <img src="https://img.shields.io/badge/Express-000000?style=flat-square&logo=Express&logoColor=white"/> <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=TypeScript&logoColor=white"/> <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=PostgreSQL&logoColor=white"/> <img src="https://img.shields.io/badge/AWS-232F3E?style=flat-square&logo=AmazonAWS&logoColor=white"/>

<br>

## ➿Project Foldering

```

├── husky
├── prisma
├── src
│   ├── config
│       └── index.ts
│       └── response.ts
│       └── responseMessage.ts
│       └── statusCode.ts
│       └── tokenType.ts
│   ├── constants
│       └── index.ts
│   ├── controller
│       └── index.ts
│   ├── interfaces
│   ├── middlwares
│       └── slackErrorMessage.ts
│       └── slackWebhook.ts
│   ├── modules
│       └── index.ts
│   ├── router
│       └── index.ts
│   └── service
│       └── index.ts
└── test

```
<br>

## ERD
https://www.erdcloud.com/d/X9GnjASe9fSv26YWg
<img width="768" alt="image" src="https://user-images.githubusercontent.com/81394850/210384573-1429aa53-81bf-4737-b397-4a1bd340acb1.png">

## Api 명세서
https://interesting-door-b57.notion.site/Api-d14d8f4bc9bb4ae9a55661ef609d4275


## 🙋🏻‍♀️ 역할 분담

<div markdown="1">  
 
| 기능명 | 담당자 | 완료 여부 |
| :-----: | :---: | :---: |
| 프로젝트 세팅 | `현정🐸` | 완료 |
| EC2 세팅 | `현정🐸` | 완료 |
| RDS 세팅 | `예슬🐼` | 완료 |
| Datagrip 세팅 | `예슬🐼` | 완료 |
| DB 설계 | `예슬🐼` `현정🐸` | 완료 |
| API 명세서 작성 | `예슬🐼` `현정🐸` | 완료 |
| CI/CD 구현 | `예슬🐼` `현정🐸` | 완료 |
| Slack webhook 세팅 | `현정🐸` | 완료 |
| macha를 통한 테스트 환경 구축 | `예슬🐼` | 완료 |
| 테스트 코드 작성 | `예슬🐼` `현정🐸` | 완료 |
 
</div>
 <br>

## 📌 Coding Convention
<details>
 <summary >함수에 대한 주석  </summary>
 <div markdown="1">       

 ---
- backend에서 공통적으로 사용하는 함수의 경우, 모듈화를 통해 하나의 파일로 관리합니다.
- 하나의 파일의 시작 부분에 주석으로 상세 내용을 작성합니다. 정리해야 하는 부분은 다음과 같습니다.
- 보통 controller에 작성하기로 합니다
- **함수의 전체 기능**에 대한 설명
- 예시 코드
    
    ```tsx
    /**
     * @route GET /mission/all
     * @desc 지난 미션 모두 가져오기
     * */
     */
    const getCompletedMission = async (req: Request, res: Response) => {
      //어쩌구 저쩌구
    };
    ```
   
 <br>

 </div>
 </details>
 
 <details>
 <summary >변수명  </summary>
 <div markdown="1">       

 ---
     ### 읽기 쉽고 알기 쉬운 **변수명**으로 만들기

    ```tsx
    // great - "name" implies strings
    const subjectName = ['math', 'english', 'korea'];
    const subject = [{name: 'math', difficulty: 'easy’}]
    ```

    - boolean 같은 경우 “is”, “has”, “can”과 같은 접두어와 같이 사용한다.

    ```tsx
    // good
    const isOpen = true; const canWrite = true; const hasFruit = true;
    ```

    - 숫자일 경우 max, min, total과같은 단어로 설명한다.

    ```tsx
    // good
    let totalNum = 54;
    ```

    - 함수일 경우 동사와 명사를 사용하여 **actionResource**의 형식을 따르는 것이 좋다

    ```tsx
    // good
    const getUser = (firstName, LastName) => firstName + LastName
    ```
    <br>
   
   ### 변수(함수) 명에 대한 이름

    - 변수, 함수 , 인스턴스 - Camel Case
    - 함수명 작성 시 동사 + 명사
    - Class, Constructor - Pascal Case

    ```tsx
    // good
    var userId
    function addUserInfo () {}
    class UserInfo {}
    ```
   
   ### 파일명은 카멜케이스

      - 파일명 - Camel Case

      ### 상수는 무조건 대문자

      - 만약 여러 단어면 상수일 때만 _ (언더바 사용)

      ```tsx
      //bad
      const maxNum = 20;

      //good
      const MAX_NUM = 20;
      ```
 </div>
 </details>
 
<details>
 <summary >Bracket</summary>
  <div markdown="1">       

 ---
     ### 중괄호로 묶이지 않은 블록문을 금지

      블록문을 반드시 중괄호로 묶을 것을 강제합니다

      ```tsx
      // good
      if (flag) {
        count++;
      }

      // bad
      if (flag) count++;
      ```
   ### 들여쓰기로 스페이스 2번을 하지 않을 경우 에러

    ```tsx
    // good
    if (a) {
        b=c;
        function foo(d) {
            e=f;
        }
    }

    // bad
    if (a) {
      b=c;
      function foo(d) {
        e=f;
      }
    }
    ```
  </div>
 </details>
 
 <br>
 
 ## 📌Git Convention
 ### 🔹Commit Convention
 - ✅ `[CHORE]` : 동작에 영향 없는 코드 or 변경 없는 변경사항(주석 추가 등)
- ✨ `[FEAT]` : 새로운 기능 구현
- ➕ `[ADD]` : Feat 이외의 부수적인 코드 추가, 라이브러리 추가, 새로운 파일 생성
- 🔨 `[FIX]` : 버그, 오류 해결
- ⚰️ `[DEL]` : 쓸모없는 코드 삭제
- 📝 `[DOCS]` : README나 WIKI 등의 문서 수정
- ✏️ `[CORRECT]` : 주로 문법의 오류나 타입의 변경, 이름 변경시
- ⏪️ `[RENAME]` : 파일 이름 변경시
- ♻️ `[REFACTOR]` : 전면 수정
- 🔀 `[MERGE]`: 다른 브랜치와 병합

### 커밋 예시

`ex ) git commit -m "#1 [FEAT] 회원가입 기능 완료"`

<br>

### 🔹Branch Convention

- [develop] : 최종 배포
- [feature] : 기능 추가
- [fix] : 에러 수정, 버그 수정
- [docs] : README, 문서
- [refactor] : 코드 리펙토링 (기능 변경 없이 코드만 수정할 때)
- [modify] : 코드 수정 (기능의 변화가 있을 때)
- [chore] : gradle 세팅, 위의 것 이외에 거의 모든 것

### 브랜치 명 예시

`ex) feature/#issue-user-api`

<br>

### 🔹Branch Strategy
### Git Flow

기본적으로 Git Flow 전략을 이용한다. Fork한 후 나의 repository에서 작업하고 구현 후 원본 repository에 pr을 날린다. 작업 시작 시 선행되어야 할 작업은 다음과 같다.

```java
1. Issue를 생성한다.
2. feature Branch를 생성한다.
3. Add - Commit - Push - Pull Request 의 과정을 거친다.
4. Pull Request가 작성되면 작성자 이외의 다른 팀원이 Code Review를 한다.
5. Code Review가 완료되면 Pull Request 작성자가 develop Branch로 merge 한다.
6. merge된 작업이 있을 경우, 다른 브랜치에서 작업을 진행 중이던 개발자는 본인의 브랜치로 merge된 작업을 Pull 받아온다.
7. 종료된 Issue와 Pull Request의 Label과 Project를 관리한다.
```

- 기본적으로 git flow 전략을 사용합니다.
- main, develop, feature 3가지 branch 를 기본으로 합니다.
- main → develop → feature. feature 브랜치는 feat/기능명으로 사용합니다.
- 이슈를 사용하는 경우 브랜치명을 feature/[issue num]-[feature name]로 합니다.

<br>


### 🔹Issue Convention
- [feat] : 기능 추가
- [fix] : 에러 수정, 버그 수정
- [docs] : README, 문서
- [refactor] : 코드 리펙토링 (기능 변경 없이 코드만 수정할 때)
- [modify] : 코드 수정 (기능의 변화가 있을 때)
- [chore] : gradle 세팅, 위의 것 이외에 거의 모든 것

`ex) [feat] user api 구현`

## 📌 Dependencies module
```
{
  "name": "peekabook",
  "version": "1.0.0",
  "main": "index.js",
  "repository": "https://github.com/team-peekabook/Peekabook-server.git",
  "author": "hyeonjeong Park <py0429@ewhain.net>",
  "license": "MIT",
  "scripts": {
    "dev": "nodemon",
    "build": "tsc",
    "postinstall": "prisma generate",
    "prepare": "husky install",
    "test": "yarn mocha ./test/* -r ts-node/register -exit"
  },
  "dependencies": {
    "@aws-sdk/client-s3": "^3.241.0",
    "@prisma/client": "^4.8.0",
    "axios": "^1.2.2",
    "dayjs": "^1.11.7",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "multer": "^1.4.5-lts.1",
    "multer-s3": "^3.0.1",
    "prisma": "^4.8.0"
  },
  "devDependencies": {
    "@types/chai": "^4.3.4",
    "@types/express": "^4.17.15",
    "@types/mocha": "^10.0.1",
    "@types/multer": "^1.4.7",
    "@types/multer-s3": "^3.0.0",
    "@types/node": "^18.11.18",
    "@types/supertest": "^2.0.12",
    "chai": "^4.3.7",
    "husky": "^8.0.0",
    "mocha": "^10.2.0",
    "nodemon": "^2.0.20",
    "supertest": "^6.3.3",
    "ts-node": "^10.9.1",
    "typescript": "^4.9.4"
  }
}
```

## 📌 Server architecture
![최종과제1](https://user-images.githubusercontent.com/81394850/212317459-f952c179-f490-439e-8b8c-64ce0875d885.png)



