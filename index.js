const Discord = require('discord.js');
const moment = require("moment");
const birthdays = require("./birthdays.json");
const ytdl = require("ytdl-core");

const bot = new Discord.Client();

const token = 'Njg5MDY0OTc2MDM1NDc5NTg0.XnEoFQ.DLf_wZ1gsdRtSQ5TKqfHWhLIzH8';

const PREFIX = '!';

const queue = new Map();

let usedBelrecently = new Set();

let usedPikofbalRecently = new Set();

let usedRandyRecently = false;

let voorDeDeur = new Set();

let inInterjel = new Set();

const binnenRole = '689137029912592385';

const pikenbalRole = '692145440501661826';

const voordeurChannel = '689134930588205067';

const interjelChannel = '688797072668885091';

const barChannel = '688798601320726564';

const rokersRuimte = '688797215333810192';

const belLink = 'https://www.youtube.com/watch?v=6mkydT2N-t0';

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

bot.on('message', async msg=>{
    if(msg.content === "nice" || msg.content === "Nice") msg.react('👌');
    if(msg.content.startsWith("/")) msg.delete();
    if(!msg.content.startsWith(PREFIX)) return;

    let args = msg.content.substring(PREFIX.length).split(" ");
    const serverQueue = queue.get(msg.guild.id);
    switch (args[0]) {


        case 'pikofbal':

            if (usedPikofbalRecently.has(msg.author.id)) {
                msg.reply("Doe rustig a woeshoem.");
            } else {
                const message = (Math.random() < 0.01) ? "pik en bal" :(Math.random() > 0.5) ? "pik" : "bal";
                msg.channel.send(message);
                if(message === "pik en bal"){
                    msg.reply("Gefeliciflapstaart a mattie, je hebt een verstopte command gevonden, probeer !pikenbal voor een verrassing.");
                    msg.member.roles.add(pikenbalRole);
                }

                if (!msg.member._roles.includes(pikenbalRole)) {
                    usedPikofbalRecently.add(msg.author.id);
                    setTimeout(() => {
                        usedPikofbalRecently.delete(msg.author.id);
                        }, 3000)
                }
            }
            break;

        case 'pikenbal':

            if (msg.member._roles.includes(pikenbalRole)) {
                msg.channel.send("pik en bal");
            }
            break;

        case 'bel':

            if(voorDeDeur.has(msg.author.id)){

                if (usedBelrecently.has(msg.author.id)) {
                    msg.reply("Doe rustig a woeshoem we gooien shantan die deur open.")
                } else {
                    msg.channel.send("DING DONG", {
                        tts: true
                    });
                    execute(msg, serverQueue);
                    msg.member.roles.add(binnenRole);
                    usedBelrecently.add(msg.author.id);
                    setTimeout(() => {
                        usedBelrecently.delete(msg.author.id);
                    }, 120000)
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
                    msg.channel.send("EWA IK BEN RANDY EN IK GEEF EEN RONDJE!", {files: ["randy.jpg"]});
                    usedRandyRecently = true;
                    setTimeout(() => {
                        usedRandyRecently = false;
                    }, 120000)
                }
            }else{
                msg.reply("Hoe kan Randy nou rondje geven als jij er niet eens bent a dommert.")
            }
            break;

        case 'hoeoudis':
            let huts = false;

            if(args[1]){

                    for (let birthday in birthdays) {

                        if (birthdays[birthday].firstname === args[1]) {

                            let verjaardag = birthdays[birthday].birth.split("-");
                            const year = verjaardag[0];
                            const month = verjaardag[1];
                            const day = verjaardag[2];

                            let diffrence = moment()
                                .subtract(year, 'years')
                                .subtract(month, 'month')
                                .subtract(day, 'days')
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
                msg.reply("Moet je wel een naam invoeren, debiel.");
                break;
            }
            break;

        case 'hoeoudisrandy':
            msg.reply("Deze is buiten gebruik man broer je heb nu andere die wel goed werkt, huts !help voor een cadeau van Niels Rietkerk.");
            break;

        case 'hoedomisrinus':
            msg.reply("KANKER DOM");
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
            break;
            execute(msg, serverQueue);
            break;

        case 'stop':
            break;
            stop(msg, serverQueue);
            break;

        case 'skip':
            break;
            skip(msg, serverQueue);
            break;

        case 'queue':
            break;
            let queue = queueArray(msg, serverQueue);
            let string = '```';
            let counter = 1;
            for(let i=0;i<queue.length; i++){
                string += counter +". "+ queue[i].title + "\n";
                counter++;
            }
            msg.channel.send(string + " end of queue```");
            break;

        default:
            msg.reply("Deze bestaat niet bro, try die !help als je niet begrijp");
            break;
    }
});

async function execute(message, serverQueue) {
    const voiceChannel = await bot.channels.fetch(interjelChannel);

    if (!voiceChannel)
        return message.channel.send(
            "You need to be in a voice channel to play music!"
        );

    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.channel.send(
            "I need the permissions to join and speak in your voice channel!"
        );
    }

    const songInfo = await ytdl.getInfo(belLink);
    const song = {
        title: songInfo.title,
        url: songInfo.video_url
    };

    if (!serverQueue) {
        const queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        };

        queue.set(message.guild.id, queueContruct);

        queueContruct.songs.push(song);

        try {
            var connection = await voiceChannel.join();
            queueContruct.connection = connection;
            play(message.guild, queueContruct.songs[0]);
        } catch (err) {
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send(err);
        }
    } else {
        serverQueue.songs.push(song);
        return message.channel.send(`${song.title} has been added to the queue!`);
    }
}

function skip(message, serverQueue) {
    if (!message.member.voice.channel)
        return message.channel.send(
            "You have to be in a voice channel to stop the music!"
        );
    if (!serverQueue)
        return message.channel.send("There is no song that I could skip!");
    serverQueue.connection.dispatcher.end();
}

function queueArray(message, serverQueue){
    return serverQueue.songs
}

function stop(message, serverQueue) {
    if (!message.member.voice.channel)
        return message.channel.send(
            "You have to be in a voice channel to stop the music!"
        );
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
    const serverQueue = queue.get(guild.id);
    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }

    const dispatcher = serverQueue.connection
        .play(ytdl(song.url))
        .on("finish", () => {
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        })
        .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}


bot.login(token);


