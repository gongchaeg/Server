import app from "../src/index";
import req, { Response } from "supertest";
import { expect } from 'chai';
import { PrismaClient } from "@prisma/client";
import { response } from "express";

const prisma = new PrismaClient();

describe('***** Pick Test *****', () => {
    context('[GET] /pick/all', () => {
        it('Pick - 책 전체 조회 성공', done => {
            req(app)
                .get('/pick/all')  // api 요청
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

    context('[PATCH] /pick', () => {
        //?  after 작업
        after(async () => {
            await prisma.bookshelf.update({
                where: {
                    id: 5,
                },
                data: {
                    pickIndex: 0
                }
            });

            await prisma.bookshelf.update({
                where: {
                    id: 7,
                },
                data: {
                    pickIndex: 0
                }
            });

            await prisma.bookshelf.update({
                where: {
                    id: 9,
                },
                data: {
                    pickIndex: 0
                }
            });
        });

        it('픽한 책 수정 성공', done => {
            req(app)
                .patch('/pick')  // api 요청
                .set('Content-Type', 'application/json')
                .set('auth', '2')  // header 설정
                .send({
                    "firstPick": 5,
                    "secondPick": 7,
                    "thirdPick": 9
                })
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
