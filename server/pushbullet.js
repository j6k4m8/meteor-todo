pushbullet = function(_params) {
    if (!Meteor.settings.PUSHBULLET_API_KEY) {
        throw new Meteor.Error(401, "No token found. Add one as 'PUSHBULLET_API_KEY' to settings.json.");
    }
    var result = HTTP.call('POST', 'https://api.pushbullet.com/v2/pushes', {
        params: _params,
        headers: {
            "Authorization": "Bearer " + Meteor.settings.PUSHBULLET_API_KEY
        }
    });
    return result;
};
