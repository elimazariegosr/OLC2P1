"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.Primitivo = void 0;
var Nodo_1 = require("../AST/Nodo");
var Primitivo = /** @class */ (function (_super) {
    __extends(Primitivo, _super);
    function Primitivo(tipo, valor, linea, columna) {
        var _this = _super.call(this, tipo, linea, columna) || this;
        _this.valor = valor;
        return _this;
    }
    Primitivo.prototype.ejecutar = function (tabla, arbol) {
        return this.valor;
    };
    return Primitivo;
}(Nodo_1.Nodo));
exports.Primitivo = Primitivo;
