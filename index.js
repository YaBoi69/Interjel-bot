const Discord = require('discord.js');
const Sound = require('node-aplay');
const moment = require("moment");

const bot = new Discord.Client();

const token = 'Njg5MDY0OTc2MDM1NDc5NTg0.XnEoFQ.DLf_wZ1gsdRtSQ5TKqfHWhLIzH8';

const PREFIX = '!';

const deurSound = new Sound('deur.mp3');

let usedBelrecently = false;

let usedPikofbalRecently = new Set();

let usedRandyRecently = false;

const leeftijdRandy = moment().year(1987).month(7).day(6);

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg=>{
    if(msg.content === "nice"){
        msg.react('👌')
            }
    if(msg.content.substr(0,1) === "!") {
        let args = msg.content.substring(PREFIX.length).split(" ");
        switch (args[0]) {

            case 'pikofbal':
                if (usedPikofbalRecently.has(msg.author.id)) {
                    msg.reply("Doe rustig a woeshoem");
                } else {
                    msg.channel.send((Math.random() > 0.5) ? "pik" : "bal");
                    usedPikofbalRecently.add(msg.author.id);
                    setTimeout(() => {
                        usedPikofbalRecently.delete(msg.author.id);
                    }, 3000)
                }
                break;

            case 'bel':
                if (usedBelrecently === true) {
                    msg.reply("Doe rustig a woeshoem we gooien shantan die deur open")
                } else {
                    msg.channel.send("DING DONG", {
                        tts: true
                    });
                    msg.member.roles.add('689137029912592385');
                    usedBelrecently = true;
                    setTimeout(() => {
                        usedBelrecently = false;
                    }, 30000)
                }
                break;

            case 'rondje':
                msg.delete();
                if (usedRandyRecently === true) {
                    msg.reply("Randy is al onderweg naar de bar maar hij is druk bezig met mensen lastig vallen!")
                } else {
                    msg.channel.send("EWA IK BEN RANDY EN IK GEEF EEN RONDJE", {files: ["randy.jpg"]});
                    usedRandyRecently = true;
                    setTimeout(() => {
                        usedRandyRecently = false;
                    }, 120000)
                }
                break;

            case 'hoeoudisrandy':
                let diffrence = moment()
                    .subtract(leeftijdRandy.year(), 'years')
                    .subtract(leeftijdRandy.month(), 'month')
                    .subtract(leeftijdRandy.day(), 'days')
                    .add(1, 'month');

                msg.channel.send("Randy is " + diffrence.year() + " jaar, " + diffrence.month() + " maanden en " + diffrence.date() + " dagen");
                break;

            case 'help':
                msg.channel.send("``` LIST OF COMMANDS \n" +
                    "--------------------\n" +
                    "!pikofbal: voor pik of bal \n" +
                    "!bel: om binnen te komen\n" +
                    "!rondje: om Randy een rondje te laten betalen \n" +
                    "!hoeoudisrandy: om Randy zijn leeftijd niet te vergeten```");
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
                break;
            default:
                msg.reply("Deze bestaat niet bro, try die !help als je niet begrijp");
                break;
        }
    }
});


bot.login(token);


