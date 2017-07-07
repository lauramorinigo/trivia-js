/*

Slash Webtasks: Extend Slack with Node.js, powered by Auth0 Webtasks (https://webtask.io)
For documentation, go to https://github.com/auth0/slash
You can find us on Slack at https://webtask.slack.com (join via http://chat.webtask.io)

*/

'use latest';

var MongoClient = require('mongodb').MongoClient;

module.exports = function (context, cb) {
  
  var MONGO_URL = context.data.MONGO_URL;
  if (!MONGO_URL) return cb(new Error('MONGO_URL missing'));
  
   
    MongoClient.connect(MONGO_URL, (err, db)=>{
        if(err) return cb(err);

        db.collection('trivia')
          .aggregate( [ { $sample: { size: 1 } } ])
          .toArray(function(err, challenges){
            if(err) return cb(err);
            db.close();
            cb(null, {
              text:'*Hello*, here is a new challenge about *'+challenges[0].subject+'* , keep rocking and coding!  ',
              "attachments": [
                    {
                        "title":  challenges[0].question,
                         "color": "#36a64f",
                         "mrkdwn_in": ["text", "pretext"],
                           "actions": [
            
                            {
                                "name": "btn-answer",
                                "text": "Answer",
                                "type": "button",
                                "value": "war",
                                "confirm": {
                                    "title": "Answer",
                                    "text": challenges[0].answer,
                                    "ok_text": "Got it!"
                                }
                            }
                        ]
                    }
                ]

            });
          });
    });

    

};