import 'dart:async';
import 'dart:convert';

import 'package:campaign_keeper_mobile/entities/base_entity.dart';
import 'package:campaign_keeper_mobile/services/cache_util.dart';
import 'package:campaign_keeper_mobile/services/helpers/database_helper.dart';
import 'package:campaign_keeper_mobile/types/entity_types.dart';
import 'package:flutter/material.dart';

// A hollow class used as a base for proper managers
// due to a lack of interfaces in dart.
class BaseManager<T extends BaseEntity> extends ChangeNotifier {
  final _db = DatabaseHelper();
  Future? lock;
  // Attaches given entity to the local base and caches it.
  // Might also update server.
  Future<void> attach(T entity) async {
    throw new UnimplementedError();
  }

  // Used to patch entities.
  Future<bool> patch({required T newEntity}) async {
    throw new UnimplementedError();
  }

  // Used to get specific entity.
  T? get({int entId = -1}) {
    throw new UnimplementedError();
  }

  // Used to get a list of entities.
  // Optional argument can be used to retrieve
  // a specific type of entities.
  List<T> getList({int groupId = -1}) {
    throw new UnimplementedError();
  }

  // Used to refresh entities from local cache
  // or from a server.
  Future<bool> refresh({EntityParameter? parameterName, int? parameterValue, bool online = true}) {
    throw new UnimplementedError();
  }

  // Used to clear data.
  void clear() {
    throw new UnimplementedError();
  }

  // Will put a lock on the manager.
  // Optionally if parameter is same as lock release value manager lock will be missed.
  Future<bool> lockOperation(Completer completer, {RefreshParameter? parameter}) async {
    if (lock != null) {
      dynamic res = await lock;
      if (parameter != null && res != null && res is RefreshParameter) {
        if (res.equals(parameter)) {
          return true;
        }
      }
    }

    lock = completer.future;

    return false;
  }

  // Releases the lock.
  // Optionally the lock can return refresh parameters on release.
  void releaseOperation(Completer completer, {RefreshParameter? parameter}) {
    lock = null;
    completer.complete(parameter);
  }

  // Locks given async method so it won't run in a race
  // with other functions.
  // If parameter is provided fun won't be run if it's the same as lock release value.
  Future<T> lockedOperation<T>(Future<T> fun(),
      {required T defaultResult, RefreshParameter? parameter}) async {
    var completer = Completer();
    bool lockRes = await lockOperation(completer, parameter: parameter);

    if (lockRes) {
      return defaultResult;
    }

    T res = await fun();

    releaseOperation(completer, parameter: parameter);

    return res;
  }

  Future<void> cacheList(List<T> list, String key) async {
    var data = list.map((e) => e.toMap()).toList();

    CacheUtil().add(key, json.encode(data));
  }

  Future<void> cacheMap(Map<int, List<T>> map, String key, List<int> filter) async {
    var data = [];

    map.forEach(
      (mapKey, list) {
        if (filter.isEmpty || filter.contains(mapKey)) {
          data.addAll(list.map((e) => e.toMap()));
        }
      },
    );

    CacheUtil().add(key, json.encode(data));
  }

  Future<void> cacheListToDb(String tableName, List<T> entities, {List<String>? excludedColumns}) async {
    List<Map<String, Object?>> maps = entities.map((e) {
      var map = e.toMap();

      if (excludedColumns != null && excludedColumns.isNotEmpty) {
        excludedColumns.forEach((column) {
          map.remove(column);
        });
      }

      return map;
    }).toList();

    await _db.delete(tableName);
    await _db.insertList(tableName, maps);
  }

  Future<List<Map>> getListFromDb(String tableName, {String? where, List<Object?>? whereArgs}) async {
    return await _db.get(tableName, where: where, whereArgs: whereArgs);
  }

  Future<List<Map>> getValues<T>({required String entityTable, String entityType = ''}) async {
    String valueTable = '';

    if (T == String) {
      valueTable = 'strings';
    } else if (T == int) {
      valueTable = 'integers';
    } else {
      return [];
    }

    return await _db
        .get(valueTable, where: 'entityTable = ? and entityType = ?', whereArgs: [entityTable, entityType]);
  }

  List<Map<String, Object>> listToValueMaps(List<Object> data,
      {required int entityId, required String entityTable, String entityType = ''}) {
    var valueMaps = data
        .map((e) => {
              'entityTable': entityTable,
              'entityType': entityType,
              'entityId': entityId,
              'value': e,
            })
        .toList();

    return valueMaps;
  }
}
