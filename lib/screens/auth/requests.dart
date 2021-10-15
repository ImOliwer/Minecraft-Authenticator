import 'dart:async';
import 'dart:math';

import 'package:flutter/animation.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_authenticator/data/authentication.dart';
import 'package:flutter_authenticator/util/lists.dart';
import 'package:flutter_authenticator/util/pair.dart';
import 'package:flutter_authenticator/util/theme.dart';

class AuthorizedRequests extends StatefulWidget {
  const AuthorizedRequests({ Key? key }) : super(key: key);

  @override
  State<StatefulWidget> createState() => AuthorizedRequestsState();
}

class AuthorizedRequestsState extends State<AuthorizedRequests> with SingleTickerProviderStateMixin {
  static const examplePlayerName = "ImOliwer";
  static const examplePlayerId = "f9633de66a804964ac30e5d8c5766016";
  
  int _expirationCountdown = 60;
  Timer? _expirationTimer;
  AuthenticationRequest? _currentRequest;

  void _updateRequest(AuthenticationRequest request) => setState(() {
    _currentRequest = request;
    _expirationCountdown = 60;
    _expirationTimer = Timer.periodic(
      const Duration(seconds: 1), 
      (Timer _) => setState(() {
        _expirationCountdown -= 1;
      })
    );
  });

  String _formatDate(DateTime? time) {
    if (time == null) {
      return "Unknown";
    }
    return "Today, ${time.hour}:${time.minute}";
  }

  @override
  void initState() {
    _updateRequest(AuthenticationRequest(
      serverPointer: "mc.someserver.net",
      sentFromLocation: "Malmo, Sweden",
      requestedAt: DateTime.now()
    ));
    super.initState();
  }

