var app = {};

app.messages = [];
app.rooms = [];

app.init = function() {
  app.clearMessages();
  app.fetch();
  _.each( app.messages, function(message) {
    app.renderMessage(message);
  });
  app.messages = [];
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
//  var recent = new Date(Date.now() - 50000);
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
      app.findRooms(data.results);
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to get message', data);
    }
  });
};

app.findRooms = function(messages) {
  _.each( messages, function(value) {
    if ( !app.rooms.includes(value.roomname) ) {
      app.rooms.push(value.roomname);
    }
  });
  _.each( app.rooms, function(room) {
    console.log('r');
    app.renderRoom(room);
  });
};

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
  var $roomSelect = $('#roomSelect');
  var $selectSize = $('#roomSelect option').size();
  if ( $selectSize < app.rooms.length ) {
    $roomSelect.append(option);
  }
};

setInterval( function(){
  app.clearMessages();
  app.fetch();
  _.each( app.messages, function(message) {
    app.renderMessage(message);
  });
  app.messages = [];
} , 1000);
