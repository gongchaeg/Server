import { Book } from '@prisma/client';
import { expect } from 'chai';
import app from "../src/index";
import req from "supertest";
import dotenv from "dotenv";
import { Response } from 'supertest';
import { PrismaClient } from '@prisma/client';
import { afterEach } from 'node:test';
import { env } from 'process';

dotenv.config();
const prisma = new PrismaClient();

describe('***** Bookshelf Test *****', () => {
    //* 내 책장에 책 등록 API
    context('[POST] /bookshelf', () => {
        after(async () => {
            const book = await prisma.book.findFirst({
                where: {
                    bookTitle: "데미안",
                    author: "헤르만 헤세",
                    publisher: "푸른 숲"
                }
            });

            await prisma.bookshelf.deleteMany({
                where: {
                    userId: 300,
                    bookId: book?.id
                }
            })

            // 나를 팔로우하는 친구들에게 알림 삭제하기
            const follows = await prisma.friend.findMany({
                where: {
                    receiverId: 300
                },
                select: {
                    senderId: true
                }
            });

            for (const follow of follows) {
                const alarm = await prisma.alarm.deleteMany({
                    where: {
                        senderId: 300,
                        receiverId: follow.senderId,
                        typeId: 3
                    }
                });
            }
        });

        it("내 책장에 책 등록 성공", done => {
            req(app)
                .post('/bookshelf')  // api 요청
                .set('Content-Type', 'application/json')
                .set({ accessToken: `Bearer ${env.TEST_ACCESS_TOKEN}` })
                .send({
                    "bookImage": "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788954620147.jpg",
                    "bookTitle": "데미안",
                    "author": "헤르만 헤세",
                    "publisher" : "푸른 숲",
                    "description": "테스트를 위한 한 마디에요",
                    "memo": "테스트를 위한 메모에요"
                }) // request body
                .expect(201) // 예측 상태 코드
                .expect('Content-Type', /json/) // 예측 content-type
                .then(res => {
                    done();
                })
                .catch(err => {
                    console.error("###### Error >>", err);
                    done(err);
                })
        })

        it('필요한 헤더 값이 없음', done => {
            req(app)
                .get('/bookshelf')
                .set('Content-Type', 'application/json')
                .expect(400)
                .then(res => {
                    done();
                })
                .catch(err => {
                    console.error("###### Error >>", err);
                    done(err);
                })
        });
    });

    //* 등록한 책 상세 정보 조회
    context('[GET] /bookshelf/detail/1', () => {
        it('등록한 책 상세 정보 조회 성공', done => {
            req(app)
                .get('/bookshelf/detail/1')  // api 요청
                .set('Content-Type', 'application/json')
                .set({ accessToken: `Bearer ${env.TEST_ACCESS_TOKEN}` })
                .expect(200) // 예측 상태 코드
                .expect('Content-Type', /json/) // 예측 content-type
                .then(res => {
                    expect(res.body.data.Book.bookTitle).to.equal("공정하다는 착각");
                    expect(res.body.data.Book.author).to.equal("마이클 샌델"); //response body 예측값 검증
                    done();
                })
                .catch(err => {
                    console.error("###### Error >>", err);
                    done(err);
                })
        });
        it('필요한 헤더 값이 없음', done => {
            req(app)
                .get('/bookshelf/detail/1')
                .set('Content-Type', 'application/json')
                .expect(400)
                .then(res => {
                    done();
                })
                .catch(err => {
                    console.error("###### Error >>", err);
                    done(err);
                })
        });
        it('해당하는 책을 찾을 수 없음', done => {
            req(app)
                .get('/bookshelf/detail/-1')
                .set('Content-Type', 'application/json')
                .set({ accessToken: `Bearer ${env.TEST_ACCESS_TOKEN}` })
                .then(res => {
                    expect(res.body.status).to.equals(404); // 추후 상태 코드 변경
                    done();
                })
                .catch(err => {
                    console.error("###### Error >>", err);
                    done(err);
                })
        });
    });

    //* 등록한 책 수정
    context('[PATCH] /bookshelf/1', () => {
        after(async () => {
            await prisma.bookshelf.updateMany({
                where: {
                    bookId: 1,
                    userId: 300
                },
                data: {
                    description: "테스트3",
                    memo: "메모3"
                }
            });
        });

        it('책 수정하기 성공', done => {
            req(app)
                .patch('/bookshelf/1')  // api 요청
                .set('Content-Type', 'application/json')
                .set({ accessToken: `Bearer ${env.TEST_ACCESS_TOKEN}` })
                .send({
                    "description": "테스트를 위해 한 마디 수정합니다",
                    "memo": "테스트를 위해 한 마디 수정합니다"
                }) // request body
                .expect(200) // 예측 상태 코드
                .expect('Content-Type', /json/) // 예측 content-type
                .then(res => {
                    done();
                })
                .catch(err => {
                    console.error("###### Error >>", err);
                    done(err);
                })
        });
        it('필요한 헤더 값이 없음', done => {
            req(app)
                .patch('/bookshelf/1')
                .set('Content-Type', 'application/json')
                .expect(400)
                .then(res => {
                    done();
                })
                .catch(err => {
                    console.error("###### Error >>", err);
                    done(err);
                })
        });
        it('해당하는 책을 찾을 수 없음', done => {
            req(app)
                .patch('/bookshelf/-1')
                .set('Content-Type', 'application/json')
                .set({ accessToken: `Bearer ${env.TEST_ACCESS_TOKEN}` })
                .expect(404) // 추후 상태 코드 변경
                .then(res => {
                    done();
                })
                .catch(err => {
                    console.error("###### Error >>", err);
                    done(err);
                })
        });
    });

    //* 내 책장 (메인 뷰) 조회
    context('[GET] /bookshelf', () => {
        it('내 책장 조회 성공', done => {
            req(app)
                .get('/bookshelf')  // api 요청
                .set('Content-Type', 'application/json')
                .set({ accessToken: `Bearer ${env.TEST_ACCESS_TOKEN}` })
                .expect(200) // 예측 상태 코드
                .expect('Content-Type', /json/) // 예측 content-type
                .then(res => {
                    done();
                })
                .catch(err => {
                    console.error("###### Error >>", err);
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
                    console.error("###### Error >>", err);
                    done(err);
                })
        });
    });

    //* 친구 책장 조회
    context('[GET] /bookshelf/friend/302', () => {
        it('내 책장 조회 성공', done => {
            req(app)
                .get('/bookshelf/friend/302')  // api 요청
                .set('Content-Type', 'application/json')
                .set({ accessToken: `Bearer ${env.TEST_ACCESS_TOKEN}` })
                .expect(200) // 예측 상태 코드
                .expect('Content-Type', /json/) // 예측 content-type
                .then(res => {
                    done();
                })
                .catch(err => {
                    console.error("###### Error >>", err);
                    done(err);
                })
        });
        it('필요한 헤더 값이 없음', done => {
            req(app)
                .get('/bookshelf/friend/302')
                .set('Content-Type', 'application/json')
                .expect(400)
                .then(res => {
                    done();
                })
                .catch(err => {
                    console.error("###### Error >>", err);
                    done(err);
                })
        });
    });

});