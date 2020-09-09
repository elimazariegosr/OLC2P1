"use strict";
exports.__esModule = true;
exports.Tabla = void 0;
var Tabla = /** @class */ (function () {
    function Tabla(t_anterior) {
        this.t_anterior = t_anterior;
        this.variables = new Map();
    }
    Tabla.prototype.set_var = function (simbolo) {
        var t_actual;
        for (t_actual = this; t_actual != null; t_actual = t_actual.t_anterior) {
            for (var _i = 0, _a = Array.from(t_actual.variables.keys()); _i < _a.length; _i++) {
                var key = _a[_i];
                if (key === simbolo.id) {
                    return "La variable " + key + " ya ha sido declarada.";
                }
            }
        }
        this.variables.set(simbolo.id, simbolo);
        return null;
    };
    Tabla.prototype.get_var = function (identifier) {
        var t_actual;
        for (t_actual = this; t_actual != null; t_actual = t_actual.t_anterior) {
            for (var _i = 0, _a = Array.from(t_actual.variables.keys()); _i < _a.length; _i++) {
                var key = _a[_i];
                if (key === identifier) {
                    return t_actual.variables.get(key);
                }
            }
        }
        return null;
    };
    return Tabla;
}());
exports.Tabla = Tabla;
