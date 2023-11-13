# KMATASK
WebRTC based peer to peer video calling and messaging web app build with MERN stack.

# Libraries used

- **`React`** for frontend
- **`Socket.io`** as signaling server and realtime communication 
- **`simple-peer`** for peer-to-peer WebRTC connections
- **`Express`** as server
- **`MongoDB`** for persistance of data
- **`Material UI`** for creating ui
- **`Redux`** for state management
- **`Typescript`** for type safety, cure for headache you get when props are flowing all over the app with no hint 


# Features

* User authentication and authorization
* Login by Qrcode
* Forgot Password
* Audio and Video Chat
* Messaging E2E
* Sending invitation to friends
* Able to accept or reject an invitation
* Online indicator
* Notify on typing
* Sceen sharing 
* Accept and reject an incoming call

**and more....**

## New Features added recently:

*  **`Group Chats`** Create group chats like in whats'app. Group Admins can add members to group and participants can leave the group.
*  Remove friend, ability to unfriend someone
* **`KMATASK Spaces`** like Twitter spaces. You can host a space and any of your friends can join that space.

The **KMATASK spaces** are implemented using MESH topology to establish a peer-to-peer network between every person or client joining the space.
i.e, every person maintains a p2p connection with every other person in the room. 


# Installation

1. Clone project

```

```

```
1. cd server
```

`npm install` to to install server dependencies

`Setup required environment variables:` 
 
- MONGO_URI_DEV
- JWT_SECRET
- PORT 
- PORTSOCKET 
- email 
- password
- CLIENT_URL
- SECRET_KEY
- p 
- g 
- salt  
- MONGO_URI 
- NODE_ENV 
- MONGO_URI_DEV 

`email, password: ` is email and password of email App Password to send email when using ForgotPassword
`p,g :` are parameters used to generate a shared key between two parties over an insecure communication channel (Diffie-Hellman)
`salt :` to increases the complexity of encrypted messages

example : 

PORT=5000
PORTSOCKET=5001
JWT_SECRET="talking"
email="hiepga@gmail.com"
password="*********"
CLIENT_URL="localhost:3000"
SECRET_KEY="talking"
p = 999983
g = 5
salt = 5ff1c2b8e96f042e7c7e2df3a0baf5d7
MONGO_URI = "mongodb://127.0.0.1/talkHouse"
NODE_ENV = "dev"
MONGO_URI_DEV = "mongodb://0.0.0.0:27017/talkHouse"


`npm run dev` to start development server with nodemon

*Make sure you have mongoDB installed*

```
1. cd client
```

`npm install` installs client dependencies.

`npm run start` to start the react development server.


