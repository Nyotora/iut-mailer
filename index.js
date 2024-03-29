#!/usr/bin/env node

const { Parser } = require('json2csv');
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'rebeka.feest27@ethereal.email',
        pass: 't4qdfFKRCS36MzgUrm'
    }
});

const amqp = require('amqplib/callback_api');
const {writeFileSync} = require("fs");

amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        const queue = 'iut-project';
        const queueCsv = 'iut-project-csv';

        channel.assertQueue(queue, {
            durable: false
        });channel.assertQueue(queueCsv, {
            durable: false
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queueCsv);

        channel.consume(queue, function(msg) {
            const msgContent = JSON.parse(msg.content.toString());
            send(msgContent['to'], msgContent['type'],msgContent['movieJSON'])
        }, {
            noAck: true
        });
        channel.consume(queueCsv, function(msg) {
            const msgContent = JSON.parse(msg.content.toString());
            console.log(msgContent['moviesJSON'])
            sendCsv(msgContent['to'],msgContent['moviesJSON'])
        }, {
            noAck: true
        });
    });
});

async function JsonToCSV(json) {
    const fields = ['id', 'title', 'director', 'releaseDate', 'description'];

    const json2csvParser = new Parser({ fields });

    return json2csvParser.parse(JSON.parse(json));
}

async function sendCsv(mail,csvJSON) {
    const filePath = 'movies.csv';
    const csv = await JsonToCSV(csvJSON)
    await writeFileSync(filePath, csv, 'utf-8');

    const html = `
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                        <h1 style="color: #333333; text-align: center;">IUT-Project !</h1>
                        <p style="color: #666666; font-size: 16px; line-height: 1.5;">Retrouvez ci-joint la liste de tous les films enregistrés dans la base de données.</p>
                    </div>
            `;
    const info = await transporter.sendMail({
        from: '"IUT Project Team" <iut-project@ethereal.email>', // sender address
        to: mail, // list of receivers
        subject: "Liste des films", // Subject line
        text: "Ci*joint les films présents en BDD", // plain text body
        html: html, // html body
        attachments: [
            {
                filename: 'movies.csv',
                path: filePath
            }
        ]
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

async function send(mails,type,movieJSON = '{}') {
    // send mail with defined transport object
    const form = generateMailHTML(type,JSON.parse(movieJSON));
    const info = await transporter.sendMail({
        from: '"IUT Project Team" <iut-project@ethereal.email>', // sender address
        to: mails, // list of receivers
        subject: form['subject'], // Subject line
        text: form['text'], // plain text body
        html: form['html'], // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

function generateMailHTML(type,movieJSON) {
    let mail = {};
    let subject = '';
    let text = '';
    let html = '';

    switch (type) {
        case 'Welcome':
            subject = 'Bienvenue sur IUT-Project';
            text = 'Merci de vous être inscrit sur notre plateforme.'
            html = `
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                        <h1 style="color: #333333; text-align: center;">Bienvenue sur notre site !</h1>
                        <p style="color: #666666; font-size: 16px; line-height: 1.5;">Merci de vous être inscrit sur notre plateforme. Nous sommes ravis de vous accueillir parmi nous.</p>
                        <p style="color: #666666; font-size: 16px; line-height: 1.5;">N'hésitez pas à parcourir notre site et à découvrir toutes les fonctionnalités que nous proposons.</p>
                        <p style="color: #666666; font-size: 16px; line-height: 1.5;">Si vous avez des questions ou besoin d'aide, n'hésitez pas à nous contacter.</p>
                    </div>
            `;
            break;
        case 'NewMovie':
            subject = 'Nouveau film ajouté';
            text = 'Nous sommes heureux de vous informer qu\'un nouveau film a été ajouté à notre collection.'
            html = `
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                        <h1 style="color: #333333; text-align: center;">Nouveau film ajouté !</h1>
                        <p style="color: #666666; font-size: 16px; line-height: 1.5;">Nous sommes heureux de vous informer qu'un nouveau film a été ajouté à notre collection.</p>
                        <p style="color: #666666; font-size: 20px; line-height: 1;">${movieJSON['title']}</p>
                        <p style="color: #666666; font-size: 20px; line-height: 0;">${movieJSON['description']}</p>
                        <p style="color: #666666; font-size: 20px; line-height: 0;">${movieJSON['releaseDate']}</p>
                        <p style="color: #666666; font-size: 20px; line-height: 0;">${movieJSON['director']}</p>
                    </div>
            `;
            break;
        case 'UpdateMovie':
            subject = 'Un de vos film à été modifié';
            text = 'Nous sommes heureux de vous informer qu\'un des films de votre liste à été modifié.'
            html = `
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                        <h1 style="color: #333333; text-align: center;">Film modifié !</h1>
                        <p style="color: #666666; font-size: 16px; line-height: 1.5;">Nous sommes heureux de vous informer qu'un des films de votre liste à été modifié.</p>
                        <p style="color: #666666; font-size: 20px; line-height: 1;">${movieJSON['title']}</p>
                        <p style="color: #666666; font-size: 20px; line-height: 0;">${movieJSON['description']}</p>
                        <p style="color: #666666; font-size: 20px; line-height: 0;">${movieJSON['releaseDate']}</p>
                        <p style="color: #666666; font-size: 20px; line-height: 0;">${movieJSON['director']}</p>
                    </div>
            `;
            break;
        default:
            html = `
                <p>Hello!</p>
                <p>This is a default message.</p>
            `;
            break;
    }

    mail = {
        'subject': subject,
        'text': text,
        'html': html
    }
    return mail;
}
