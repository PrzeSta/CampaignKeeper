import 'package:campaign_keeper_mobile/components/tiles/keeper_chip_tile.dart';
import 'package:campaign_keeper_mobile/components/tiles/keeper_field_tile.dart';
import 'package:campaign_keeper_mobile/entities/event_ent.dart';
import 'package:campaign_keeper_mobile/types/entity_types.dart';
import 'package:flutter/material.dart';

class KeeperEventNode extends StatelessWidget {
  final EventEntity? entity;
  final List<FieldValue> characterValues = [];
  final List<FieldValue> placeValues = [];
  final List<FieldValue> descriptionValues = [];

  KeeperEventNode({Key? key, required this.entity}) : super(key: key) {
    if (entity != null) {
      var charValues = entity!.characterValues.where((e) => e.fieldName == 'characters').toList()
        ..sort(((a, b) => a.sequence.compareTo(b.sequence)));
      characterValues.addAll(charValues);

      var plValues = entity!.placeValues.where((e) => e.fieldName == 'places').toList()
        ..sort(((a, b) => a.sequence.compareTo(b.sequence)));
      placeValues.addAll(plValues);

      var desValues = entity!.descriptionValues.where((e) => e.fieldName == 'descriptions').toList()
        ..sort(((a, b) => a.sequence.compareTo(b.sequence)));
      descriptionValues.addAll(desValues);
    }
  }

  @override
  Widget build(BuildContext context) {
    return ConstrainedBox(
      constraints: BoxConstraints(
        maxHeight: double.infinity,
        maxWidth: 280,
        minWidth: 280,
      ),
      child: Material(
        color: Theme.of(context).colorScheme.primary,
        borderRadius: BorderRadius.circular(16),
        clipBehavior: Clip.antiAlias,
        child: InkWell(
          onTap: () {
            print("Move me to the event screen");
          },
          child: Padding(
            padding: EdgeInsets.all(3.5),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Padding(
                  padding: EdgeInsets.only(top: 3, bottom: 3.5),
                  child: Text(
                    entity?.title ?? "No Data",
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      color: Theme.of(context).colorScheme.onPrimary,
                      fontWeight: FontWeight.w500,
                      fontSize: 18,
                    ),
                  ),
                ),
                KeeperChipTile(
                  fieldName: "Places",
                  values: placeValues,
                  padding: EdgeInsets.zero,
                ),
                KeeperChipTile(
                  fieldName: "Characters",
                  values: characterValues,
                  padding: EdgeInsets.zero,
                ),
                KeeperFieldTile(
                  fieldName: "Description",
                  values: descriptionValues,
                  padding: EdgeInsets.zero,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
