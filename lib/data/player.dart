import 'package:flutter/cupertino.dart';

@immutable
class Player {
  final String name;
  final String uniqueId;

  const Player({
    required this.name,
    required this.uniqueId
  });

  static Player from(Map<String, dynamic> serialized) {
    return Player(
      name: serialized['name'], 
      uniqueId: serialized['uniqueId']
    );
  }
}