const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const Groq = require('groq-sdk');

const app = express();
const port = process.env.PORT || 3000;

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
        ]
    }
});
    puppeteer: { 
        headless: true,
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ]
    }
});

const groq = new Groq({ apiKey: process.env.GROQ_KEY });

client.on('qr', qr => {
    console.log('امسح هذا الكود بواتسابك:');
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => console.log('البوت شغال 100% على Groq'));

client.on('message', async msg => {
    if(msg.fromMe) return;
    try {
        const chat = await groq.chat.completions.create({
            model: 'llama-3.1-8b-instant',
            messages: [
                {
                    role:'system', 
                    content:'انت موظف عراقي بمحل ملابس اسمه أناقة بغداد بالكرادة شارع العرصات. الدوام 10ص-10م. تيشيرت 15 الف، بنطرون 25 الف، قميص 20 الف. رد بلهجة عراقية قصيرة وحبابة. لاتطول بالرد.'
                },
                {role:'user', content: msg.body}
            ]
        });
        msg.reply(chat.choices[0].message.content);
    } catch(e) {
        console.log(e);
        msg.reply('صار خطأ حبيبي، جرب بعد شوية');
    }
});

client.initialize();

app.get('/', (req,res) => res.send('Bot is running on Groq'));
app.listen(port, () => console.log(`Server started on ${port}`));
