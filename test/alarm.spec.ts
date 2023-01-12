import app from "../src/index";
import req, { Response } from "supertest";
import { expect } from 'chai';

describe('***** Alarm Test *****', () => {
    context('[GET] /alarm', () => {
        it('알림 조회 성공', done => {
            req(app)
                .get('/alarm')  // api 요청
                .set('Content-Type', 'application/json')
                .set('auth', '300')  // header 설정
                .expect(200) // 예측 상태 코드
                .expect('Content-Type', /json/) // 예측 content-type
                .then((res) => {
                    done();
                })
                .catch((err) => {
                    console.error("###### Error >>", err);
                    done(err);
                })
        });
    });
});
