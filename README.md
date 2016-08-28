# AWS Launcher

AWS Launcher is a simple Amazon Web Services Proxy written in Angularjs, for launch Wordpress based amis instances.

## Installation:

1) Install [nodejs] (https://nodejs.org)

2) npm install

3) npm start

4) [http://localhost:9000] (http://localhost:9000)


## Configuration:

1) Set your client id in index.html:
- amazon.Login.setClientId('CLIENT_ID');

2) Set your role in app.js
- RoleArn: 'ROLE',


## Notes:

- New Wordpress instances are based in WordPress powered by Bitnami (HVM) (ami-917d10e2)
- New instances are deployed in t2.micro
- Security group used are WordPress powered by Bitnami -HVM--4-5-3-0-r15 on Ubuntu 14-04-3-AutogenByAWSMP- (sg-6972430e)
- KeyName used are "wordpress-aws"
- Only 1 active instance is allowed (using free tier amazon)
- User must be logged through Amazon
