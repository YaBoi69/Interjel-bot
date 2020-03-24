const Discord = require('discord.js');
const Sound = require('node-aplay');
const moment = require("moment");
const birthdays = require("./birthdays.json");

const bot = new Discord.Client();

const token = 'Njg5MDY0OTc2MDM1NDc5NTg0.XnEoFQ.DLf_wZ1gsdRtSQ5TKqfHWhLIzH8';

const PREFIX = '!';

const deurSound = new Sound('deur.mp3');

let usedBelrecently = false;

let usedPikofbalRecently = new Set();

let usedRandyRecently = false;

let voorDeDeur = new Set();

let inInterjel = new Set();

const leeftijdRandy = moment().year(1987).month(7).day(6);

const binnenRole = '689137029912592385';

const voordeurChannel = '689134930588205067';

const interjelChannel = '688797072668885091';

const barChannel = '688798601320726564';

const rokersRuimte = '688797215333810192';

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`);
});
bot.on('voiceStateUpdate', (oldState, newState)=>{
    const joinedChannel = newState.channelID;
    const leftChannel = oldState.channelID;
    if (joinedChannel === voordeurChannel){
        voorDeDeur.add(newState.member.id);
    }
    if (leftChannel === voordeurChannel){
        voorDeDeur.delete(oldState.member.id);
    }
    if ((leftChannel === interjelChannel || leftChannel === barChannel || leftChannel === rokersRuimte)&& (joinedChannel !== interjelChannel || joinedChannel !== barChannel || joinedChannel !== rokersRuimte)){
        inInterjel.delete(oldState.member.id);
    }
    if (joinedChannel === interjelChannel || joinedChannel === barChannel || joinedChannel ===  rokersRuimte){
        if (inInterjel.has(newState.member.id)){
            console.log("ai nee je bent gebald")
        }else {
            inInterjel.add(newState.member.id);
        }
    }
    if (joinedChannel === null && leftChannel !== null){
        oldState.member.roles.remove(binnenRole);
    }
});
bot.on('message', msg=>{
    if(msg.content === "nice" || msg.content === "Nice"){
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
                if(voorDeDeur.has(msg.author.id)){
                    if (usedBelrecently === true) {
                        msg.reply("Doe rustig a woeshoem we gooien shantan die deur open")
                    } else {
                        msg.channel.send("DING DONG", {
                            tts: true
                        });
                        msg.member.roles.add(binnenRole);
                        usedBelrecently = true;
                        setTimeout(() => {
                            usedBelrecently = false;
                        }, 30000)
                    }
                }else {
                    msg.reply("Wat denk jij, je kan toch niet aanbellen als je niet voor de deur staat a dommert.")
                }
                break;

            case 'rondje':
                msg.delete();
                if(inInterjel.has(msg.author.id)) {
                    if (usedRandyRecently === true) {
                        msg.reply("Randy is al onderweg naar de bar maar hij is druk bezig met mensen lastig vallen!")
                    } else {
                        msg.channel.send("EWA IK BEN RANDY EN IK GEEF EEN RONDJE", {files: ["randy.jpg"]});
                        usedRandyRecently = true;
                        setTimeout(() => {
                            usedRandyRecently = false;
                        }, 120000)
                    }
                }else{
                    msg.reply("Hoe kan Randy nou rondje geven als jij er niet eens bent a dommert")
                }
                break;

            case 'hoeoudis':
                let huts = false;

                if(args[1] !== null || args[1] !== undefined || args[1]){

                        for (let birthday in birthdays) {

                            if (birthdays[birthday].firstname === args[1]) {

                                let verjaardag = birthdays[birthday].birth.split("-");
                                const year = verjaardag[0];
                                const month = verjaardag[1];
                                const day = verjaardag[2];
                                const leeftijd = moment().year(year).month(month).date(day);

                                let diffrence = moment()
                                    .subtract(leeftijd.year(), 'years')
                                    .subtract(leeftijd.month(), 'month')
                                    .subtract(leeftijd.date(), 'days')
                                    .add(1, 'month');

                                msg.channel.send(birthdays[birthday].firstname + " is " + diffrence.year() + " jaar, " + diffrence.month() + " maanden en " + diffrence.date() + " dagen");
                                huts = true;
                                break;
                            }
                        }
                        if(!huts) {
                            msg.reply("Deze man is off-radar, welloe stats ready.");
                        }
                }else{
                    msg.reply("Moet je wel een naam invoeren, debiel");
                    break;
                }
                break;

            case 'hoeoudisrandy':
                msg.reply("Deze is deprecated man broer je heb nu andere die wel goed werkt, huts !help voor een cadeau van Niels Rietkerk");
                // let diffrence = moment()
                //     .subtract(leeftijdRandy.year(), 'years')
                //     .subtract(leeftijdRandy.month(), 'month')
                //     .subtract(leeftijdRandy.day(), 'days')
                //     .add(1, 'month');
                //
                // msg.channel.send("Randy is " + diffrence.year() + " jaar, " + diffrence.month() + " maanden en " + diffrence.date() + " dagen");
                break;

            case 'help':
                msg.channel.send("``` LIST OF COMMANDS \n" +
                    "--------------------\n" +
                    "!pikofbal: voor pik of bal \n" +
                    "!bel: om binnen te komen\n" +
                    "!rondje: om Randy een rondje te laten betalen \n" +
                    "!hoeoudis [name]: om iemand zijn leeftijd niet te vergeten```");
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


