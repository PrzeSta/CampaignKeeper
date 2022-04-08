import 'package:campaign_keeper_mobile/components/app_bar/keeper_back_button.dart';
import 'package:campaign_keeper_mobile/search_controllers/base_search_controller.dart';
import 'package:flutter/material.dart';

class Search extends StatefulWidget {
  const Search({Key? key, required this.searchController}) : super(key: key);
  final BaseSearchController searchController;

  @override
  State<Search> createState() => _SearchState();
}

class _SearchState extends State<Search> {
  final searchTextController = TextEditingController();
  final searchFocusNode = FocusNode();

  List entities = [];

  void onSearchChanged(String input) {
    setState(() {
      if (input.length < 2) {
        entities.clear();
      } else {
        entities = widget.searchController.filterEntities(input);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return _SearchScaffold(
      searchTextController: searchTextController,
      searchFocusNode: searchFocusNode,
      onChanged: onSearchChanged,
      onClear: () {
        searchTextController.clear();
        setState(() {
          entities.clear();
        });
      },
      body: entities.length == 0
          ? Center(
              child: Text(
                "Be brave and search for treasures",
                textAlign: TextAlign.center,
              ),
            )
          : ListView.builder(
              itemCount: entities.length,
              itemBuilder: (context, id) {
                return widget.searchController.createWidget(entities[id]);
              },
            ),
    );
  }
}

class _SearchScaffold extends StatelessWidget {
  _SearchScaffold(
      {Key? key,
      required this.body,
      required this.searchTextController,
      required this.searchFocusNode,
      required this.onChanged,
      required this.onClear})
      : super(key: key);
  final body;
  final searchTextController;
  final searchFocusNode;
  final void Function(String) onChanged;
  final void Function() onClear;
  final border = OutlineInputBorder(
      borderSide: BorderSide.none, borderRadius: BorderRadius.all(Radius.circular(6)), gapPadding: 0);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        flexibleSpace: Hero(
          tag: 'search',
          flightShuttleBuilder: (flightContext, animation, flightDirection, fromHeroContext, toHeroContext) {
            animation.addStatusListener((status) {
              if (status == AnimationStatus.completed) {
                Future.delayed(Duration(milliseconds: 50), () {
                  searchFocusNode.requestFocus();
                });
              }
            });
            return _AppBarAnimatedPlaceholder(
                animation: animation, paddingTop: MediaQuery.of(context).padding.top);
          },
          child: Material(
            color: Theme.of(context).colorScheme.surface,
            child: InkWell(
              child: SafeArea(
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.start,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    KeeperBackButton(),
                    Expanded(
                      child: Padding(
                        padding: EdgeInsets.only(top: 2),
                        child: TextField(
                          controller: searchTextController,
                          focusNode: searchFocusNode,
                          style: TextStyle(
                            fontSize: 19,
                          ),
                          onChanged: onChanged,
                          decoration: InputDecoration(
                            hintText: "Search",
                            hintStyle: TextStyle(
                                color: Theme.of(context).appBarTheme.titleTextStyle!.color!.withOpacity(0.7)),
                            fillColor: Colors.transparent,
                            contentPadding: EdgeInsets.zero,
                            focusedBorder: border,
                            enabledBorder: border,
                            disabledBorder: border,
                            border: border,
                          ),
                        ),
                      ),
                    ),
                    IconButton(
                      onPressed: onClear,
                      padding: EdgeInsets.symmetric(horizontal: 8),
                      icon: Icon(
                        Icons.clear,
                        color: Theme.of(context).appBarTheme.titleTextStyle!.color,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
      body: body,
    );
  }
}

class _AppBarAnimatedPlaceholder extends StatelessWidget {
  _AppBarAnimatedPlaceholder({Key? key, required this.animation, required this.paddingTop}) : super(key: key);
  final Animation<double> animation;
  final double paddingTop;
  final border = OutlineInputBorder(
      borderSide: BorderSide.none, borderRadius: BorderRadius.all(Radius.circular(6)), gapPadding: 0);
  final Tween<double> radiusTween = Tween(begin: 30.0, end: 30.0);

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: animation,
      builder: (context, _) {
        return Padding(
          padding: EdgeInsets.only(top: paddingTop * (1.0 - animation.value)),
          child: ClipRRect(
            borderRadius: BorderRadius.all(Radius.circular(35 * (1.0 - animation.value))),
            child: Material(
              color: Theme.of(context).colorScheme.surface,
              child: InkWell(
                child: Padding(
                  padding: EdgeInsets.only(top: paddingTop * animation.value),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.start,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Padding(
                        padding: EdgeInsets.only(left: 12, right: 12),
                        child: Icon(
                          Icons.arrow_back,
                          size: 23.5,
                          color: Theme.of(context).appBarTheme.titleTextStyle!.color,
                        ),
                      ),
                      Expanded(
                        child: Text(
                          "Search",
                          style: TextStyle(
                            color: Theme.of(context).appBarTheme.titleTextStyle!.color?.withOpacity(0.75),
                            fontSize: 19,
                            fontWeight: FontWeight.w400,
                          ),
                        ),
                      ),
                      IconButton(
                        onPressed: () {},
                        padding: EdgeInsets.symmetric(horizontal: 8),
                        icon: Icon(
                          Icons.clear,
                          color: Theme.of(context).appBarTheme.titleTextStyle!.color,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}
