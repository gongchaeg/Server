import config from "../config/index";
import { ReportMailRequestDTO } from '../interfaces/friend/ReportMailRequestDTO';

const nodemailer = require('nodemailer');

export const mailSender = {
    // 메일발송 함수
    sendGmail: function (reportMailRequestDTO: ReportMailRequestDTO) {
        let transporter = nodemailer.createTransport({
            service: 'gmail',   // 메일 보내는 곳
            prot: 587,
            host: 'smtp.gmail.com',
            secure: false,
            requireTLS: true,
            auth: {
                user: config.email,  // 보내는 메일의 주소
                pass: config.password   // 보내는 메일의 비밀번호
            }
        });
        // 메일 옵션
        let mailOptions = {
            from: `Peekabook Team <${config.email}>`, // 보내는 메일의 주소
            to: config.email, // 수신할 이메일
            subject: reportMailRequestDTO.mailTitle, // 메일 제목
            text: reportMailRequestDTO.text // 메일 내용
        };


        // 메일 발송    
        transporter.sendMail(mailOptions, function (req: Request, res: Response) {
            try {
                console.log('Email sent: ' + res);
            } catch (error) {
                console.log(error);
                throw error;
            }

        });


    }
}

