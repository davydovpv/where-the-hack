"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var graphcool_lib_1 = require("graphcool-lib");
exports.default = function (event) { return __awaiter(_this, void 0, void 0, function () {
    var graphcool, api, facebookToken, facebookUser, user, userId, token, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(event);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 8, , 9]);
                graphcool = graphcool_lib_1.fromEvent(event);
                api = graphcool.api('simple/v1');
                facebookToken = event.data.facebookToken;
                return [4 /*yield*/, getFacebookUser(facebookToken)
                    // get graphcool user by facebook id
                ];
            case 2:
                facebookUser = _a.sent();
                return [4 /*yield*/, getGraphcoolUser(api, facebookUser.id)
                        .then(function (r) { return r.User; })
                    // check if graphcool user exists, and create new one if not
                ];
            case 3:
                user = _a.sent();
                userId = null;
                if (!!user) return [3 /*break*/, 5];
                return [4 /*yield*/, createGraphcoolUser(api, facebookUser)];
            case 4:
                userId = _a.sent();
                return [3 /*break*/, 6];
            case 5:
                userId = user.id;
                _a.label = 6;
            case 6: return [4 /*yield*/, graphcool.generateNodeToken(userId, 'User')];
            case 7:
                token = _a.sent();
                return [2 /*return*/, { data: { id: userId, token: token } }];
            case 8:
                e_1 = _a.sent();
                console.log(e_1);
                return [2 /*return*/, { error: 'An unexpected error occured during authentication.' }];
            case 9: return [2 /*return*/];
        }
    });
}); };
function getFacebookUser(facebookToken) {
    return __awaiter(this, void 0, void 0, function () {
        var endpoint, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    endpoint = "https://graph.facebook.com/v2.9/me?fields=id%2Cemail%2Cpicture%2Cname&access_token=" + facebookToken;
                    return [4 /*yield*/, fetch(endpoint)
                            .then(function (response) { return response.json(); })];
                case 1:
                    data = _a.sent();
                    if (data.error) {
                        throw new Error(JSON.stringify(data.error));
                    }
                    return [2 /*return*/, data];
            }
        });
    });
}
function getGraphcoolUser(api, facebookUserId) {
    return __awaiter(this, void 0, void 0, function () {
        var query, variables;
        return __generator(this, function (_a) {
            query = "\n    query getUser($facebookUserId: String!) {\n      User(facebookUserId: $facebookUserId) {\n        id\n      }\n    }\n  ";
            variables = {
                facebookUserId: facebookUserId,
            };
            return [2 /*return*/, api.request(query, variables)];
        });
    });
}
function createGraphcoolUser(api, facebookUser) {
    return __awaiter(this, void 0, void 0, function () {
        var mutation, variables;
        return __generator(this, function (_a) {
            mutation = "\n    mutation createUser($facebookUserId: String!, \n    $email: String, $profilePicUrl: String!, $name: String!) {\n      createUser(\n        facebookUserId: $facebookUserId\n        email: $email,\n        name: $name,\n        profilePicUrl: $profilePicUrl\n      ) {\n        id\n      }\n    }\n  ";
            variables = {
                facebookUserId: facebookUser.id,
                email: facebookUser.email,
                name: facebookUser.name,
                profilePicUrl: facebookUser.picture && facebookUser.picture.data && facebookUser.picture.data.url
            };
            return [2 /*return*/, api.request(mutation, variables)
                    .then(function (r) { return r.createUser.id; })];
        });
    });
}
