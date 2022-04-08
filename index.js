let TelegramBot = require('node-telegram-bot-api');

let token = '5118460827:AAHT45ttJrncHa1-h1lKqeAMaQevZ1fVCfQ';
let bot = new TelegramBot(token, {
    polling: true
});

let greeting_keyboard = {
    "reply_markup": {
        "keyboard": [
            ["💬 Поставити запитання"]
        ]
    },
    parse_mode: "HTML"
};

let hashtags_keyboard = {
    "reply_markup": {
        "keyboard": [
            ["/stop"],
            ["#git", "#js", "#html"],
            ["#css", "#bootstrap", "#vscode"],
            ["#gitlab", "#webstorm", "#scss"],
            ["#sass", "#less", "#scrum"],
            ["#bem", "#jquery"]
        ]
    },
    parse_mode: "HTML"
};

let finish_keyboard = {
    "reply_markup": {
        "keyboard": [
            ["✈ Надіслати"],
            ["#⃣ Додати хештеги"],
            ["❌ Скасувати питання"]
        ]
    },
    parse_mode: "HTML"
};

const users_list = [{
    uid: 8521348654,
    tags_array: [],
    question_msg: "",
    polling_process: false,
    writing_message: false,
    adding_hashtags: false
}, {
    uid: 2983654986,
    tags_array: [],
    question_msg: "",
    polling_process: false,
    writing_message: false,
    adding_hashtags: false
}];

bot.on("message", function (msg) {
    let chatID = msg.chat.id;
    
    if (users_list.filter(user => String(user.uid) == chatID).length == 0) {
        users_list.push({
            uid: chatID,
            tags_array: [],
            question_msg: "",
            polling_process: false,
            writing_message: false,
            adding_hashtags: false
        });
    }
    if (msg.text == "/start") {
        bot.sendMessage(chatID, '<b>Вас вітає <i>EPAM [QA] BOT</i> 😊!</b>\n\nДля того, щоб поставити запитання, оберіть пункт в меню:\n[<b>💬 Поставити запитання</b>]', greeting_keyboard);
    }
    if (msg.text == "💬 Поставити запитання") {
        bot.sendMessage(chatID, "⌨ Надішліть ваше питання ⌨", {
            "reply_markup": {
                remove_keyboard: true
            }
        });
        
        users_list.filter(user => String(user.uid) == chatID)[0].polling_process = true;
        users_list.filter(user => String(user.uid) == chatID)[0].writing_message = true;
        return;
    }
    
    if (users_list.filter(user => String(user.uid) == chatID)[0].polling_process) {
        if (users_list.filter(user => String(user.uid) == chatID)[0].writing_message == true && users_list.filter(user => String(user.uid) == chatID)[0].adding_hashtags == false) {
            users_list.filter(user => String(user.uid) == chatID)[0].question_msg = `<b>📍Питання</b>\n- - - - - - - - - - - - - - -\n${msg.text}\n- - - - - - - - - - - - - - -\n`;
            bot.sendMessage(chatID, "Так вигладає ваше питання:\n\n" + users_list.filter(user => String(user.uid) == chatID)[0].question_msg, {
                parse_mode: "HTML"
            });
            setTimeout(() => {
                bot.sendMessage(chatID, "<b>#⃣ Додайте хештеги до питання</b>\n\n1) Щоб зупинити додавання хештегів, напишіть <code>/stop</code> у чат.\n2)Щоб додати свій хештег, напишіть його таким чином <code>#назва</code>", hashtags_keyboard);
                users_list.filter(user => String(user.uid) == chatID)[0].writing_message = false;
                users_list.filter(user => String(user.uid) == chatID)[0].adding_hashtags = true;
            }, 500);
            return;
        }
        if (users_list.filter(user => String(user.uid) == chatID)[0].adding_hashtags && msg.text.indexOf("#") != -1) {
            users_list.filter(user => String(user.uid) == chatID)[0].tags_array.push(msg.text);
            return;
        }
        if (msg.text == "/stop") {
            users_list.filter(user => String(user.uid) == chatID)[0].adding_hashtags = false;            
            setTimeout(() => {
                bot.sendMessage(chatID, "Так вигладає ваше питання:\n\n" + users_list.filter(user => String(user.uid) == chatID)[0].question_msg + users_list.filter(user => String(user.uid) == chatID)[0].tags_array.join(" "), {
                    "parse_mode": "HTML",
                    disable_web_page_preview: true
                });
            }, 500);
            setTimeout(() => {
                bot.sendMessage(chatID, "Якщо ви закінчили, то оберіть пункт меню: ", finish_keyboard);
            }, 1000);
            return;
        }
        if (msg.text == "❌ Скасувати питання") {
            users_list.filter(user => String(user.uid) == chatID)[0].adding_hashtags = false;
            users_list.filter(user => String(user.uid) == chatID)[0].question_msg = "";
            users_list.filter(user => String(user.uid) == chatID)[0].tags_array = [];
            users_list.filter(user => String(user.uid) == chatID)[0].polling_process = false;
            bot.sendMessage(chatID, "<b>❌ Питання анульовано ❌</b>\n\nДля того, щоб поставити нове запитання, оберіть пункт в меню:\n[<b>💬 Поставити запитання</b>]", greeting_keyboard);
            return;
        }
        if (msg.text == "#⃣ Додати хештеги") {
            bot.sendMessage(chatID, "<b>#⃣ Додайте хештеги до питання</b>\n\n1) Щоб зупинити додавання хештегів, напишіть <code>/stop</code> у чат.\n2)Щоб додати свій хештег, напишіть його таким чином <code>#назва</code>", hashtags_keyboard);
            users_list.filter(user => String(user.uid) == chatID)[0].adding_hashtags = true;
            return;
        }
        if (msg.text == "✈ Надіслати") {
            users_list.filter(user => String(user.uid) == chatID)[0].question_msg = users_list.filter(user => String(user.uid) == chatID)[0].question_msg + users_list.filter(user => String(user.uid) == chatID)[0].tags_array.join(" ");
            bot.sendMessage(chatID, "✈ <b>Ваше питання надіслано!</b>", greeting_keyboard);
            setTimeout(() => {
                bot.sendMessage("-1001589326978", users_list.filter(user => String(user.uid) == chatID)[0].question_msg, {
                    "parse_mode": "HTML",
                    disable_web_page_preview: true
                });
            }, 500);
            setTimeout(() => {
                users_list.filter(user => String(user.uid) == chatID)[0].adding_hashtags = false;
                users_list.filter(user => String(user.uid) == chatID)[0].question_msg = "";
                users_list.filter(user => String(user.uid) == chatID)[0].tags_array = [];
                users_list.filter(user => String(user.uid) == chatID)[0].polling_process = false;
            }, 1000);
            return;
        }
    }
});