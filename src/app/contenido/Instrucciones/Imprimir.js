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
exports.Imprimir = void 0;
var Nodo_1 = require("../AST/Nodo");
var Tipo_1 = require("../AST/Tipo");
var Tipo_2 = require("../AST/Tipo");
var Imprimir = /** @class */ (function (_super) {
    __extends(Imprimir, _super);
    function Imprimir(expresion, linea, columna) {
        var _this = _super.call(this, new Tipo_1.Tipo(Tipo_2.tipos.VOID), linea, columna) || this;
        _this.expresion = expresion;
        return _this;
    }
    Imprimir.prototype.ejecutar = function (tabla, arbol) {
        var value = this.expresion.ejecutar(tabla, arbol);
        arbol.consola.push(value);
        return null;
    };
    return Imprimir;
}(Nodo_1.Nodo));
exports.Imprimir = Imprimir;
