import 'dart:convert';
import 'package:campaign_keeper_mobile/entities/user_data_ent.dart';
import 'package:campaign_keeper_mobile/services/cache_util.dart';
import 'package:campaign_keeper_mobile/services/managers/base_manager.dart';
import 'package:campaign_keeper_mobile/services/helpers/request_helper.dart';

class UserDataManager extends BaseManager<UserDataEntity> {
  static const String _key = "UserData";
  UserDataEntity? _entity;

  UserDataManager();

  @override
  void attach(UserDataEntity entity) {
    _entity = entity;
    Map data = _encodeEntity(_entity!);

    CacheUtil().addSecure(_key, json.encode(data));
  }

  @override
  UserDataEntity? getEntity({int groupId = -1, int entId = -1}) {
    return _entity;
  }

  @override
  List<UserDataEntity> getEntities({int groupId = -1}) {
    List<UserDataEntity> entities = [];

    if (_entity != null) {
      entities.add(_entity!);
    }

    return entities;
  }

  @override
  Future<bool> refresh({int groupId = -1}) async {
    UserDataEntity? newEntity;

    if (_entity == null) {
      String? cache = await CacheUtil().getSecure(_key);

      if (cache != null) {
        newEntity = _decodeEntity(json.decode(cache));
      }
    }

    Response userResponse =
        await RequestHelper().get(endpoint: UserDataEntity.endpoint);

    if (userResponse.status == ResponseStatus.Success &&
        userResponse.data != null) {
      Map responseData = json.decode(userResponse.data!);

      if (_entity == null) {
        newEntity = new UserDataEntity(
            username: responseData["username"],
            email: responseData["email"],
            imageData: responseData["imageData"]);
      } else {
        if (_entity!.username != responseData["username"]) {
          _entity!.username = responseData["username"];
          newEntity = _entity!;
        }

        if (_entity!.email != responseData["email"]) {
          _entity!.email = responseData["email"];
          newEntity = _entity!;
        }

        if (_entity!.imageData != responseData["image"]) {
          _entity!.imageData = responseData["image"];
          newEntity = _entity!;
        }
      }
    }

    if (newEntity != null) {
      _entity = newEntity;

      notifyListeners();

      Map data = _encodeEntity(_entity!);
      CacheUtil().addSecure(_key, json.encode(data));

      return true;
    }

    return false;
  }

  @override
  void clear() {
    _entity = null;
  }

  UserDataEntity? _decodeEntity(Map data) {
    String? username = data["username"];
    String? email = data["email"];
    String? password = data["password"];
    String? imageData = data["imageData"];

    if (username != null && email != null) {
      UserDataEntity ent = new UserDataEntity(
          username: username,
          email: email,
          password: password,
          imageData: imageData);

      return ent;
    }

    return null;
  }

  Map _encodeEntity(UserDataEntity ent) {
    Map data = {
      "username": ent.username,
      "email": ent.email,
      "password": ent.password,
      "imageData": ent.imageData,
    };

    return data;
  }
}