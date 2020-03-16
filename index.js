const Discord = require('discord.js');
const Sound = require('node-aplay');

const bot = new Discord.Client();

const token = 'Njg5MDY0OTc2MDM1NDc5NTg0.Xm9cFg.zseqT1YSofxuJhl72lEewlit3Pc';

const PREFIX = '!';

const deurSound = new Sound('deur.mp3');

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg=>{
    if(msg.content === "nice"){
        msg.react('🤔')
    }
    let args = msg.content.substring(PREFIX.length).split(" ");


    switch(args[0]){
        case 'pikofbal':
            msg.channel.send((Math.random() > 0.5)? "pik" : "bal");
            break;
        case 'bel':
            const role = msg.guild.roles.fetch('689137029912592385');
            let connection = msg.member.voice.channel.join();
            console.log(role);
           // msg.member.addRole(role.id);
            let player = connection.playStream(deurSound);
            msg.channel.send("Deur", {
                tts: true
            });
            break;
    }
});

bot.login(token);


