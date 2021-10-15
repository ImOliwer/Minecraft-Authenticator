import 'package:flutter/cupertino.dart';

@immutable 
class AuthenticationRequest {
  final String serverPointer;
  final String sentFromLocation;
  final DateTime requestedAt;

  const AuthenticationRequest({
    required this.serverPointer,
    required this.sentFromLocation,
    required this.requestedAt
  });

  static AuthenticationRequest from(Map<String, dynamic> serialized) {
    return AuthenticationRequest(
      serverPointer: serialized['server'],
      sentFromLocation: serialized['location'],
      requestedAt: DateTime.now()
    );
  }
}