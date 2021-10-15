import 'package:flutter/material.dart';
import 'package:flutter_authenticator/data/player.dart';
import 'package:flutter_authenticator/screens/auth/requests.dart';
import 'package:flutter_authenticator/util/messages.dart';
import 'package:flutter_authenticator/util/regexes.dart';
import 'package:flutter_authenticator/util/theme.dart';
import 'package:flutter_svg/flutter_svg.dart';

class LoginPhase extends StatefulWidget {
  const LoginPhase({ Key? key }) : super(key: key);

  @override
  LoginPhaseState createState() => LoginPhaseState();
}

enum LoginPhaseFocusedFieldState {
  email,
  password
}

class LoginPhaseState extends State<LoginPhase> {
  final _formKey = GlobalKey<FormState>();
  final _emailFieldKey = GlobalKey<FormFieldState>();
  final _passwordFieldKey = GlobalKey<FormFieldState>();
  final _helloMessage = randomWelcomeUnknown();

  bool _canNotSeePassword = true;
  bool _isInvalidEmail = false;
  bool _isInvalidPassword = false;

  String _email = "";
  String _password = "";
  LoginPhaseFocusedFieldState? focusedFieldState;

  void _modifyIsInvalid({ required bool isEmail, required bool value }) {
    setState(() {
      if (isEmail) {
        _isInvalidEmail = value;
        return;
      }
      _isInvalidPassword = value;
    });
  }

