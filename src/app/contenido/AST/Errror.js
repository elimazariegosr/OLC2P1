"use strict";
exports.__esModule = true;
exports.Errror = void 0;
var Errror = /** @class */ (function () {
    function Errror(tipo, desc, linea, columna) {
        this.tipo = tipo;
        this.desc = desc;
        this.linea = linea;
        this.columna = columna;
    }
    return Errror;
}());
exports.Errror = Errror;
