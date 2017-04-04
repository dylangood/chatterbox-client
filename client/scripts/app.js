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
  $.ajax({
    url: 'http://parse.sfs.hackreactor.com/chatterbox/classes/messages',
    type: 'GET',
    data: {},
    contentType: 'application/json',  // ??? <-- Change?
    success: function (data) {
      console.log('chatterbox: Message received');
      _.each( data.results, function( message ){
        app.renderMessage({
          username: message.username,
          text: message.text,
          roomname: message.roomname
        });
      });
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to get message', data);
    }
  });
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

app.renderRoom = function(string) {
  var $rooms = $('#roomSelect');
  var option = ('<option value="' + string + '" class="room">' + string + '</option>');
  $rooms.append(option);
};
