# AWS Launcher

AWS Launcher is a simple Amazon Web Services Proxy written in Angularjs, for launch Wordpress based amis instances.

## Installation:

1) Install nodejs

2) npm install

3) npm start

4) localhost:9000


## Configuration:

1) Set your client id in index.html:
    amazon.Login.setClientId('CLIENT_ID');

2) Set your role in app.js
    RoleArn: 'ROLE',


## Notes:

- Only 1 active instance is allowed (using free tier amazon)
- User must be logged through Amazon