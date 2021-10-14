import 'authentication.dart';

abstract class Callback<Type> {
  void respond(Type data);
}

class AuthenticationCallback implements Callback<AuthenticationRequest> {
  final void Function(AuthenticationRequest request) _response;

  const AuthenticationCallback({ required void Function(AuthenticationRequest) respond }):
        _response = respond;

  @override
  void respond(AuthenticationRequest request) => _response(request);
}