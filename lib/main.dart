import 'package:flutter/material.dart';
import 'package:flutter_authenticator/callback.dart';
import 'package:flutter_authenticator/screens/auth/requests.dart';
import 'package:flutter_authenticator/screens/login.dart';
import 'authentication.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Authenticator',
      theme: ThemeData(
        primarySwatch: Colors.blueGrey,
      ),
      home: const LoginPhase(),
      routes: {
        '/authorized/requests': (BuildContext context) => const AuthorizedRequests()
      }
    );
  }
}

class MyHomePage extends StatefulWidget {
  final String title;

  const MyHomePage({Key? key, required this.title}) : super(key: key);

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  AuthenticationRequest? currentRequest;

  late final AuthenticationClient client = AuthenticationClient(
    "http://192.168.1.229:3030",
    AuthenticationCallback(respond: (data) => request(data))
  );

  @override
  void initState() {
    super.initState();
    client.connect();
  }

  @override
  void dispose() {
    client.disconnect();
    super.dispose();
  }

  void request(AuthenticationRequest request) {
    // set up socket to receive new code
    setState(() => currentRequest = request);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            const Text(
              'A login request has been received',
            ),
            Text(
              'Server: ${currentRequest?.address}',
              style: Theme.of(context).textTheme.subtitle1,
            ),
            Text(
              'Country: ${currentRequest?.country}',
              style: Theme.of(context).textTheme.subtitle1,
            ),
          ],
        ),
      ),
      /*floatingActionButton: FloatingActionButton(
        onPressed: updateCode,
        tooltip: 'Update',
        child: const Icon(Icons.add),
      ),*/
    );
  }
}
