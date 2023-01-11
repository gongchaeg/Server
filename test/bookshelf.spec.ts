import app from "../src/index";
import req from "supertest";
import expect from "chai";
import dotenv from "dotenv";

dotenv.config();

//* 내 책장에 책 등록 API
describe('POST /bookshelf', () => {
  it('내 책장에 책 등록하기 성공', done => {
      req(app)
          .post('/bookshelf')  // api 요청
          .set('Content-Type', 'application/json')
          .set('auth', '1')  // header - userId 설정
          .send({
                "bookImage" : "book image url",
                "bookTitle" : "노력의 기쁨과 슬픔",
                "author" : "올리비에 프리올",
                "description" : "책에 대한 한 마디..",
                "memo" : "책에 대한 메모.."
          }) // request body
          .expect(201) // 예측 상태 코드
          .expect('Content-Type', /json/) // 예측 content-type
          .then(res => {
              done();
          })
          .catch(err => {
              console.error("######Error >>", err);
              done(err);
          })
  });
  it('필요한 헤더 값이 없음', done => {
      req(app)
          .get('/bookshelf')
          .set('Content-Type', 'application/json')
          .expect(400)
          .then(res => {
              done();
          })
          .catch(err => {
              console.error("######Error >>", err);
              done(err);
          })
  });
});

//* 등록한 책 상세 정보 조회

//* 등록한 책 삭제

//* 등록한 책 수정

//* 내 책장 (메인 뷰) 조회

//* 친구 책장 조회