import 'package:flutter_authenticator/util/pair.dart';

List<Type> listOfPredicate<Type>(List<ImmutablePair<Type, bool>> elements) {
  final List<Type> updated = [];
  for (ImmutablePair<Type, bool> pair in elements) {
    if (!pair.second) {
      continue;
    }
    updated.add(pair.first);
  }
  return updated;
}