using System;
using System.Configuration;
using System.Collections.Generic;
using Ibt.Ortc.Api;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class _default : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        string OrtcApplicationKey = "YOUR_APP_KEY";
        string OrtcPrivateKey = "YOUR_PRIVATE_KEY";
        string OrtcAuthenticationToken = "YOUR_AUTHENTICATION_TOKEN";
        string OrtcServer = "http://ortc-developers.realtime.co/server/2.1";
        int ttl = 604800;
                
        Dictionary<string, ChannelPermissions> permissions = new Dictionary<string, ChannelPermissions>();
        permissions.Add("pap:channel1", ChannelPermissions.Read);

		Ortc.SaveAuthentication(OrtcServer, true, OrtcAuthenticationToken, false, OrtcApplicationKey, ttl, OrtcPrivateKey, permissions);
    }
}