  @override
  void dispose() {
    _expirationTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        body: LayoutBuilder(
          builder: (BuildContext context, BoxConstraints constraints) {
            final double maxWidth      = constraints.maxWidth;
            final double initialHeight = constraints.maxHeight;
            
            return Container(
              width: maxWidth,
              height: initialHeight,
              color: const Color.fromRGBO(62, 60, 92, 1.0),
              padding: const EdgeInsets.only(top: 35, bottom: 35, left: 50, right: 50),
              child: Column(
                children: [
                  Container(
                    width: maxWidth,
                    height: 55,
                    decoration: const BoxDecoration(
                      color: Color.fromRGBO(40, 38, 64, 0.25),
                      borderRadius: BorderRadius.all(Radius.circular(10))
                    ),
                    padding: const EdgeInsets.all(10.0),
                    child: Row(
                      children: [
                        Padding(
                          padding: const EdgeInsets.only(right: 10.0),
                          child: Image.network(
                            'https://crafatar.com/avatars/$examplePlayerId?overlay&size=35'
                          )
                        ),
                        Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: const [
                            Text(
                              "Welcome back,",
                              style: TextStyle(
                                fontFamily: 'Roboto',
                                fontSize: 13,
                                fontWeight: FontWeight.normal,
                                color: Colors.white
                              ),
                            ),
                            Text(
                              examplePlayerName,
                              style: TextStyle(
                                fontFamily: 'Roboto',
                                fontSize: 13,
                                fontWeight: FontWeight.normal,
                                color: Colors.white
                              ),
                            )
                          ],
                        ),
                        const Spacer(),
                        ElevatedButton(
                          onPressed: () => print('clicked "contact us" button'), 
                          child: const Text(
                            "Contact Us",
                            style: TextStyle(
                              fontFamily: 'Roboto',
                              fontSize: 12,
                              fontWeight: FontWeight.normal
                            )
                          ),
                          style: ButtonStyle(
                            backgroundColor: MaterialStateProperty.all(const Color.fromRGBO(83, 80, 124, 0.85)),
                            elevation: MaterialStateProperty.all(0.0)
                          ),
                        )
                      ],
                    )
                  ),
                  const Padding(padding: EdgeInsets.only(bottom: 20.0)),
                  Expanded(
                    flex: 1,
                    child: SizedBox(
                      width: maxWidth,
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: listOfPredicate([
                          ImmutablePair.ofTypeWithCondition(
                            SizedBox(
                              width: 175,
                              height: 175,
                              child: Stack(
                                alignment: Alignment.center,
                                children: [
                                  SizedBox(
                                    width: 175,
                                    height: 175,
                                    child: Transform(
                                      alignment: Alignment.center,
                                      transform: Matrix4.rotationY(pi),
                                      child: TweenAnimationBuilder(
                                        tween: Tween(begin: 1.0, end: 0.0), 
                                        duration: const Duration(minutes: 1),
                                        onEnd: () => setState(() {
                                          _currentRequest = null;
                                        }),
                                        builder: (BuildContext context, double animationValue, Widget? child) => CircularProgressIndicator(
                                          backgroundColor: const Color.fromRGBO(69, 66, 102, 1.0),
                                          valueColor: const AlwaysStoppedAnimation(Color.fromRGBO(83, 80, 124, 1.0)),
                                          strokeWidth: 6.0,
                                          value: animationValue
                                        )
                                      )
                                    )
                                  ),
                                  Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    crossAxisAlignment: CrossAxisAlignment.center,
                                    children: [
                                      const Text(
                                        "Expires in",
                                        style: TextStyle(
                                          fontFamily: 'Roboto',
                                          fontSize: 24,
                                          color: Colors.white
                                        )
                                      ),
                                      Text(
                                        _expirationCountdown <= 0 ? "Now" : "$_expirationCountdown seconds",
                                        style: const TextStyle(
                                          fontFamily: 'Roboto',
                                          fontSize: 18,
                                          fontWeight: FontWeight.w400,
                                          color: Colors.white
                                        )
                                      )
                                    ],
                                  )
                                ],
                              )
                            ),
                            _currentRequest != null
                          ),
                          ImmutablePair.ofTypeWithCondition(
                            const Padding(padding: EdgeInsets.only(bottom: 35)),
                            _currentRequest != null 
                          ),
                          ImmutablePair.ofTypeWithCondition(
                            Container(
                              width: maxWidth,
                              padding: const EdgeInsets.all(15.0),
                              decoration: const BoxDecoration(
                                color: Color.fromRGBO(83, 80, 124, 1.0),
                                borderRadius: BorderRadius.all(Radius.circular(10))
                              ),
                              child: Column(
                                children: [
                                  Row(
                                    children: [
                                      const Icon(
                                        Icons.electrical_services_sharp,
                                        color: Color.fromRGBO(155, 149, 188, 1.0),
                                        size: 18.0
                                      ),
                                      const Padding(padding: EdgeInsets.only(left: 5.0)),
                                      const Text(
                                        "Server",
                                        style: TextStyle(
                                          fontFamily: 'Roboto',
                                          fontSize: 13,
                                          fontWeight: FontWeight.w500,
                                          color: Color.fromRGBO(197, 197, 197, 1.0)
                                        )
                                      ),
                                      const Spacer(),
                                      Text(
                                        _currentRequest?.serverPointer ?? "Unknown",
                                        style: const TextStyle(
                                          fontFamily: 'Roboto',
                                          fontSize: 13,
                                          fontWeight: FontWeight.w400,
                                          color: Colors.white
                                        )
                                      )
                                    ],
                                  ),
                                  const Divider(color: Color.fromRGBO(62, 60, 92, 0.5)),
                                  Row(
                                    children: [
                                      const Icon(
                                        Icons.location_on,
                                        color: Color.fromRGBO(155, 149, 188, 1.0),
                                        size: 18.0
                                      ),
                                      const Padding(padding: EdgeInsets.only(left: 5.0)),
                                      const Text(
                                        "Location",
                                        style: TextStyle(
                                          fontFamily: 'Roboto',
                                          fontSize: 13,
                                          fontWeight: FontWeight.w500,
                                          color: Color.fromRGBO(197, 197, 197, 1.0)
                                        )
                                      ),
                                      const Spacer(),
                                      Text(
                                        _currentRequest?.sentFromLocation ?? "Unknown",
                                        style: const TextStyle(
                                          fontFamily: 'Roboto',
                                          fontSize: 13,
                                          fontWeight: FontWeight.w400,
                                          color: Colors.white
                                        )
                                      )
                                    ],
                                  ),
                                  const Divider(color: Color.fromRGBO(62, 60, 92, 0.5)),
                                  Row(
                                    children: [
                                      const Icon(
                                        Icons.timer,
                                        color: Color.fromRGBO(155, 149, 188, 1.0),
                                        size: 18.0
                                      ),
                                      const Padding(padding: EdgeInsets.only(left: 5.0)),
                                      const Text(
                                        "Requested",
                                        style: TextStyle(
                                          fontFamily: 'Roboto',
                                          fontSize: 13,
                                          fontWeight: FontWeight.w500,
                                          color: Color.fromRGBO(197, 197, 197, 1.0)
                                        )
                                      ),
                                      const Spacer(),
                                      Text(
                                        _formatDate(_currentRequest?.requestedAt),
                                        style: const TextStyle(
                                          fontFamily: 'Roboto',
                                          fontSize: 13,
                                          fontWeight: FontWeight.w400,
                                          color: Colors.white
                                        )
                                      )
                                    ],
                                  )
                                ]
                              )
                            ), 
                            _currentRequest != null
                          ),
                          ImmutablePair.ofTypeWithCondition(
                            const Text(
                              "No new request",
                              style: TextStyle(
                                fontFamily: 'Roboto',
                                fontSize: 14,
                                fontWeight: FontWeight.normal,
                                color: DarkTheme.lightGreyText
                              )
                            ), 
                            _currentRequest == null
                          )
                        ]),
                      )
                    )
                  ),
                  ...listOfPredicate([
                    ImmutablePair.ofTypeWithCondition(
                      const Padding(padding: EdgeInsets.only(bottom: 20.0)), 
                      _currentRequest != null
                    ),
                    ImmutablePair.ofTypeWithCondition(
                      SizedBox(
                        width: maxWidth,
                        child: Row(
                          children: [
                            ElevatedButton(
                              onPressed: () => print('clicked "confirm" button'), 
                              child: const Text(
                                "Confirm",
                                style: TextStyle(
                                  fontFamily: 'Roboto',
                                  fontSize: 16,
                                  fontWeight: FontWeight.normal
                                )
                              ),
                              style: ButtonStyle(
                                backgroundColor: MaterialStateProperty.all(const Color.fromRGBO(61, 180, 123, 1.0)),
                                elevation: MaterialStateProperty.all(0.0),
                                padding: MaterialStateProperty.all(const EdgeInsets.only(top: 20.0, bottom: 20.0, left: 45.0, right: 45.0))
                              ),
                            ),
                            const Spacer(),
                            ElevatedButton(
                              onPressed: () => print('clicked "deny" button'), 
                              child: const Text(
                                "Deny",
                                style: TextStyle(
                                  fontFamily: 'Roboto',
                                  fontSize: 16,
                                  fontWeight: FontWeight.normal
                                )
                              ),
                              style: ButtonStyle(
                                backgroundColor: MaterialStateProperty.all(const Color.fromRGBO(239, 87, 96, 1.0)),
                                elevation: MaterialStateProperty.all(0.0),
                                padding: MaterialStateProperty.all(const EdgeInsets.only(top: 20.0, bottom: 20.0, left: 55.0, right: 55.0))
                              ),
                            )
                          ],
                        )
                      ),
                      _currentRequest != null
                    )
                  ]),
                ],
              ),
            );
          }
        )
      )
    );
  }
}