import { Book } from '@prisma/client';
import { expect } from 'chai';
import app from "../src/index";
import req from "supertest";
import dotenv from "dotenv";
import { Response } from 'supertest';
import { PrismaClient } from '@prisma/client';
import { afterEach } from 'node:test';

dotenv.config();
const prisma = new PrismaClient();

describe('***** Bookshelf Test *****', () => {
    //* 내 책장에 책 등록 API
    context('[POST] /bookshelf', () => {
        after(async () => {
            const book = await prisma.book.findFirst({
                where : {
                    bookTitle: "아무튼, 여름",
                    author : "김신회"
                }
            });


            await prisma.bookshelf.deleteMany({
                where : {
                    userId : 300,
                    bookId : book?.id
                }
            })

              // 나를 팔로우하는 친구들에게 알림 삭제하기
            const follows = await prisma.friend.findMany({
                where : {
                receiverId : 300
                },
                select : {
                senderId : true
                }
            });

            for ( const follow of follows ) {
                const alarm = await prisma.alarm.deleteMany({
                where : {
                    senderId : 300,
                    receiverId : follow.senderId,
                    typeId : 3
                }
            });
          }
        });

        it("내 책장에 책 등록 성공", done => {
            req(app)
            .post('/bookshelf')  // api 요청
            .set('Content-Type', 'application/json')
            .set('auth', '300')  // header - userId 설정
            .send({
                "bookImage" : "http://image.yes24.com/goods/90365124/XL",
                "bookTitle" : "아무튼, 여름",
                "author" : "김신회",
                "description" : "테스트를 위한 한 마디에요",
                "memo" : "테스트를 위한 메모에요"
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
    context('[GET] /bookshelf/detail/3', () => {
        it('등록한 책 상세 정보 조회 성공', done => { 
            req(app)
                .get('/bookshelf/detail/3')  // api 요청
                .set('Content-Type', 'application/json')
                .set('auth', '300')  // header - userId 설정
                .expect(200) // 예측 상태 코드
                .expect('Content-Type', /json/) // 예측 content-type
                .then(res => {
                    expect(res.body.data.Book.bookTitle).to.equal("오리진");  
                    expect(res.body.data.Book.author).to.equal("댄브라운"); //response body 예측값 검증
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
                .get('/bookshelf/detail/200')
                .set('Content-Type', 'application/json')
                .then(res => {
                    expect(res.body.status).to.equals(400); // 추후 상태 코드 변경
                    done();
                })
                .catch(err => {
                    console.error("###### Error >>", err);
                    done(err);
                })
        });
    });

    //* 등록한 책 삭제
    context('[DELETE] /bookshelf/3', () => {
        after(async () => {
            await prisma.bookshelf.create({
                data: {
                pickIndex : 0,
                description : "Test 책입니다.",
                memo : "엇",
                User : { 
                    connect : {
                    id : 300
                    }
                },
                Book : {
                    connectOrCreate : {
                    where : {
                        id : 3
                    },
                    create : {
                        bookTitle : "오리진",
                        author : "댄브라운",
                        bookImage : "https://search.pstatic.net/common/?src=https%3A%2F%2Fshopping-phinf.pstatic.net%2Fmain_3239339%2F32393392566.jpg&type=w216"
                    }
                    }
                }
                }
            });
        });

        it('책 삭제하기 성공', done => {
            req(app)
                .delete('/bookshelf/3')  // api 요청
                .set('Content-Type', 'application/json')
                .set('auth', '300')  // header - userId 설정
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
                .delete('/bookshelf/3')
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
                .delete('/bookshelf/200')
                .set('Content-Type', 'application/json')
                .expect(400) // 추후 상태 코드 변경
                .then(res => {
                    done();
                })
                .catch(err => {
                    console.error("###### Error >>", err);
                    done(err);
                })
        });
    });
        
    //* 등록한 책 수정
    context('[DELETE] /bookshelf/3', () => {
        after(async () => {
            await prisma.bookshelf.updateMany({
                where : {
                    bookId : 3,
                    userId : 300
                },
                data : {
                    description : "Test 책입니다.",
                    memo : "엇"
                }
            });
        });

        it('책 수정하기 성공', done => {
            req(app)
                .patch('/bookshelf/3')  // api 요청
                .set('Content-Type', 'application/json')
                .set('auth', '300')  // header - userId 설정
                .send({
                    "description" : "테스트를 위해 한 마디 수정합니다",
                    "memo" : "테스트를 위해 한 마디 수정합니다"
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
                .patch('/bookshelf/3')
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
                .patch('/bookshelf/200')
                .set('Content-Type', 'application/json')
                .expect(400) // 추후 상태 코드 변경
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
                .set('auth', '300')  // header - userId 설정
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
        it('해당하는 책을 찾을 수 없음', done => {
            req(app)
                .get('/bookshelf')
                .set('Content-Type', 'application/json')
                .then(res => {
                    expect(res.body.status).to.equals(400); // 추후 상태 코드 변경
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
                .set('auth', '300')  // header - userId 설정
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
        it('해당하는 책을 찾을 수 없음', done => {
            req(app)
                .get('/bookshelf/friend/302')
                .set('Content-Type', 'application/json')
                .then(res => {
                    expect(res.body.status).to.equals(400); // 추후 상태 코드 변경
                    done();
                })
                .catch(err => {
                    console.error("###### Error >>", err);
                    done(err);
                })
        });
    });

});
