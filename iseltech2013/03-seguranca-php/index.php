<?php
	error_reporting(E_ALL);
	session_start();
	require('ortc.php');
	 
	/* -------------------- */
	/* REPLACE THESE VALUES */
	/* -------------------- */
	$URL = 'http://ortc-developers.realtime.co/server/2.1';
	$AK = 'YOUR_APP_KEY';// your realtime.co application key
	$PK = 'YOUR_PRIVATE_KEY';// your realtime.co private key
	$TK = 'YOUR_AUTHENTICATION_TOKEN';// token: could be randomly generated in the session
	$CH = 'pap:channel1'; //channel
	$ttl = 180; 
	$isAuthRequired = false;
	$result = false;
	/* -------------------- */
	/*        END           */
	/* -------------------- */
	     
	$realtime = new Realtime( $URL, $AK, $PK, $TK );  

	$result = $realtime->auth(array($CH => 'w'), $ttl); //post authentication permissions. w -> write; r -> read
	echo 'authentication status '.( $result ? 'success' : 'failed' ).'<br/>';

	if($result){
		$result = $realtime->send($CH, "Hello PAP", $response);
		echo ' send status '.( $result ? 'success' : 'failed' ).'<br/>';
	}    
?>

<!doctype html>
<html>
<head></head>
<body>
	<input type="text" id="message" />
	<input type="button" onclick="sendMessage();" value="Enviar" />
	<div id="log"></div>

	<script src="http://code.xrtml.org/xrtml-3.2.0.js"></script>
	<script>
		function sendMessage(){
			var msg = document.getElementById('message').value;

			xRTML.ConnectionManager.sendMessage({
				connections: ['myConn'],
				channel: '<?=$CH?>',
				content: msg
			});
		}

		window.xRTML302 = xRTMLVersions["3.2.0"];
		
		xRTML302.load(function() {
			xRTML302.Config.debug = true;

			xRTML.ConnectionManager.create(
			{
				id: 'myConn',
				appkey: '<?=$AK ?>',
				authToken: '<?=$TK?>',
				url: '<?=$URL?>',
				channels: [
					{name: '<?=$CH?>'}
				]
			}).bind({
				message: function(e){
					var target = document.getElementById('log')
					var content = target.innerHTML;

					target.innerHTML = target.innerHTML + '<br />' + e.message;
				}
			});
		})

	</script>
</body>
</html>