# gratiot quest

A socket.io and html5 canvas game. You are a pheasant and you run around and eat catfood. It is multi-player and there is a chatroom

## Database

    create table messages(msg text, username VARCHAR(256), created_at timestamp NOT NULL DEFAULT now());

## Run

```
yarn
node index.js
```

Starts a express/socket.io server that statically serves the contents of the `static` folder, just visit http://localhost:5000

## Screenshots

![](1.png)
![](2.png)
