const login = require("facebook-chat-api");

// Create simple echo bot
login({email: "wrightrelay@protonmail.com", password: "RjF81ZJs!la&qT8wS"}, (err, api) => {
    if(err) return console.error(err);

    api.listen((err, message) => {
        console.log(message)
        if (err) return console.error(err);

        if (message.threadID == '2230705296989694') { // GC1
            sendWithName('2050336258412519');
        } else if (message.threadID == '2050336258412519') { //GC2
            sendWithName('2230705296989694');
        }
        
        function sendWithName (chat) {
            id = message.senderID

            api.getUserInfo(id, (err, ret) => {
                if (err) return console.error(err);
                
                let newMsg= {
                    body: ret[id].firstName + ': ' + message.body
                }

                api.sendMessage(newMsg, chat, (err, info) => {
                    if (err) return console.error(err);
                    if (message.attachments.length != 0) {
                        message.attachments.forEach((i, arr) => {
                            if (arr[i].type == 'photo') {
                                api.forwardAttachment(arr[i].ID, chat);
                            }
                        }) 
                    }
                });
                
            });
        }
    });
});