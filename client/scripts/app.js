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
  var fetchedData;
  $.ajax({
    url: 'http://parse.sfs.hackreactor.com/chatterbox/classes/messages',
    type: 'GET',
    data: {},
    contentType: 'application/json',  // ??? <-- Change?
    success: function (data) {
      console.log('chatterbox: Message received');
      fetchedData = data.results;
      console.log(fetchedData);
      console.log('inside^^^^^^^^^^^^');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to get message', data);
    }
  });
        console.log('outsideeeeeee');
  console.log(fetchedData);
  return fetchedData;
};

app.clearMessages = function() {
  var $chats = $('#chats');
  $chats.empty();
};

app.renderMessage = function(message) {
  var $chats = $('#chats');
  console.log($chats);
  $chats.append(message);
};

app.renderRoom = function(string) {
  //
};
