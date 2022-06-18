import 'package:campaign_keeper_mobile/components/app_bar/keeper_app_bar.dart';
import 'package:campaign_keeper_mobile/components/app_bar/keeper_popup.dart';
import 'package:campaign_keeper_mobile/components/keeper_state.dart';
import 'package:campaign_keeper_mobile/components/tiles/keeper_campaign_tile.dart';
import 'package:campaign_keeper_mobile/entities/campaign_ent.dart';
import 'package:campaign_keeper_mobile/entities/user_data_ent.dart';
import 'package:campaign_keeper_mobile/services/data_carrier.dart';
import 'package:campaign_keeper_mobile/services/helpers/login_helper.dart';
import 'package:campaign_keeper_mobile/services/keeper_toast.dart';
import 'package:flutter/material.dart';

// Page showing users campaigns list.
// Implements double back to exit with a toast
// information.
class Start extends StatefulWidget {
  const Start({Key? key}) : super(key: key);

  @override
  _StartState createState() => _StartState();
}

class _StartState extends KeeperState<Start> {
  List<CampaignEntity> _entities = DataCarrier().getList<CampaignEntity>();
  bool isPopExit = false;

  Future<void> onRefresh() async {
    DataCarrier().refresh<UserDataEntity>();
    await DataCarrier().refresh<CampaignEntity>();
  }

  void forceLogOut() {
    LoginHelper().logout();
    Navigator.pushNamedAndRemoveUntil(context, '/login', (Route<dynamic> route) => false);
  }

  void onUserDetailsRefresh() {
    if (DataCarrier().get<UserDataEntity>() == null) {
      forceLogOut();
    }
  }

  void onCampaignRefresh() {
    setState(() {
      _entities = DataCarrier().getList<CampaignEntity>();
    });
  }

  void openCampaign(int id) async {
    Navigator.pushNamed(context, '/start/campaign', arguments: id);
  }

  @override
  void onEveryResume() async {
    DataCarrier().refresh<UserDataEntity>();
    DataCarrier().refresh<CampaignEntity>();
  }

  @override
  Future<bool> didPopRoute() async {
    if (isPopExit) {
      return false;
    } else {
      isPopExit = true;
      KeeperToast.show("Press back again to exit");
      Future.delayed(Duration(seconds: 1, milliseconds: 300), () {
        isPopExit = false;
      });
      return true;
    }
  }

  @override
  void initState() {
    super.initState();
    DataCarrier().addListener<CampaignEntity>(onCampaignRefresh);
  }

  @override
  void dispose() {
    DataCarrier().removeListener<CampaignEntity>(onCampaignRefresh);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: KeeperAppBar(
        autoLeading: false,
        title: "Campaigns",
        popup: KeeperPopup.settings(context),
        onRefresh: onRefresh,
        sliver: _entities.isEmpty
            ? SliverFillRemaining(
                hasScrollBody: false,
                child: Center(
                  child: Text(
                    "There's nothing here.\nStart new adventures on our website!",
                    textAlign: TextAlign.center,
                  ),
                ),
              )
            : SliverList(
                delegate: SliverChildBuilderDelegate((BuildContext context, int index) {
                return KeeperCampaignTile(
                    entity: _entities[index],
                    onTap: () {
                      openCampaign(_entities[index].id);
                    });
              }, childCount: _entities.length)),
      ),
    );
  }
}
