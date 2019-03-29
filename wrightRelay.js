const APP_STATE_FILE = './state.json';
const CONFIG_FILE = './config.json';

const fs = require('fs');
const readline = require("readline");
const login = require('facebook-chat-api');

const config = require(CONFIG_FILE);

let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let appState;

try {
  appState = JSON.parse(fs.readFileSync(APP_STATE_FILE));
} catch (error) {
  console.log('Couldn\'t find appState. Continuing without it.');
}

// Create simple echo bot
login({email: config['email'], password: config['password'], appState: appState}, (err, api) => {
  if(err) {
    switch (err.error) {
      case 'login-approval':
        console.log('Enter code > ');

        rl.on('line', (line) => {
          err.continue(line);
          rl.close();
        });

        break;
      default:
        console.error(err);
    }

    return;
  }

  fs.writeFileSync(APP_STATE_FILE, JSON.stringify(api.getAppState()));

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

        let newMsg = {};

        if (message.type == 'message') {
          newMsg['body'] = ret[id].firstName + ': ' + message.body;
        } else if (message.type == 'photo') {
          // do nothing
        } else {
          console.log(`Unknown message type ${message.type}`);
        }

        api.sendMessage(newMsg, chat, (err, info) => {
          if (err) return console.error(err);

          message.attachments.forEach((msg) => {
            if (msg.type == 'photo') {
              api.forwardAttachment(msg.ID, chat);
            }
          }) 
        });
      });
    }
  });
});
