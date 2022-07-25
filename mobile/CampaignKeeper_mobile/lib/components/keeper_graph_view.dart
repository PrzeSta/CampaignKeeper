import 'dart:collection';
import 'package:campaign_keeper_mobile/entities/session_ent.dart';
import 'package:collection/collection.dart';
import 'package:campaign_keeper_mobile/components/graph/event_node.dart';
import 'package:campaign_keeper_mobile/components/graph/start_node.dart';
import 'package:campaign_keeper_mobile/entities/event_ent.dart';
import 'package:flutter/material.dart';
import 'package:graphview/GraphView.dart';

// Produces functional graph for the given events.
class KeeperGraphView extends StatelessWidget {
  const KeeperGraphView({Key? key, required this.session, required this.events, required this.startKey})
      : super(key: key);
  final SessionEntity? session;
  final List<EventEntity> events;
  final startKey;

  SugiyamaConfiguration getBuilder() {
    return SugiyamaConfiguration()
      ..levelSeparation = 100
      ..nodeSeparation = 25
      ..iterations = 20
      ..orientation = SugiyamaConfiguration.ORIENTATION_TOP_BOTTOM;
  }

  // Uses a queue to determine which event's should be
  // part of the graph.
  Graph getGraph() {
    final Graph graph = Graph();

    final startNode = Node.Id(0);

    var eventMap = Map.fromIterable(events, key: (e) => e.id, value: (e) => e);
    var nodeMap = Map.fromIterable(events, key: (e) => e.id, value: (e) => Node.Id(e.id));
    Set<int> visibleNodes = {};

    var q = Queue.from(events.where((e) => e.parentIds.length == 0).map((e) => e.id));
    if (q.isNotEmpty) {
      while (q.isNotEmpty) {
        var id = q.removeFirst();
        var node = nodeMap[id] as Node;
        var event = eventMap[id] as EventEntity;

        if (event.parentIds.isEmpty) {
          graph.addEdge(startNode, node);
        } else {
          event.parentIds.forEach((e) {
            if (visibleNodes.contains(e)) {
              graph.addEdge(nodeMap[e]!, node);
            }
          });
        }

        visibleNodes.add(id);

        if (event.isShown) {
          event.childrenIds.forEach((e) {
            q.add(e);
          });
        }
      }
    } else {
      graph.addNode(startNode);
    }

    return graph;
  }

  Widget getNodeWidget(BuildContext context, int id) {
    if (id == 0) {
      return SizedBox(
        width: 280,
        child: KeeperStartNode(
          key: startKey,
          title: session?.name,
        ),
      );
    }

    var entity = events.firstWhereOrNull((e) => e.id == id);

    return ConstrainedBox(
      constraints: BoxConstraints(
        minWidth: 280,
        maxWidth: 280,
      ),
      child: KeeperEventNode(
        entity: entity,
        onTap: () {
          if (entity != null) {
            Navigator.of(context)
                .pushNamed('/start/campaign/session_map/event_explorer', arguments: entity.id);
          }
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return GraphView(
      graph: getGraph(),
      algorithm: SugiyamaAlgorithm(getBuilder()),
      paint: Paint()
        ..color = Theme.of(context).colorScheme.onBackground
        ..strokeWidth = 2.5
        ..style = PaintingStyle.stroke,
      builder: (Node node) {
        var id = node.key?.value as int;
        return getNodeWidget(context, id);
      },
    );
  }
}