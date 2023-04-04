import app from "../src/index";
import req, { Response } from "supertest";
import { expect } from "chai";
import { PrismaClient } from '@prisma/client';
import { env } from "process";

const prisma = new PrismaClient();

describe('***** Friend Test *****', () => {
    context('[GET] /friend?nickname={}', () => {
        it('사용자 검색하기 성공', done => {
            req(app)
                .get(encodeURI('/friend?nickname=test2'))  // api 요청
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

    context('[POST] /friend/:friendId', () => {
        //?  after 작업
        after(async () => {
            await prisma.friend.deleteMany({
                where: {
                    receiverId: 301,
                    senderId: 300
                }
            });
            await prisma.alarm.deleteMany({
                where: {
                    receiverId: 301,
                    senderId: 300
                }
            })

        });

        it('팔로우 하기 성공', done => {
            req(app)
                .post('/friend/301')
                .set('Content-Type', 'application/json')
                .set('auth', '300')
                .expect(200)
                .expect('Content-Type', /json/) // 예측 content-type
                .then((res) => {
                    done();
                })
                .catch((err) => {
                    console.error("###### Error >>", err);
                    done(err);
                })
        });

        it('이미 팔로우 한 경우, 팔로우 하기 실패 ', done => {
            req(app)
                .post('/friend/302')
                .set('Content-Type', 'application/json')
                .set('auth', '300')
                .expect(400)
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

    context('[DELETE] /friend/:friendId', () => {
        //?  after 작업
        after(async () => {
            await prisma.friend.create({
                data: {
                    receiverId: 302,
                    senderId: 300
                }
            });

        });

        it('팔로우 취소하기 성공', done => {
            req(app)
                .delete('/friend/302')
                .set('Content-Type', 'application/json')
                .set({ accessToken: `Bearer ${env.TEST_ACCESS_TOKEN}` })
                .expect(200)
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

    context('[POST] /friend/:friendId/report', () => {
        //? after 작업
        after(async () => {
            await prisma.report.deleteMany({
                where: {
                    userId: 300,
                    friendId: 300,
                    reasonIndex: 5,
                    etc: "test"
                }
            });

        })
        it('친구 신고하기 성공', done => {
            req(app)
                .post('/friend/300/report')
                .set('Content-Type', 'application/json')
                .set('auth', '300')
                .send({
                    "reasonIndex": 5,
                    "etc": "test"
                })
                .expect(200)
                .expect('Content-Type', /json/) // 예측 content-type
                .then((res) => {
                    done();
                })
                .catch((err) => {
                    console.error("###### Error >>", err);
                    done(err);
                })
        })
    })
    
    context('[POST] /friend/block/:friendId', () => {
        //? after 작업
        after(async () => {
            await prisma.block.deleteMany({
                where: {
                    userId: 300,
                    friendId: 301
                }
            });

        })
        it('친구 차단하기 성공', done => {
            req(app)
                .post('/friend/block/301')
                .set('Content-Type', 'application/json')
                .set({ accessToken: `Bearer ${env.TEST_ACCESS_TOKEN}` })
                .expect(200)
                .expect('Content-Type', /json/) // 예측 content-type
                .then((res) => {
                    done();
                })
                .catch((err) => {
                    console.error("###### Error >>", err);
                    done(err);
                })
        })
    })

    context('[DELETE] /mypage/blocklist/:friendId', () => {
        //? after 작업
        before(async () => {
            await prisma.block.create({
                data: {
                    userId: 300,
                    friendId: 302,
                }
            });
        })
        it('친구 차단 해제하기 성공', done => {
            req(app)
                .delete('/mypage/blocklist/302')
                .set('Content-Type', 'application/json')
                .set({ accessToken: `Bearer ${env.TEST_ACCESS_TOKEN}` })
                .expect(200)
                .expect('Content-Type', /json/) // 예측 content-type
                .then((res) => {
                    done();
                })
                .catch((err) => {
                    console.error("###### Error >>", err);
                    done(err);
                })
        })
        
    })
});
