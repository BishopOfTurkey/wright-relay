const login = require('facebook-chat-api');
const config = require('./config.json');

// Create simple echo bot
login({email: config['email'], password: config['password']}, (err, api) => {
    if(err) return console.error(err);

    api.listen((err, message) => {
        console.log(message)
        if (err) return console.error(err);

        if (message.threadID == config['groupchat1']) {
            sendWithName(config['groupchat2']);
        } else if (message.threadID == config['groupchat2']) {
            sendWithName(config['groupchat1']);
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
