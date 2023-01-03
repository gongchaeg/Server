// src/index.ts
import express, { NextFunction, Request, Response } from "express";

const app = express(); // express 객체 받아옴
const PORT = 3000; // 사용할 port를 3000번으로 설정

app.use(express.json()); // express 에서 request body를 json 으로 받아오겠다.

app.use("/api", require("./api")); // use -> 모든 요청

//* HTTP method - GET
app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.send("Peekabook Server!");
});

app.listen(PORT, () => {
    console.log(`
        #############################################
            🛡️ Server listening on port: ${PORT} 🛡️
        #############################################
    `);
});