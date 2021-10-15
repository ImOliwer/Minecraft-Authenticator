import 'package:flutter/cupertino.dart';

@immutable
class ImmutablePair<First, Second> {
  final First first;
  final Second second;

  const ImmutablePair({
    required this.first,
    required this.second
  });

  static ImmutablePair<Type, bool> ofTypeWithCondition<Type>(Type it, bool condition) {
    return ImmutablePair(first: it, second: condition);
  }
}