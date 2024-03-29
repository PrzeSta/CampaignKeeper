import 'package:campaign_keeper_mobile/components/app_bar/keeper_popup.dart';
import 'package:campaign_keeper_mobile/components/app_bar/keeper_search_bar.dart';
import 'package:campaign_keeper_mobile/components/keeper_anim_sliver_replacer.dart';
import 'package:campaign_keeper_mobile/components/keeper_objects_grid.dart';
import 'package:campaign_keeper_mobile/components/keeper_scaffold.dart';
import 'package:campaign_keeper_mobile/components/keeper_state.dart';
import 'package:campaign_keeper_mobile/components/tiles/keeper_object_grid_tile.dart';
import 'package:campaign_keeper_mobile/entities/campaign_ent.dart';
import 'package:campaign_keeper_mobile/entities/object_ent.dart';
import 'package:campaign_keeper_mobile/entities/schema_ent.dart';
import 'package:campaign_keeper_mobile/entities/user_data_ent.dart';
import 'package:campaign_keeper_mobile/search_controllers/object_search_controller.dart';
import 'package:campaign_keeper_mobile/services/data_carrier.dart';
import 'package:flutter/material.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';

// Page displaying a grid of objects corresponding
// to a particular schema.
class SchemaObjects extends StatefulWidget {
  const SchemaObjects({Key? key, required this.schemaId}) : super(key: key);
  final int schemaId;

  @override
  State<SchemaObjects> createState() => _SchemaObjectsState();
}

class _SchemaObjectsState extends KeeperState<SchemaObjects> {
  static const heroTag = 'search_objects';
  final controller = KeeperSliverReplacerController();
  late final searchController = ObjectSearchController(schemaId: widget.schemaId, heroTag: heroTag);
  late SchemaEntity? schema = DataCarrier().get(entId: widget.schemaId);
  late List<ObjectEntity> objects = DataCarrier().getList(groupId: schema?.id ?? -1);

  Future<void> onRefresh() async {
    await Future.wait([
      DataCarrier().refresh<UserDataEntity>(),
      DataCarrier().refresh<CampaignEntity>(),
      DataCarrier().refresh<SchemaEntity>(parameterValue: schema?.campaignId),
      DataCarrier().refresh<ObjectEntity>(parameterValue: schema?.id),
    ]);
  }

  Future<void> onSchemaRefresh() async {
    SchemaEntity? entity = DataCarrier().get(entId: widget.schemaId);
    if (entity == null) {
      returnTo('/start');
    } else {
      setState(() {
        schema = entity;
      });
    }
  }

  Future<void> onObjectsRefresh() async {
    objects = DataCarrier().getList(groupId: schema?.id ?? -1);
    controller.replace(sliverList());
  }

  void openObject(int id) async {
    Navigator.pushNamed(context, '/start/campaign/schema_objects/object_explorer', arguments: id);
  }

  Widget sliverList() {
    if (schema == null) {
      return SliverFillRemaining(
        hasScrollBody: false,
        child: SpinKitRing(
          color: Theme.of(context).colorScheme.onBackground,
          size: 40.0,
          lineWidth: 5.0,
        ),
      );
    }

    if (objects.length > 0) {
      return KeeperObjectsGrid(
          tiles: objects
              .map((e) => KeeperObjectGridTile(
                    entity: e,
                    onTap: () {
                      openObject(e.id);
                    },
                  ))
              .toList());
    }

    return SliverFillRemaining(
      hasScrollBody: false,
      child: Center(
        child: Text(
          "There's nothing here.\nFill your star map on our website!",
          textAlign: TextAlign.center,
        ),
      ),
    );
  }

  @override
  void onReturn() async {
    DataCarrier().refresh<SchemaEntity>(parameterValue: schema?.campaignId);
    DataCarrier().refresh<ObjectEntity>(parameterValue: schema?.id);
  }

  @override
  void onEveryResume() async {
    DataCarrier().refresh<SchemaEntity>(parameterValue: schema?.campaignId);
  }

  @override
  void initState() {
    super.initState();
    DataCarrier().addListener<SchemaEntity>(onSchemaRefresh);
    DataCarrier().addListener<ObjectEntity>(onObjectsRefresh);
    DataCarrier().refresh<SchemaEntity>(parameterValue: schema?.campaignId);
    DataCarrier().refresh<ObjectEntity>(parameterValue: schema?.id);
  }

  @override
  void dispose() {
    DataCarrier().removeListener<SchemaEntity>(onSchemaRefresh);
    DataCarrier().removeListener<ObjectEntity>(onObjectsRefresh);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return KeeperScaffold(
      body: KeeperSearchBar(
        title: schema?.title ?? "",
        popup: KeeperPopup.settings(context),
        onRefresh: onRefresh,
        sliver: KeeperAnimatedSliverReplacer(
          controller: controller,
          sliver: sliverList(),
        ),
        searchController: searchController,
        heroTag: heroTag,
      ),
    );
  }
}
