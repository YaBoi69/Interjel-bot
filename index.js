const Discord = require('discord.js');
const Sound = require('node-aplay');

const bot = new Discord.Client();

const token = 'Njg5MDY0OTc2MDM1NDc5NTg0.Xm9cFg.zseqT1YSofxuJhl72lEewlit3Pc';

const PREFIX = '!';

const deurSound = new Sound('deur.mp3');

let usedBelrecently = false;

let usedPikofbalRecently = new Set();

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg=>{
    //console.log(msg.emoji.id);
    if(msg.content === "nice"){
        msg.react(':ok_hand:')
            }
    let args = msg.content.substring(PREFIX.length).split(" ");

    switch(args[0]){

        case 'pikofbal':
            if(usedPikofbalRecently.has(msg.author.id)){
                msg.reply("Doe rustig a woeshoem, kut Ivar");
            }else {
                msg.channel.send((Math.random() > 0.5)? "pik" : "bal");
                usedPikofbalRecently.add(msg.author.id);
                setTimeout(() =>{
                    usedPikofbalRecently.delete(msg.author.id);
                }, 3000)
            }
            break;

        case 'bel':
            if(usedBelrecently === true){
                msg.reply("Doe rustig a woeshoem we gooien shantan die deur open")
            }else {
                msg.channel.send("DING DONG", {
                    tts: true
                });
                msg.member.roles.add('689137029912592385');

                usedBelrecently = true;
                setTimeout(() =>{
                    usedBelrecently = false;
                }, 50000)
            }
            break;

        case 'test':

            // msg.delete();
            // bot.users.fetch().then((bigher) => {
            //     console.log(bigher);
            // }).catch((error) =>{
            //     console.log(error);
            // });
            // break;

        // case 'bel69':
        //     const role = msg.guild.roles.fetch('689137029912592385');
        //     let connection = msg.member.voice.channel.join();
        //     console.log(role);
        //    // msg.member.addRole(role.id);
        //     let player = connection.playStream(deurSound);
        //     msg.channel.send("Deur", {
        //         tts: true
        //     });
        //     break;
    }
});

bot.login(token);


