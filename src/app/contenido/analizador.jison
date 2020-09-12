
/* description: Parses end executes mathematical expressions. */
%{
    const {Imprimir} = require('./Instrucciones/Imprimir');
    const {Tipo, tipos} = require('./AST/Tipo'); 
    const {Arbol} = require('./AST/Arbol'); 
    const {Primitivo} = require('./Expresiones/Primitivo');
    const {Aritmetica} = require('./Expresiones/Aritmetica');
    const {Relacional} = require('./Expresiones/Relacional');
    const {Logica} = require('./Expresiones/Logica');
    const {Return} = require('./Expresiones/Return');
    const {Continue} = require('./Expresiones/Continue');
    const {Break} = require('./Expresiones/Break');

    const {Identificador} = require('./Instrucciones/Identificador');
    const {Declaracion} = require('./Instrucciones/Declaracion');
    const {Asignacion} = require('./Instrucciones/Asignacion');
    const {If} = require('./Instrucciones/If');
    const {While} = require('./Instrucciones/While');
    const {Funcion} = require('./Instrucciones/Funcion');
    const {Llamada_funcion} = require('./Instrucciones/Llamada_funcion');

    function agregar_vars(arreglo, lista){
        if(arreglo[0] != ""){
                arreglo[1].forEach(element => {
                        lista.push(element);
                });
        }else{
                lista.push(arreglo[1]);
        }
        return lista;
    }
%}

/* lexical grammar */
%lex
 %options ranges

D                 [0-9]
NZ                [1-9]
Ds                ("0"|{NZ}{D}*)
BSL               "\\".
%s                comment

%%


"//".*                /* skip comments */
"/*"                  this.begin('comment');
<comment>"*/"         this.popState();
<comment>.            /* skip comment content*/
\s+                   /* skip whitespace */



"string"                return 'TK_STRING';
"number"                return 'TK_NUMBER';
"boolean"               return 'TK_BOOLEAN';
"void"                  return 'TK_VOID';
"var"                   return 'TK_VAR';
"let"                   return 'TK_LET';
"const"                 return 'TK_CONST';
"any"                   return 'TK_ANY';

"Array"                 return 'TK_ARRAY';
"push"                  return 'TK_PUSH';
"pop"                   return 'TK_POP';
"length"                return 'TK_LENGTH';

"if"                    return 'TK_IF';
"else"                  return 'TK_ELSE';

"switch"                return 'TK_SWITCH';
"case"                  return 'TK_CASE';
"default"               return 'TK_DEFAULT';

"for"                   return 'TK_FOR';
"of"                    return 'TK_OF';
"in"                    return 'TK_IN';

"while"                 return 'TK_WHILE';
"do"                    return 'TK_DO';

"break"                 return 'TK_BREAK';
"continue"              return 'TK_CONTINUE';
"return"                return 'TK_RETURN';

"function"              return 'TK_FUNCTION';


"console"               return 'TK_CONSOLE';
"log"                   return 'TK_LOG';

"true"                  return 'TK_TRUE';
"false"                 return 'TK_FALSE';



"{"                   return 'TK_LL_ABRE'; 
"}"                   return 'TK_LL_CIERRA';
"("                   return 'TK_P_ABRE';
")"                   return 'TK_P_CIERRA';
"["                   return 'TK_C_ABRE';
"]"                   return 'TK_C_CIERRA';
","                   return 'TK_COMA';
"?"                   return 'TK_INTERROGACION';
":"                   return 'TK_DOS_PUNTOS';
";"                   return 'TK_P_COMA';

"<="                  return 'TK_MENOR_IGUAL';
"<"                   return 'TK_MENOR';
"=="                  return 'TK_IGUAL_IGUAL';
">="                  return 'TK_MAYOR_IGUAL';
">"                   return 'TK_MAYOR';
"!="                  return 'TK_DISTINTO';

"||"                  return 'TK_OR';
"&&"                  return 'TK_AND';
"!"                   return 'TK_NOT';

"="                   return 'TK_IGUAL';
"+="                  return 'TK_MAS_IGUAL';
"-="                  return 'TK_MENOS_IGUAL';
"*="                  return 'TK_MULTI_IGUAL';
"/="                  return 'TK_DIV_IGUAL';
"%="                  return 'TK_MOD_IGUAL';

"++"                  return 'TK_MAS_MAS';
"+"                   return 'TK_MAS';
"--"                  return 'TK_MENOS_MENOS';
"-"                   return 'TK_MENOS';
"*"                   return 'TK_MULTI';
"/"                   return 'TK_DIV';
"%"                   return 'TK_MOD';
"^"                   return 'TK_ELEVADO';

"."                   return 'TK_PUNTO';

"null"                return 'TK_NULO';

