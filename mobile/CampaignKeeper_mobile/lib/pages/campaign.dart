import 'package:campaign_keeper_mobile/components/app_bar/keeper_popup.dart';
import 'package:campaign_keeper_mobile/components/app_bar/keeper_search_bar.dart';
import 'package:campaign_keeper_mobile/components/keeper_state.dart';
import 'package:campaign_keeper_mobile/components/tiles/keeper_session_tile.dart';
import 'package:campaign_keeper_mobile/entities/campaign_ent.dart';
import 'package:campaign_keeper_mobile/entities/session_ent.dart';
import 'package:campaign_keeper_mobile/entities/user_data_ent.dart';
import 'package:campaign_keeper_mobile/search_controllers/session_search_controller.dart';
import 'package:campaign_keeper_mobile/services/data_carrier.dart';
import 'package:campaign_keeper_mobile/search_controllers/base_search_controller.dart';
import 'package:campaign_keeper_mobile/search_controllers/campaign_search_controller.dart';
import 'package:flutter/material.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';

class Campaign extends StatefulWidget {
  Campaign({Key? key, required this.campaignID}) : super(key: key);
  final int campaignID;

  @override
  State<Campaign> createState() => _CampaignState();
}

class _CampaignState extends KeeperState<Campaign> {
  late CampaignEntity? campaign = DataCarrier().get(entId: widget.campaignID);
  late List<SessionEntity> sessions = DataCarrier().getList(groupId: widget.campaignID);
  late BaseSearchController sessionSearch = SessionSearchController(campaignId: widget.campaignID);
  BaseSearchController codexSearch = CampaignSearchController();
  int currentPage = 0;

  Future<void> onRefresh() async {
    await DataCarrier().refresh<UserDataEntity>();
    await DataCarrier().refresh<CampaignEntity>();
    if (currentPage == 0) {
      await DataCarrier().refresh<SessionEntity>(groupId: widget.campaignID);
    } else {
      //TODO: Refresh codex here
    }
  }

  Future<void> onCampaignRefresh() async {
    CampaignEntity? entity = DataCarrier().get(entId: widget.campaignID);
    if (entity == null) {
      returnTo('/start');
    } else {
      setState(() {
        campaign = entity;
      });
    }
  }

  Future<void> onSessionRefresh() async {
    setState(() {
      sessions = DataCarrier().getList(groupId: widget.campaignID);
    });
  }

  void openSession(int id) async {
    Navigator.pushNamed(context, '/start/campaign/session_map', arguments: id);
  }

  Widget buildBody() {
    if (currentPage == 0 && sessions.length > 0) {
      return SliverList(
        delegate: SliverChildBuilderDelegate(
          (context, index) => KeeperSessionTile(
            entity: sessions[index],
            onTap: () {
              openSession(sessions[index].id);
            },
          ),
          childCount: sessions.length,
        ),
      );
    }

    return SliverFillRemaining(
      hasScrollBody: false,
      child: Center(
        child: Text(
          "There's nothing here.\nStart new adventures on our website!",
          textAlign: TextAlign.center,
        ),
      ),
    );
  }

  @override
  void onResume() async {
    DataCarrier().refresh<CampaignEntity>();
    if (currentPage == 0) {
      await DataCarrier().refresh<SessionEntity>(groupId: widget.campaignID);
    } else {
      //TODO: Refresh codex here
    }
  }

  @override
  void initState() {
    super.initState();
    DataCarrier().addListener<CampaignEntity>(onCampaignRefresh);
    DataCarrier().addListener<SessionEntity>(onSessionRefresh);
    DataCarrier().refresh<CampaignEntity>();
    DataCarrier().refresh<SessionEntity>(groupId: widget.campaignID);
  }

  @override
  void dispose() {
    DataCarrier().removeListener<CampaignEntity>(onCampaignRefresh);
    DataCarrier().removeListener<SessionEntity>(onSessionRefresh);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: KeeperSearchBar(
          title: campaign?.name ?? '',
          popup: KeeperPopup.settings(context),
          onRefresh: onRefresh,
          searchController: currentPage == 0 ? sessionSearch : codexSearch,
          sliver: campaign == null
              ? SliverFillRemaining(
                  hasScrollBody: false,
                  child: SpinKitRing(
                    color: Theme.of(context).colorScheme.onBackground,
                    size: 40.0,
                    lineWidth: 5.0,
                  ),
                )
              : buildBody()),
      bottomNavigationBar: NavigationBar(
        onDestinationSelected: (int index) {
          setState(() {
            currentPage = index;
          });
        },
        selectedIndex: currentPage,
        destinations: [
          NavigationDestination(icon: Icon(Icons.list), label: "Sessions"),
          NavigationDestination(
              icon: Icon(Icons.book_outlined), selectedIcon: Icon(Icons.book), label: "Codex"),
        ],
      ),
    );
  }
}