  void _updateCanSeePassword() {
    setState(() => _canNotSeePassword = !_canNotSeePassword);
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        resizeToAvoidBottomInset: false,
        body: LayoutBuilder(
          builder: (BuildContext context, BoxConstraints constraints) {
            final double maxWidth      = constraints.maxWidth;
            final double initialHeight = constraints.maxHeight;
            final double headerHeight  = initialHeight * 0.40; // 40% of height
            final double bodyHeight    = initialHeight * 0.54; // +^ 94% of height
            final double footerHeight  = initialHeight * 0.06; // +^ 100% of height

            return Container(
              width: maxWidth,
              height: initialHeight,
              color: const Color.fromRGBO(45, 43, 72, 1.0),
              child: Column(
                children: [
                  SizedBox(
                      width: maxWidth,
                      height: headerHeight,
                      child: Stack(
                        fit: StackFit.expand,
                        children: [
                          SvgPicture.asset(
                              "assets/svg/login_header.svg",
                              fit: BoxFit.fill
                          ),
                          Container(
                            height: headerHeight,
                            margin: const EdgeInsets.all(20.0),
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  "Minecraft Authenticator",
                                  style: TextStyle(
                                    fontFamily: 'Roboto',
                                    fontWeight: FontWeight.w500,
                                    fontSize: 34,
                                    color: Colors.white
                                  ),
                                ),
                                Divider(
                                    thickness: 1.0,
                                    color: Colors.white,
                                    endIndent: maxWidth - (maxWidth * 0.15)
                                ),
                                Text(
                                  _helloMessage,
                                  style: const TextStyle(
                                      fontFamily: 'Roboto',
                                      fontWeight: FontWeight.w300,
                                      fontSize: 18,
                                      color: Color.fromRGBO(200, 200, 200, 1.0)
                                  )
                                )
                              ],
                            ),
                          )
                        ],
                      )
                  ),
                  Container(
                    width: maxWidth,
                    height: bodyHeight,
                    padding: const EdgeInsets.all(20.0),
                    child: Form(
                      key: _formKey,
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Padding(
                            padding: const EdgeInsets.only(bottom: 10.0),
                            child: TextFormField(
                              key: _emailFieldKey,
                              textAlignVertical: TextAlignVertical.center,
                              validator: (value) => value == null || value.isEmpty || !Regexes.email.hasMatch(value) ? '' : null,
                              onSaved: (value) => _email = value!,
                              onEditingComplete: () {
                                FocusScope.of(context).unfocus();
                                if (!_emailFieldKey.currentState!.validate()) {
                                  _modifyIsInvalid(isEmail: true, value: true);
                                } else {
                                  _modifyIsInvalid(isEmail: true, value: false);
                                }
                                focusedFieldState = null;
                              },
                              onTap: () {
                                if (focusedFieldState == LoginPhaseFocusedFieldState.password) {
                                  if (!_passwordFieldKey.currentState!.validate()) {
                                    _modifyIsInvalid(isEmail: false, value: true);
                                  } else {
                                    _modifyIsInvalid(isEmail: false, value: false);
                                  }
                                }
                                focusedFieldState = LoginPhaseFocusedFieldState.email;
                              },
                              style: TextStyle(color: !_isInvalidEmail ? DarkTheme.pinkText : DarkTheme.error),
                              decoration: InputDecoration(
                                focusedBorder: const OutlineInputBorder(
                                  borderSide: BorderSide(color: DarkTheme.pinkText)
                                ),
                                enabledBorder: const OutlineInputBorder(
                                  borderSide: BorderSide(color: DarkTheme.pinkText)
                                ),
                                errorBorder: const OutlineInputBorder(
                                  borderSide: BorderSide(color: DarkTheme.error)
                                ),
                                focusedErrorBorder: const OutlineInputBorder(
                                  borderSide: BorderSide(color: DarkTheme.error)
                                ),
                                labelText: "Email",
                                errorStyle: const TextStyle(height: 0.0),
                                labelStyle: TextStyle(color: !_isInvalidEmail ? DarkTheme.pinkText : DarkTheme.error)
                              ),
                            )
                          ),
                          Padding(
                            padding: const EdgeInsets.only(bottom: 20.0),
                            child: TextFormField(
                              key: _passwordFieldKey,
                              textAlignVertical: TextAlignVertical.center,
                              validator: (value) => value == null || value.isEmpty ? '' : null,
                              onSaved: (value) => _password = value!,
                              onEditingComplete: () {
                                FocusScope.of(context).unfocus();
                                if (!_passwordFieldKey.currentState!.validate()) {
                                  _modifyIsInvalid(isEmail: false, value: true);
                                } else {
                                  _modifyIsInvalid(isEmail: false, value: false);
                                }
                                focusedFieldState = null;
                              },
                              onTap: () {
                                if (focusedFieldState == LoginPhaseFocusedFieldState.email) {
                                  if (!_emailFieldKey.currentState!.validate()) {
                                    _modifyIsInvalid(isEmail: true, value: true);
                                  } else {
                                    _modifyIsInvalid(isEmail: true, value: false);
                                  }
                                }
                                focusedFieldState = LoginPhaseFocusedFieldState.password;
                              },
                              style: TextStyle(color: !_isInvalidPassword ? DarkTheme.pinkText : DarkTheme.error),
                              decoration: InputDecoration(
                                focusedBorder: const OutlineInputBorder(
                                  borderSide: BorderSide(color: DarkTheme.pinkText)
                                ),
                                enabledBorder: const OutlineInputBorder(
                                  borderSide: BorderSide(color: DarkTheme.pinkText)
                                ),
                                errorBorder: const OutlineInputBorder(
                                  borderSide: BorderSide(color: DarkTheme.error)
                                ),
                                focusedErrorBorder: const OutlineInputBorder(
                                  borderSide: BorderSide(color: DarkTheme.error)
                                ),
                                suffixIcon: IconButton(
                                  onPressed: () => _updateCanSeePassword(),
                                  icon: Icon(
                                    _canNotSeePassword ? Icons.remove_red_eye_outlined : Icons.remove_red_eye_rounded, 
                                    size: 25.0,
                                    color: !_isInvalidPassword ? DarkTheme.pinkText : DarkTheme.error,
                                  )
                                ),
                                labelText: "Password",
                                errorStyle: const TextStyle(height: 0.0),
                                labelStyle: TextStyle(color: !_isInvalidPassword ? DarkTheme.pinkText : DarkTheme.error)
                              ),
                              obscureText: _canNotSeePassword,
                              enableSuggestions: !_canNotSeePassword,
                              autocorrect: !_canNotSeePassword,
                            ),
                          ),
                          ElevatedButton(
                            onPressed: () {
                              final state = _formKey.currentState!;
                              if (!state.validate()) {
                                return;
                              }
                              state.save();
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (BuildContext routeContext) => const AuthorizedRequests(),
                                  settings: const RouteSettings(
                                    arguments: <String, dynamic>{
                                      // TODO: Fetch from backend by credentials provided
                                      'player': Player(
                                        name: "ImOliwer", 
                                        uniqueId: "f9633de6-6a80-4964-ac30-e5d8c5766016"
                                      )
                                    }
                                  )
                                )
                              );
                              // if the request sent to db comes back with anything but a 200, clear password but keep email
                              /*password = "";
                              _passwordFieldKey.currentState!.didChange(null);*/
                            },
                            child: const Text(
                              "Sign In",
                              style: TextStyle(color: DarkTheme.pinkText)
                            ),
                            style: ButtonStyle(
                              minimumSize: MaterialStateProperty.all(Size(maxWidth, 45.0)),
                              backgroundColor: MaterialStateProperty.all(const Color.fromRGBO(82, 78, 112, 1.0)),
                              elevation: MaterialStateProperty.all(0.0),
                              textStyle: MaterialStateProperty.all(
                                const TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.w600,
                                  fontFamily: 'Roboto'
                                )
                              )
                            ),
                          )
                        ],
                      ),
                    )
                  ),
                  Container(
                    width: maxWidth,
                    height: footerHeight,
                    margin: const EdgeInsets.only(left: 15.0, right: 15.0),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          "© 2022 Oliwer. All rights reserved.",
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.normal,
                            fontFamily: 'Roboto',
                            color: DarkTheme.lightGreyText
                          ),
                        ),
                        TextButton(
                          onPressed: () {},
                          style: TextButton.styleFrom(
                            padding: EdgeInsets.zero,
                            elevation: 0.0,
                            splashFactory: NoSplash.splashFactory
                          ),
                          child: const Text(
                            "Forgot Your Password?",
                            style: TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w600,
                              fontFamily: 'Roboto',
                              color: DarkTheme.lightGreyText
                            ),
                          )
                        )
                      ],
                    )
                  )
                ],
              ),
            );
          },
        )
      )
    );
  }
}