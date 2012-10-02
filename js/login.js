var showAlert = function(message, callback, title, buttonName) {
   navigator.notification.alert(
        message,  		// message
        callback,       // callback
        title,          // title
        buttonName      // buttonName
    );    
};
var showConfirm = function() {
    function onConfirm(button) {
        alert('You selected button ' + button);
    }
    navigator.notification.confirm(
            'You are the winner!',  // message
            onConfirm,              // callback to invoke with index of button pressed
            'Game Over',            // title
            'Restart,Exit'          // buttonLabels
        );    
};
var beep = function() {
    navigator.notification.beep(2);
};
var vibrate = function() {
    navigator.notification.vibrate(0);
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function showLoginError(jqXHR, textStatus, errorThrown) {
					if (jqXHR.status == 401 || jqXHR.status == 403) {				
						if (window.location.href.indexOf("login.html") >= 0) {
							alert("Incorrect email / Password");
						}
						else
							alert("Incorrect email / Password");
					}
					else
					if (errorThrown == 'timeout') {
						if (confirm('Connection timeout.\n\nDo you want to reload this page?'))
							location.href = location.href;
					}
					else if (errorThrown == 'parsererror')
						alert('Error parsing JSON answer from  HelpDeskAPI.');
					
					else if (jqXHR.status == 0)
					{
						alert('Connection failed. Please check your Internet connection.');
					}
					else
					{
						alert( errorThrown + ' ' );
					}
				}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			function checkConnection() {
				var networkState = navigator.network.connection.type;
			
				var states = {};
				states[Connection.UNKNOWN]  = 'Unknown connection';
				states[Connection.ETHERNET] = 'Ethernet connection';
				states[Connection.WIFI]     = 'WiFi connection';
				states[Connection.CELL_2G]  = 'Cell 2G connection';
				states[Connection.CELL_3G]  = 'Cell 3G connection';
				states[Connection.CELL_4G]  = 'Cell 4G connection';
				states[Connection.NONE]     = 'No network connection';
			
				if(states[networkState]==states[Connection.NONE]){// || states[networkState]==states[Connection.UNKNOWN]){
					alert('A network connection is required to access this page.');
					//return false;
				} else {
					//alert(states[networkState]);
					//return true;
				}
			}
			//endregion
			
			//region Storage Functions
			function getStorage(key)
			{
				localStorage.length;
				var value = localStorage.getItem(key);
				if (value && (value.indexOf("{") == 0 || value.indexOf("[") == 0))
				{
					return JSON.parse(value);
				}
				return value;
			}
			
			function setStorage(key, value)
			{
				localStorage.length;
				localStorage.setItem(key, typeof value !== 'string' ? JSON.stringify(value) : value);
			}
			
			function clearStorage()
			{
				localStorage.length;
				localStorage.clear();
			}
			//endregion Storage Functions
			
			//region All pages wide functions
			function checkStorage(changelocation)
			{
				//console.log(changelocation && window.location.href.indexOf("home.html")<0);
				var login      = getStorage("login");
				var pass      = getStorage("password");
				var selected_org = getStorage("organization");
				var selected_inst = getStorage("instance");
			
				if (!login || !pass)
					if (window.location.href.indexOf("login.html")<0)
						{
							{
								window.location.href("login.html");
								return false;
							}
						}
				else
				{
					if (!selected_org || !selected_inst)
					{
						if (window.location.href.indexOf("org_inst.html")<0)
						{
							window.location.href("org_inst.html");
							return false;
						}
					}
					else
					{
						if (changelocation && window.location.href.indexOf("home.html")<0)
						{
							window.location.href("home.html");
							return false;
						}
					}
				}
				return true;
			}
			
			function logout() {
				var login      = getStorage("login");
				//var pass      = getStorage("password");
				clearStorage();
				setStorage("login", login);
				//setStorage("password", pass);
				window.location.replace("login.html");
				return false;
			}
