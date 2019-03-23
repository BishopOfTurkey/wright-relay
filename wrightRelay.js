const login = require("facebook-chat-api");

// Create simple echo bot
login({email: "wrightrelay@protonmail.com", password: "RjF81ZJs!la&qT8wS"}, (err, api) => {
    if(err) return console.error(err);

    api.listen((err, message) => {
        console.log(message)
        if (err) return console.err(err);

        if (message.threadID == '2230705296989694') { // GC1
            sendWithName('2050336258412519');
        } else if (message.threadID == '2050336258412519') { //GC2
            sendWithName('2230705296989694');
        }
        
        function sendWithName (chat) {
            id = message.senderID
            api.getUserInfo(id, (err, ret) => {
                if (err) return console.err(err);
                api.sendMessage(ret[id].firstName + ': ' + message.body, chat);
            });
        }
    });
});