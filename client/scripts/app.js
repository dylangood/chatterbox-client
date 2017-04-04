var app = {};

app.init = function() {
  //stuff
};

app.send = function(message) {
  $.ajax({
    url: 'http://parse.sfs.hackreactor.com/chatterbox/classes/messages',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.fetch = function() {
  var recent = new Date(Date.now() - 50000);
  console.log(recent.toISOString());
  $.ajax({
    url: 'http://parse.sfs.hackreactor.com/chatterbox/classes/messages',
    type: 'GET',
    data: 'order=-createdAt',
    // "createdAt":{"$gte":"' + recent.toISOString() + '"}
    // "2017-02-08T21:34:13.062Z"
    contentType: 'application/json',  // ??? <-- Change?
    success: function (data) {
      console.log('chatterbox: Message received');
      app.aggregateMessages(data.results);
      var arr = [];

      _.each( data.results, function(value) {
        arr.push(value.roomname);
      });
      arr = _.uniq(arr);
      _.each( arr, function(room) {
        app.renderRoom(room);
      });

    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to get message', data);
    }
  });
};

app.messages = [];

app.aggregateMessages = function(messages) {
  _.each( messages, function(message){
    app.messages.push( {
      username: message.username,
      text: message.text,
      roomname: message.roomname,
      objectId: message.objectId,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt
    });
  });
  app.messages.reverse();
};

app.clearMessages = function() {
  var $chats = $('#chats');
  $chats.empty();
};

app.renderMessage = function(message) {
  var $chats = $('#chats');
  var div = ('<div class="message"><div class="username">' + message.username + '</div><div class="chat">' + message.text + '</div></div>');
  $chats.prepend(div);
};

app.renderRoom = function(room) {
  var option = ('<option value="' + room + '" class="room">' + room + '</option>');
  var $rooms = $('#roomSelect');
  if ( _.indexOf($rooms, room) < 0 ) {
    $rooms.append(option);
  }
};

setInterval( function(){
  app.fetch();
  app.clearMessages();
  _.each( app.messages, function(message) {
    app.renderMessage(message);
  });
  app.messages = [];
} , 1000);
