import 'package:campaign_keeper_mobile/entities/campaign_ent.dart';
import 'package:flutter/material.dart';

// List element representing a campaign.
class KeeperCampaignTile extends StatelessWidget {
  const KeeperCampaignTile({Key? key, required this.entity, this.onTap}) : super(key: key);

  final CampaignEntity entity;
  final void Function()? onTap;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.all(5.0),
      child: Card(
        color: Theme.of(context).colorScheme.secondary,
        child: ClipRRect(
          borderRadius: BorderRadius.circular(10.0),
          child: Stack(
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  ConstrainedBox(
                      constraints: BoxConstraints(
                        maxHeight: 130,
                        minHeight: 130,
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(5.0),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(10.0),
                          child: FittedBox(
                            fit: BoxFit.fitWidth,
                            child: entity.image,
                          ),
                        ),
                      )),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.start,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Center(
                          child: Padding(
                        padding: const EdgeInsets.fromLTRB(10.0, 3.0, 10.0, 10.0),
                        child: Text(
                          entity.name,
                          overflow: TextOverflow.ellipsis,
                          style: Theme.of(context).textTheme.headline6?.copyWith(
                                color: Theme.of(context).colorScheme.onSecondary,
                              ),
                        ),
                      )),
                    ],
                  ),
                ],
              ),
              Positioned.fill(
                child: Material(
                  color: Colors.transparent,
                  child: InkWell(
                    onTap: onTap,
                  ),
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}
