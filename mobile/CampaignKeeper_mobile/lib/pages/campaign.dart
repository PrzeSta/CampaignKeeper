import 'package:campaign_keeper_mobile/components/app_bar/keeper_popup.dart';
import 'package:campaign_keeper_mobile/components/app_bar/keeper_search_bar.dart';
import 'package:campaign_keeper_mobile/components/keeper_state.dart';
import 'package:campaign_keeper_mobile/entities/campaign_ent.dart';
import 'package:campaign_keeper_mobile/entities/session_ent.dart';
import 'package:campaign_keeper_mobile/entities/user_data_ent.dart';
import 'package:campaign_keeper_mobile/services/data_carrier.dart';
import 'package:campaign_keeper_mobile/search_controllers/base_search_controller.dart';
import 'package:campaign_keeper_mobile/search_controllers/campaign_search_controller.dart';
import 'package:flutter/material.dart';

class Campaign extends StatefulWidget {
  Campaign({Key? key, required this.campaignID}) : super(key: key);
  final int campaignID;

  @override
  State<Campaign> createState() => _CampaignState();
}

class _CampaignState extends KeeperState<Campaign> {
  CampaignEntity? campaign;
  late List<SessionEntity> sessions = DataCarrier().getList(groupId: widget.campaignID);
  BaseSearchController? searchController = CampaignSearchController();
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

  void returnToStart() {
    Navigator.popUntil(context, ModalRoute.withName('/start'));
  }

  Future<void> onCampaignRefresh() async {
    CampaignEntity? entity = DataCarrier().get(entId: widget.campaignID);
    if (entity == null) {
      returnToStart();
    } else {
      setState(() {
        campaign = entity;
      });
    }
  }

  Future<void> onSessionRefresh() async {
    sessions = DataCarrier().getList(groupId: widget.campaignID);
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
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    onCampaignRefresh();
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
          searchController: searchController,
          sliver: SliverFillRemaining(
            hasScrollBody: false,
            child: Center(
              child: Text(
                "There's nothing here.\nStart new adventures on our website!",
                textAlign: TextAlign.center,
              ),
            ),
          )),
      bottomNavigationBar: NavigationBar(
        onDestinationSelected: (int index) {
          setState(() {
            currentPage = index;
            // TODO: change this one to a proper controller when sessions and codex api will be available
            searchController = index == 0 ? CampaignSearchController() : null;
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
