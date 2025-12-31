"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = exports.Gender = void 0;
var Gender;
(function (Gender) {
    Gender["MALE"] = "MALE";
    Gender["FEMALE"] = "FEMALE";
    Gender["OTHERS"] = "OTHERS";
    Gender["NOT_PREFER"] = "NOT_PREFER";
})(Gender || (exports.Gender = Gender = {}));
var Role;
(function (Role) {
    Role["USER"] = "USER";
    Role["SUPER_ADMIN"] = "SUPER ADMIN";
    Role["ADMIN"] = "ADMIN";
})(Role || (exports.Role = Role = {}));
