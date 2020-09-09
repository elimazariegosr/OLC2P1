"use strict";
exports.__esModule = true;
exports.Tipo = exports.tipos = void 0;
var tipos;
(function (tipos) {
    tipos[tipos["NUMBER"] = 0] = "NUMBER";
    tipos[tipos["STRING"] = 1] = "STRING";
    tipos[tipos["BOOLEAN"] = 2] = "BOOLEAN";
    tipos[tipos["VOID"] = 3] = "VOID";
})(tipos || (tipos = {}));
exports.tipos = tipos;
var Tipo = /** @class */ (function () {
    function Tipo(type) {
        this.type = type;
    }
    return Tipo;
}());
exports.Tipo = Tipo;
