# Chat App

## Spec
- MongoDB
- Express
- ReactJS
- NodeJS
- WebSocket

### WebSocket
- wss:// 프로토콜을 이용하여 클라이언트와 서버간의 양방향 데이터 통신을 가능하게 해준다.
- 데이터는 패킷(Packet) 형태로 전달되면, Connection 이 이뤄지면 클라이언트에서 추가로 HTTP 요청없이 양방향 통신이 가능하다.
```javascript
let socket = new WebSocket(url);

// Connection 이 정상적으로 이루어졌을때 발생
socket.onopen = function (e) {
  alert("[open] Connection 생성");
  socket.send("My name is jintae"); // 데이터 전송
};

// 데이터를 수신받을때 발생
socket.onmessage = function (event) {
  alert(`[message] 서버로부터 전송받은 데이터: ${event.data}`);
};

//
socket.onclose = function (event) {
  if (event.wasClean) {
    // code 1000
    alert(`[close] Connection 이 종료됨 (code=${event.code} reason=${event.reason}`)
  } else {
    // e.g. Killed Process, Network error
    // code 1006
    alert("[close] Connection Died!")
  }
};

//
socket.onerror = function (error) {
  alert("[error]")
}
```

### HandShaked
- new WebSocket(url) 로 소켓이 생성되면 Connection 이 되면서 서버에 웹소켓 지원여부를 HTTP header 로 요청한다.
- 이때 header 에는 클라이언트의 오리진 정보, 변경하려는 프로토콜 정보등이 담겨있다.
- 서버에서 Okay 응답이 오면 HTTP 통신이 wss:// 프로토콜로 통신을 시작한다.

![img.png](img.png)

```javascript
GET /chat
Host: javascript.info
Origin: https://javascript.info
Connection: Upgrade
Upgrade: websocket
Sec-WebSocket-Key: Iv8io/9s+lYFgZWcXczP8Q==
Sec-WebSocket-Version: 13
```
