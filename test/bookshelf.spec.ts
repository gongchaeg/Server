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
        
//     //* 등록한 책 삭제
//     context('[DELETE] /bookshelf/1', () => {
//         it('책 삭제하기 성공', done => {
//             req(app)
//                 .delete('/bookshelf/1')  // api 요청
//                 .set('Content-Type', 'application/json')
//                 .set('auth', '300')  // header - userId 설정
//                 .expect(200) // 예측 상태 코드
//                 .expect('Content-Type', /json/) // 예측 content-type
//                 .then(res => {
//                     done();
//                 })
//                 .catch(err => {
//                     console.error("###### Error >>", err);
//                     done(err);
//                 })
//         });
//         it('필요한 헤더 값이 없음', done => {
//             req(app)
//                 .delete('/bookshelf/1')
//                 .set('Content-Type', 'application/json')
//                 .expect(400)
//                 .then(res => {
//                     done();
//                 })
//                 .catch(err => {
//                     console.error("###### Error >>", err);
//                     done(err);
//                 })
//         });
//         // it('해당하는 책을 찾을 수 없음', done => {
//         //     req(app)
//         //         .delete('/bookshelf/200')
//         //         .set('Content-Type', 'application/json')
//         //         .expect(404)
//         //         .then(res => {
//         //             done();
//         //         })
//         //         .catch(err => {
//         //             console.error("###### Error >>", err);
//         //             done(err);
//         //         })
//         // });
//     });
    
//     //* 등록한 책 수정
    
//     //* 내 책장 (메인 뷰) 조회
    
//     //* 친구 책장 조회

});
