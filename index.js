const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const { OpenAI } = require('openai');

const app = express();
const client = new Client({ 
    authStrategy: new LocalAuth(),
    puppeteer: { args: ['--no-sandbox', '--disable-setuid-sandbox'] }
});
const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

client.on('qr', qr => {
    console.log('امسح هذا الكود بواتسابك:');
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => console.log('البوت شغال 100%'));

client.on('message', async msg => {
    if(msg.fromMe) return;
    try {
        const chat = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {role:'system', content:'انت موظف عراقي بمحل ملابس اسمه أناقة بغداد بالكرادة شارع العرصات. الدوام 10ص-10م. تيشيرت 15 الف، بنطرون 25 الف. رد بلهجة عراقية قصيرة'},
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
app.get('/', (req,res) => res.send('Bot is running'));
app.listen(3000, () => console.log('Server started'));
