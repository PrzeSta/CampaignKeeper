import 'package:flutter/material.dart';

class KeeperSliverReplacerController extends ChangeNotifier {
  Widget? awaitingWidget;

  void replace(Widget child) {
    awaitingWidget = child;
    notifyListeners();
  }
}

class KeeperAnimatedSliverReplacer extends StatefulWidget {
  KeeperAnimatedSliverReplacer({Key? key, required this.controller, required this.sliver}) : super(key: key);

  final KeeperSliverReplacerController controller;
  final Widget sliver;

  @override
  State<KeeperAnimatedSliverReplacer> createState() => _KeeperAnimatedSliverReplacerState();
}

class _KeeperAnimatedSliverReplacerState extends State<KeeperAnimatedSliverReplacer>
    with SingleTickerProviderStateMixin {
  late Widget child = widget.sliver;
  late final AnimationController controller = AnimationController(
    value: 1.0,
    duration: const Duration(milliseconds: 125),
    vsync: this,
  );
  late final Animation<double> animation = CurvedAnimation(
    parent: controller,
    curve: Curves.easeIn,
  );

  void _onControllerChanged() {
    if (widget.controller.awaitingWidget != null) {
      controller.reverse();
    }
  }

  @override
  void initState() {
    super.initState();

    animation.addStatusListener((status) {
      if (status == AnimationStatus.dismissed) {
        var awaitingWidget = widget.controller.awaitingWidget;

        if (awaitingWidget != null) {
          setState(() {
            child = awaitingWidget;
          });
        }

        widget.controller.awaitingWidget = null;

        controller.forward();
      }
    });

    widget.controller.addListener(_onControllerChanged);
  }

  @override
  void dispose() {
    widget.controller.removeListener(_onControllerChanged);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SliverFadeTransition(
      opacity: animation,
      sliver: child,
    );
  }
}
