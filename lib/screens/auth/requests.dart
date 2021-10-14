import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class AuthorizedRequests extends StatefulWidget {
  const AuthorizedRequests({ Key? key }) : super(key: key);

  @override
  State<StatefulWidget> createState() => AuthorizedRequestsState();
}

class AuthorizedRequestsState extends State<AuthorizedRequests> {
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
              child: Column(
                children: [
                  
                ],
              ),
            );
          }
        )
      )
    );
  }
}