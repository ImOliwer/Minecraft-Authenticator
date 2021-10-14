import 'dart:math';

List<String> _welcomeUnknown = [
  'Fancy seeing you!',
  'Hello there user!',
  'We\'re glad you made it!'
];

Type _randomOf<Type>(List<Type> array) {
  final int length = array.length;
  return array[Random.secure().nextInt(length)];
}

String randomWelcomeUnknown() => _randomOf(_welcomeUnknown);