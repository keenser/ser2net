chrome.app.runtime.onLaunched.addListener(function() {
  new Window();
});

var Window = function() {
  var connectedSerialId = 0;
  chrome.app.window.create(
    'index.html',
    {
      outerBounds: {
        width: 1024,
        height: 768,
        minWidth: 1024,
        minHeight: 768
      }
    },
    function(win) {
      win.contentWindow.AddConnectedSerialId = function(id) {
        connectedSerialId = id;
      };
      win.onClosed.addListener(function() {
        chrome.serial.disconnect(connectedSerialId, function () {
        });
      });
    }
  );
}
