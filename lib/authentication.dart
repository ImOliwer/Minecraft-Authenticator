import 'package:socket_io_client/socket_io_client.dart';
import 'callback.dart';

class AuthenticationClient {
  late final Socket socket;
  late final Callback callback;

  AuthenticationClient(String url, this.callback) {
    socket = io(url, <String, dynamic>{
      "transports": ["websocket"],
      "autoConnect": false
    });
  }

  void connect() {
    socket.connect();
    socket.onConnect((_) {
      socket.on("request", (data) {
        String server  = data["address"];
        String country = data["country"];
        callback.respond(AuthenticationRequest(server, country));
      });
    });
  }

  void disconnect() {
    socket.disconnect();
  }
}

class AuthenticationRequest {
  final String address;
  final String country;
  late final DateTime created;

  AuthenticationRequest(this.address, this.country) {
    created = DateTime.now();
  }
}