import nodemailer from 'nodemailer';

interface TransporterOptions {
    host: string;
    port: number;
    secure: boolean;
    auth: {
        user: string;
        pass: string;
    };
}

const transporterOptions: TransporterOptions = {
    host: process.env.EMAIL_HOST as string,
    port: parseInt(process.env.EMAIL_PORT as string, 10),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER as string, // Admin Gmail ID
        pass: process.env.EMAIL_PASS as string, // Admin Gmail Password
    },
};

const transporter = nodemailer.createTransport(transporterOptions);

export default transporter;
