import 'package:campaign_keeper_mobile/components/app_bar/keeper_popup.dart';
import 'package:campaign_keeper_mobile/components/app_bar/keeper_search_bar.dart';
import 'package:campaign_keeper_mobile/search_controllers/base_search_controller.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class KeeperFloatingSearch extends StatelessWidget {
  const KeeperFloatingSearch(
      {Key? key, this.autoLeading = true, this.popup, this.searchController, required this.child})
      : super(key: key);

  final bool autoLeading;
  final KeeperPopup? popup;
  final BaseSearchController? searchController;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    SystemChrome.setSystemUIOverlayStyle(Theme.of(context).brightness == Brightness.light
        ? SystemUiOverlayStyle.dark
        : SystemUiOverlayStyle.light);
    return Stack(
      children: [
        child,
        Padding(
          padding: EdgeInsets.only(top: 8),
          child: SearchBar(autoLeading: autoLeading, popup: popup, searchController: searchController),
        ),
      ],
    );
  }
}
