<%@ Page Language="CS" AutoEventWireup="true" CodeFile="_default.aspx.cs" Inherits="_default" %>
<!doctype html>
<html>
<head></head>
<body>
	<input type="text" id="message" />
	<input type="button" onclick="sendMessage();" value="Enviar" />
	<div id="log"></div>

	<script src="http://code.xrtml.org/xrtml-3.2.0.js"></script>
	<script>
	    var appkey = 'YOUR_APP_KEY';
	    var url = 'http://ortc-developers.realtime.co/server/2.1';

	    function sendMessage() {
	        var msg = document.getElementById('message').value;

	        xRTML.ConnectionManager.sendMessage({
	            connections: ['myConn'],
	            channel: 'pap:channel1',
	            content: msg
	        });
	    }

	    window.xRTML302 = xRTMLVersions["3.2.0"];

	    xRTML302.load(function () {
	        xRTML302.Config.debug = true;

	        xRTML.ConnectionManager.create(
			{
			    id: 'myConn',
			    appkey: appkey,
			    authToken: 'YOUR_AUTHENTICATION_TOKEN',
			    url: url,
			    channels: [
					{ name: 'pap:channel1' }
			    ]
			}).bind({
			    message: function (e) {
			        var target = document.getElementById('log')
			        var content = target.innerHTML;

			        target.innerHTML = target.innerHTML + '<br />' + e.message;
			    }
			});
	    })

	</script>
</body>
</html>