[_a-zA-Z][a-zA-Z0-9_]* return 'TK_ID'; /* Varying form */
({Ds}"."{Ds}+)   			return 'TK_NUMERO';
{Ds}          				return 'TK_NUMERO';
"\"\""                return 'TK_CADENA';
"\""([^"]|{BSL})*"\"" return 'TK_CADENA';
"\'\'"                return 'TK_CADENA';
"\'"([^']|{BSL})*"\'" return 'TK_CADENA';

<<EOF>>               return 'EOF';
.  {};           
/lex
/* operator associations and precedence */

%right '?'
%left TK_ELSE
%left TK_OR
%left TK_AND
%left TK_IGUAL_IGUAL, TK_DISTINTO
%left TK_MAYOR_IGUAL, TK_MENOR_IGUAL, TK_MENOR, TK_MAYOR
%left TK_MAS TK_MENOS TK_MAS_MAS TK_MENOS_MENOS
%left TK_POR TK_DIV TK_MOD
%left '**'


%right TK_NOT
%left UMENOS

%start INIT

%% /* language grammar */

/*INICIO DE GRAMATICA*/
INIT    :   SENTENCIAS EOF {$$ = new Arbol($1); console.log($1); return $$;}
;

FUNCION   :   TK_FUNCTION TK_ID PARAMETROS  CONT_FUNCION {$$ = new Funcion($2,$3,$4,null,0,0);}
          |   TK_FUNCTION TK_ID PARAMETROS TK_DOS_PUNTOS TIPO CONT_FUNCION {$$ = new Funcion($2,$3,$6,$5,0,0);}
;

CONT_FUNCION    :    TK_LL_ABRE LISTA_CONT_FUNCION TK_LL_CIERRA {$$ = $2;}
                |    TK_LL_ABRE TK_LL_CIERRA {$$ = [];}
;

LISTA_CONT_FUNCION    :    LISTA_CONT_FUNCION  CONT_BLOQUE_FUNCION { $$ = $1; $$ = agregar_vars($2, $$);}
                      |    CONT_BLOQUE_FUNCION  {$$ = []; $$ = agregar_vars($1, $$);}   
;

CONT_BLOQUE_FUNCION     :     SENTENCIAS {$$ = ["sent",$1];}
                        |     FUNCION  {$$ = ["",$1];}
;


PARAMETROS   :   TK_P_ABRE LISTA_PARAMETROS TK_P_CIERRA {$$ = $2;}
             |   TK_P_ABRE TK_P_CIERRA {$$ = [];}
;

LISTA_PARAMETROS    :    LISTA_PARAMETROS TK_COMA PARAMETRO { $$ = $1; $$.push($3);}
                    |    PARAMETRO  {$$ = [$1];} 
;

PARAMETRO    :    TK_ID { $$ = new Declaracion(null, $1, null, 0,0);}
             |    TK_ID TK_DOS_PUNTOS TIPO { $$ = new Declaracion($3, $1, null,0,0);}   
;             

/******************************************* RAIZ *********************************************************/
SENTENCIAS    :   SENTENCIAS CONT_SENTENCIAS { $$ = $1; $$ = agregar_vars($2, $$);}
              |   CONT_SENTENCIAS {$$ = []; $$ = agregar_vars($1, $$);}   
;

/******************************************* CONTENIDO RAIZ **********************************************/
CONT_SENTENCIAS   :   IMPRIMIR {$$ = ["",$1];}
                  |   DECLARACION_VARIABLE {$$ = $1;}
                  |   ASiGNACION_VARIABLE {$$ = ["",$1];}  
                  |   SENTENCIA_IF {$$ = ["",$1];}
                  |   SENTENCIA_WHILE {$$ = ["",$1];} 
                  |   FUNCION {$$ = ["", $1];}   
                  |   LLAMADA_FUNCION{$$ = ["", $1];}
                  |   RETURN {$$ = ["",$1];}  
;
/******************************************* FIN RAIZ ****************************************************/

RETURN    :    TK_RETURN TK_P_COMA {$$ = new Return(null, 0,0);}
          |    TK_RETURN EXPRESION TK_P_COMA{$$ = new Return($2, 0,0);};



/******************************************* DECLARACION VAR *********************************************/
DECLARACION_VARIABLE    :     TIPO_DECLARACION LISTA_DECLARACION TK_P_COMA {$$ = [$1,$2];}
;

LISTA_DECLARACION     :     LISTA_DECLARACION TK_COMA DECLARACION { $$ = $1; $$.push($3);}
                      |     DECLARACION {$$ = [$1];}
;

DECLARACION     :     TK_ID { $$ = new Declaracion(null, $1, null, 0,0);}
                |     TK_ID TK_IGUAL EXPRESION { $$ = new Declaracion(null, $1, $3, 0,0);}
                |     TK_ID TK_DOS_PUNTOS TIPO { $$ = new Declaracion($3, $1, null,0,0);}
                |     TK_ID TK_DOS_PUNTOS TIPO TK_IGUAL EXPRESION { $$ = new Declaracion($3, $1, $5,0,0);}
;          

TIPO_DECLARACION    :   TK_LET  {$$ = $1;}
                    |   TK_CONST {$$ = $1;}
;  
/******************************************* FIN DECLARACION VAR *****************************************/

/******************************************* ASGNACION VAR ***********************************************/
ASiGNACION_VARIABLE     :     TK_ID TK_IGUAL EXPRESION TK_P_COMA {$$ = new Asignacion($1,$3,0,0);}
;
/******************************************* FIN ASIGNACION VAR ******************************************/

SENTENCIA_IF    :    TK_IF CONDICIONAL CONT_CONTROL{$$ = new If($2, $3, [],0,0);}
                |    TK_IF CONDICIONAL CONT_CONTROL TK_ELSE CONT_CONTROL {$$ = new If($2, $3, $5,0,0);}
                |    TK_IF CONDICIONAL CONT_CONTROL TK_ELSE IF{$$ = new If($2, $3, [$5],0,0);}
;

SENTENCIA_WHILE   :   TK_WHILE CONDICIONAL CONT_CONTROL {$$ = new While($2, $3,0,0);}
;

CONDICIONAL   :   TK_P_ABRE EXPRESION TK_P_CIERRA {$$ = $2;}
;

CONT_CONTROL   :   TK_LL_ABRE SENTENCIAS TK_LL_CIERRA {$$ = $2;}
               |   TK_LL_ABRE TK_LL_CIERRA {$$ = [];}
;

IMPRIMIR    :   TK_CONSOLE TK_PUNTO TK_LOG TK_P_ABRE EXPRESION TK_P_CIERRA TK_P_COMA
                {$$ = new Imprimir($5, 0, 0);}
;   

TIPO    :   TK_NUMBER   { $$ = new Tipo(tipos.NUMBER);}
        |   TK_STRING   { $$ = new Tipo(tipos.STRING);}
        |   TK_VOID     { $$ = new Tipo(tipos.VOID);}
        |   TK_BOOLEAN  { $$ = new Tipo(tipos.BOOLEAN);}
        |   TK_ANY      { $$ = new Tipo(tipos.ANY);}
;

LLAMADA_FUNCION    :   LLAMADA_FUNCION_EXP TK_P_COMA {$$ = $1;}
;

LLAMADA_FUNCION_EXP    :    TK_ID CONT_LLAMADA  {$$ = new Llamada_funcion($1,$2, 0,0);}
;      

CONT_LLAMADA    :    TK_P_ABRE TK_P_CIERRA {$$ = [];}
                |    TK_P_ABRE LISTA_CONT_LLAMADA TK_P_CIERRA {$$ = $2}
;
LISTA_CONT_LLAMADA   :   LISTA_CONT_LLAMADA TK_COMA EXPRESION {$$ = $1; $$.push($3);}
                     |   EXPRESION { $$ = [$1];}
;

EXPRESION   :   EXPRESION TK_MAS EXPRESION {$$ = new Aritmetica($1,$3,$2,_$.first_line, _$.first_column);}
            |   EXPRESION TK_MENOS EXPRESION {$$ = new Aritmetica($1,$3,$2,_$.first_line, _$.first_column);}    
            |   EXPRESION TK_MULTI EXPRESION {$$ = new Aritmetica($1,$3,$2,_$.first_line, _$.first_column);}    
            |   EXPRESION TK_DIV EXPRESION {$$ = new Aritmetica($1,$3,$2,_$.first_line, _$.first_column);}    
            |   EXPRESION TK_MAYOR EXPRESION {$$ = new Relacional($1,$3,$2,0,0);}                
            |   EXPRESION TK_MENOR EXPRESION {$$ = new Relacional($1,$3,$2,0,0);}    
            |   EXPRESION TK_MAYOR_IGUAL EXPRESION {$$ = new Relacional($1,$3,$2,0,0);}    
            |   EXPRESION TK_MENOR_IGUAL EXPRESION {$$ = new Relacional($1,$3,$2,0,0);}    
            |   EXPRESION TK_IGUAL_IGUAL EXPRESION {$$ = new Relacional($1,$3,$2,0,0);}    
            |   EXPRESION TK_DISTINTO EXPRESION {$$ = new Relacional($1,$3,$2,0,0);}
            |   EXPRESION TK_AND EXPRESION {$$ = new Logica($1,$3,$2,0,0);}
            |   EXPRESION TK_OR EXPRESION {$$ = new Logica($1,$3,$2,0,0);}
            |   TK_NOT EXPRESION {$$ = new Logica($2,null,$1,0,0);}
            |   TK_CADENA   {$$ = new Primitivo(new Tipo(tipos.STRING), $1.replace(/\"/g,"").replace(/\'/g,""),_$.first_line, _$.first_column);}
            |   TK_NUMERO   {$$ = new Primitivo(new Tipo(tipos.NUMBER), Number($1),_$.first_line, _$.first_column);}        
            |   TK_ID       { $$ = new Identificador($1, _$.first_line, _$.first_column); }
            |   LLAMADA_FUNCION_EXP {$$  = $1;}
            |   TK_P_ABRE EXPRESION TK_P_CIERRA {$$ = $2;}         
;   



