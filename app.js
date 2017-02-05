var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var index = require('./routes/index');
var users = require('./routes/users');
const request = require('request')
var app = express();
const ACCESS_TOKEN = 'EAACPuCOj3NQBAJtLBy2ohtbVh9qCZCca0x3DJcQFxsi9lNPAXqkTBeCIko0YIciTKtAzRScIdHApbjRrFRjqW3o6EXyCFg0ahuVl7aMsNZCOihj3ZCRgPHtPgZAO2jdwPkCIPY1j0ZC1YGN82Kqs1mZBOpyrvPevfryhKm7kZCVrwZDZD';
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);




app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
    res.send(req.query['hub.challenge'])
  } else {
    res.send('Error, wrong token')
  }
});

app.post('/webhook', function (req, res) {
  
  var data = req.body;
  console.log('webhook');
  // Make sure this is a page subscription
  if (data.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function(entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;

      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        if (event.message.attachments) {
          if(event.message.attachments[0].type === "image"){
           var imageURL = event.message.attachments[0].payload.url;
           console.log(imageURL);
          }
        }
        else if (event.message) {

          receivedMessage(event);
        } else {
          console.log("Webhook received unknown event: ", event);
        }
      });
    });
    console.log('End');
    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know
    // you've successfully received the callback. Otherwise, the request
    // will time out and we will keep trying to resend.
    res.sendStatus(200);
  }
});
function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  console.log("Received message for user %d and page %d at %d with message:", 
    senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));

  var messageId = message.mid;

  var messageText = message.text;
  var messageAttachments = message.attachments;
  console.log('msg')
  if (messageText) {

    // If we receive a text message, check to see if it matches a keyword
    // and send back the example. Otherwise, just echo the text we received.

    switch (messageText) {
      case 'generic':
        sendGenericMessage(senderID);
        break;

      default:
        console.log('prepare to send msg')
        sendTextMessage(senderID, messageText);
    }
  } else if (messageAttachments) {
    sendTextMessage(senderID, "Message with attachment received");
  }
}

function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

// function sendTextMessage(recipientId, messageText) {
//   var messageData = {
//     recipient: {
//       id: recipientId
//     },
//     message: {
//       text: messageText
//     }
//   };
//   console.log('callAPI')
//   callSendAPI(messageData);
// }

function sendGenericMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "rift",
            subtitle: "Next-generation virtual reality",
            item_url: "https://www.oculus.com/en-us/rift/",               
            image_url: "http://messengerdemo.parseapp.com/img/rift.png",
            buttons: [{
              type: "web_url",
              url: "https://www.oculus.com/en-us/rift/",
              title: "Open Web URL"
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for first bubble",
            }],
          }, {
            title: "touch",
            subtitle: "Your Hands, Now in VR",
            item_url: "https://www.oculus.com/en-us/touch/",               
            image_url: "http://messengerdemo.parseapp.com/img/touch.png",
            buttons: [{
              type: "web_url",
              url: "https://www.oculus.com/en-us/touch/",
              title: "Open Web URL"
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for second bubble",
            }]
          }]
        }
      }
    }
  };  

  callSendAPI(messageData);
}

const token = process.env.FB_PAGE_ACCESS_TOKEN
function callSendAPI(messageData) {
  console.log('inapi')
  console.log(token)
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: ACCESS_TOKEN},
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    console.log('yes');
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s", 
        messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
  });  
}
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

module.exports = app;
