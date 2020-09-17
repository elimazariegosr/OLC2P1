
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
    const {Do_while} = require('./Instrucciones/Do_while');
    const {Funcion} = require('./Instrucciones/Funcion');
    const {Llamada_funcion} = require('./Instrucciones/Llamada_funcion');
    const {Ternario} = require('./Instrucciones/Ternario');
    const {For} = require('./Instrucciones/For');
    const {Case} = require('./Instrucciones/Case');
    const {Default} = require('./Instrucciones/Default');
    const {Switch} = require('./Instrucciones/Switch');
    const {For_1} = require('./Instrucciones/For_1');
    
    let tipo_dec = "";
    let elseif = false;    
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
"type"                  return 'TK_TYPE';


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

%right TK_INTERROGACION
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

PARAMETRO    :    TK_ID { $$ = new Declaracion("let",null, $1, null, 0,0);}
             |    TK_ID TK_DOS_PUNTOS TIPO { $$ = new Declaracion("let",$3, $1, null,0,0);}   
;             

/******************************************* RAIZ *********************************************************/
SENTENCIAS    :   SENTENCIAS CONT_SENTENCIAS { $$ = $1; $$ = agregar_vars($2, $$);}
              |   CONT_SENTENCIAS {$$ = []; $$ = agregar_vars($1, $$);}   
;

/******************************************* CONTENIDO RAIZ **********************************************/
CONT_SENTENCIAS   :   IMPRIMIR {$$ = ["",$1];}
                  |   DECLARACION_VARIABLE {$$ = ["Si", $1];}
                  |   ASiGNACION_VARIABLE {$$ = ["",$1];}  
                  |   SENTENCIA_IF {$$ = ["",$1];}
                  |   SENTENCIA_WHILE {$$ = ["",$1];}
                  |   SENTENCIA_DO_WHILE {$$ = ["",$1];} 
                  |   FUNCION {$$ = ["", $1];}   
                  |   LLAMADA_FUNCION{$$ = ["", $1];}
                  |   RETURN {  $$ = ["",$1];}
                  |   SENTENCIA_FOR{$$ = ["", $1];}  
                  |   SENTENCIA_FOR_1 {$$ = ["", $1];}  
                  |   SENT_INC_DEC {$$ = ["",$1];}
                  |   SENTENCIA_SWITCH {$$ = ["",$1];}
                  |   BREAK {$$ = ["", $1];}
                  |   CONTINUE {$$ = ["", $1];}
                  |   DECLARACION_ARREGLO {$$ = ["", $1];}
                  |   DECLARACION_TYPE {$$ = ["", $1];}
                  |   ASIGNACION_TYPE {$$ = ["", $1];}
;
/******************************************* FIN RAIZ ****************************************************/

RETURN    :    TK_RETURN TK_P_COMA {$$ = new Return(null, 0,0);}0
          |    TK_RETURN EXPRESION TK_P_COMA{$$ = new Return($2, 0,0);}
;

BREAK   :   TK_BREAK TK_P_COMA{$$ = new Break(0,0);}
;

CONTINUE   :   TK_CONTINUE TK_P_COMA {$$ = new Continue(0,0);}  
;

/******************************************* DECLARACION VAR *********************************************/
DECLARACION_VARIABLE    :     TIPO_DECLARACION LISTA_DECLARACION TK_P_COMA {$$ = $2;}
;

LISTA_DECLARACION     :     LISTA_DECLARACION TK_COMA DECLARACION { $$ = $1; $$.push($3);}
                      |     DECLARACION {$$ = [$1];}
;

DECLARACION     :     TK_ID {console.log(tipo_dec); $$ = new Declaracion(tipo_dec,null, $1, null, 0,0);}
                |     TK_ID TK_IGUAL EXPRESION { $$ = new Declaracion(tipo_dec,null, $1, $3, 0,0);}
                |     TK_ID TK_DOS_PUNTOS TIPO { $$ = new Declaracion(tipo_dec,$3, $1, null,0,0);}
                |     TK_ID TK_DOS_PUNTOS TIPO TK_IGUAL EXPRESION { $$ = new Declaracion(tipo_dec,$3, $1, $5,0,0);}
;          

TIPO_DECLARACION    :   TK_LET  {$$ = $1; tipo_dec = $1;}
                    |   TK_CONST {$$ = $1;tipo_dec = $1;}
;  
/******************************************* FIN DECLARACION VAR *****************************************/

/******************************************* ASGNACION VAR ***********************************************/
ASiGNACION_VARIABLE     :    ASIGNACION TK_P_COMA  {$$ = $1;}
                        |    ASIGNACION TK_P_COMA  {$$ =$1;}
;

ASIGNACION    :    TK_ID TK_IGUAL EXPRESION {$$ = new Asignacion($1,$3,0,0);}
              |    SENT_INC_DEC {$$ = $1;}
;                   
/******************************************* FIN ASIGNACION VAR ******************************************/

/******************************************* DECLARACION ARREGLO *****************************************/
DECLARACION_ARREGLO   :   TIPO_DECLARACION TK_ID TK_DOS_PUNTOS TIPO TIPO_ARREGLO TK_P_COMA
                      |   TIPO_DECLARACION TK_ID TK_DOS_PUNTOS TIPO TIPO_ARREGLO TK_IGUAL CONT_ARREGLO TK_P_COMA
; 

CONT_ARREGLO   :   TK_C_ABRE LISTA_CONT_ARREGLO TK_C_C  IERRA
               |   CONT_TIPO_ARREGLO
;

LISTA_CONT_ARREGLO   :   LISTA_CONT_ARREGLO TK_COMA EXPRESION
                     |   EXPRESION
;

TIPO_ARREGLO   :   TIPO_ARREGLO CONT_TIPO_ARREGLO
               |   CONT_TIPO_ARREGLO
;

CONT_TIPO_ARREGLO   :   TK_C_ABRE TK_C_CIERRA 
;
/*************************************** FIN DECLARACION ARREGLO *****************************************/


/******************************************* DECLARACION TYPE ********************************************/
DECLARACION_TYPE    :    TK_TYPE TK_ID TK_IGUAL TK_LL_ABRE LISTA_CONT_TYPE TK_LL_CIERRA TK_P_COMA
;

LISTA_CONT_TYPE   :   LISTA_CONT_TYPE TK_COMA CONT_TYPE
                  |   CONT_TYPE
;

CONT_TYPE   :   TK_ID TK_DOS_PUNTOS TIPO
            |   TK_ID TK_DOS_PUNTOS TK_ID
;

/*************************************** FIN DECLARACION TYPE ********************************************/
ASIGNACION_TYPE    :   TK_ID TK_IGUAL TK_LL_ABRE  LISTA_ASIG_TYPE TK_LL_CIERRA TK_P_COMA
                   |   LISTA_ID_TYPE TK_IGUAL EXPRESION TK_P_COMA     
;

LISTA_ID_TYPE   :   LISTA_ID_TYPE TK_PUNTO TK_ID {$$ = $1; $$.push($3);}
                |   TK_ID {$$ = [$1];}
;               

LISTA_ASIG_TYPE    :   LISTA_ASIG_TYPE TK_COMA CONT_ASIG_TIPE {$$ = $1; $$.push($2);}
                   |   CONT_ASIG_TIPE {$$ = [$1];}
;

CONT_ASIG_TIPE   :   TK_ID TK_DOS_PUNTOS EXPRESION {$$ = [$1, $3];}
;


/******************************************* SENTENCIA SWITCH  *******************************************/
SENTENCIA_SWITCH   :   TK_SWITCH CONDICIONAL CONT_SWITCH {$$ = new Switch($2, $3,0,0);} 
;

CONT_SWITCH    :   TK_LL_ABRE LISTA_CASES TK_LL_CIERRA {$$ = $2;}
               |   TK_LL_ABRE TK_LL_CIERRA {$$ = [];}
;               

LISTA_CASES    :    LISTA_CASES CASES {$$ = $1; $$.push($2);}
              |    CASES {$$ = [$1];}
;

CASES    :    TK_CASE EXPRESION TK_DOS_PUNTOS CONT_CASE {$$ = new Case($2, $4,0,0);}
         |    TK_CASE EXPRESION TK_DOS_PUNTOS {$$ = new Case($2, [],0,0);}
         |    TK_DEFAULT TK_DOS_PUNTOS CONT_CASE {$$ = new Default($3,0,0);}
         |    TK_DEFAULT TK_DOS_PUNTOS {$$ = new Default([],0,0);}
;

CONT_CASE     :    CONT_CONTROL { $$ = $1;}
              |    SENTENCIAS {$$ = $1;}
;                    
/******************************************* FIN SENTENCIA SWITCH  ****************************************/

/******************************************* SENTENCIA IF   ***********************************************/
SENTENCIA_IF    :    TK_IF CONDICIONAL CONT_CONTROL{ $$ = new If(elseif,$2, $3, [],0,0);elseif = false;}
                |    TK_IF CONDICIONAL CONT_CONTROL TK_ELSE CONT_CONTROL {$$ = new If(false,$2, $3, $5,0,0);}
                |    TK_IF CONDICIONAL CONT_CONTROL TK_ELSE SENTENCIA_IF{elseif = true; $$ = new If(false,$2, $3, [$5],0,0);}
;
/******************************************* FIN SENTENCIA IF  ********************************************/


/******************************************* SENTENCIA WHILE  *********************************************/
SENTENCIA_WHILE   :   TK_WHILE CONDICIONAL CONT_CONTROL {$$ = new While($2, $3,0,0);}
;
/******************************************* FIN SENTENCIA WHILE  *****************************************/

SENTENCIA_DO_WHILE  :  TK_DO CONT_CONTROL TK_WHILE CONDICIONAL TK_P_COMA{$$ = new Do_while($4, $2,0,0);}
;

/************************ CONDICIONAL PARA DIVERSAS SENTENCIAS  *******************************************/
CONDICIONAL   :   TK_P_ABRE EXPRESION TK_P_CIERRA {$$ = $2;}
;


/************************** CONTENIDO PARA DIVERSAS SENTENCIAS  *******************************************/
CONT_CONTROL   :   TK_LL_ABRE SENTENCIAS TK_LL_CIERRA {$$ = $2;}
               |   TK_LL_ABRE TK_LL_CIERRA {$$ = [];}
;

/*******************************************  SENTENCIA FOR  **********************************************/
SENTENCIA_FOR   :   TK_FOR TK_P_ABRE ASING_DEC_FOR
                    TK_P_COMA EXPRESION TK_P_COMA 
                    ASIGNACION TK_P_CIERRA CONT_FOR
                    {$$ = new For($3,$5,$7,$9,0,0);}
;

CONT_FOR    :    TK_LL_ABRE TK_LL_CIERRA{$$ = [];}
            |    TK_LL_ABRE SENTENCIAS TK_LL_CIERRA{$$ = $2;}
;               

ASING_DEC_FOR   :    TK_LET DECLARACION {$2.tipo_declaracion = $1; $$ = $2;}
                |    ASiGNACION_VARIABLE {$$ = $1;}
;
/*******************************************  SENTENCIA FOR  **********************************************/

SENTENCIA_FOR_1   :   TK_FOR TK_P_ABRE TK_LET TK_ID TIPO_FOR_1 TK_ID TK_P_CIERRA CONT_FOR
                   {$$ = new For_1($4, $5, $6, $8,0,0);}     
;
TIPO_FOR_1   :   TK_IN {$$ = $1;}  
             |   TK_OF {$$ = $1;}
;

/*******************************************  SENTENCIA IMPRIMIR  *****************************************/
IMPRIMIR    :   TK_CONSOLE TK_PUNTO TK_LOG CONT_IMPRIMIR TK_P_COMA {$$ = new Imprimir($4, 0, 0);}
;   

CONT_IMPRIMIR   :    TK_P_ABRE EXPRESION TK_P_CIERRA {$$ = $2;}
                |    TK_P_ABRE TK_P_CIERRA{$$ = null;}
;
/*******************************************  FIN SENTENCIA IMPRIMIR  *************************************/

TIPO    :   TK_NUMBER   { $$ = new Tipo(tipos.NUMBER);}
        |   TK_STRING   { $$ = new Tipo(tipos.STRING);}
        |   TK_VOID     { $$ = new Tipo(tipos.VOID);}
        |   TK_BOOLEAN  { $$ = new Tipo(tipos.BOOLEAN);}
        |   TK_ANY      { $$ = new Tipo(tipos.ANY);}
        |   TK_ID       { $$ = $1;}
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

INC_DEC    :    TK_ID TK_MAS_MAS {$$ = new Aritmetica(new Identificador($1,0, 0),
                        new Primitivo(new Tipo(tipos.NUMBER), 1,0,0),"+",0,0);}
                |    TK_ID TK_MENOS_MENOS  {$$ = new Aritmetica(new Identificador($1,0, 0),
                        new Primitivo(new Tipo(tipos.NUMBER), 1,0,0),"-",0,0);}
;                 
 
SENT_INC_DEC    :  INC_DEC {$$ = new Asignacion($1.nodo_izquierdo.id,$1,0,0);}
;
EXPRESION   :   EXPRESION TK_MAS EXPRESION {$$ = new Aritmetica($1,$3,$2, _$.first_line, _$.first_column);}
            |   EXPRESION TK_MENOS EXPRESION {$$ = new Aritmetica($1,$3,$2, _$.first_line, _$.first_column);}    
            |   EXPRESION TK_MULTI EXPRESION {$$ = new Aritmetica($1,$3,$2, _$.first_line, _$.first_column);}    
            |   EXPRESION TK_DIV EXPRESION {$$ = new Aritmetica($1,$3,$2, _$.first_line, _$.first_column);}    
            |   EXPRESION TK_MAYOR EXPRESION {$$ = new Relacional($1,$3,$2,0,0);}                
            |   EXPRESION TK_MENOR EXPRESION {$$ = new Relacional($1,$3,$2,0,0);}    
            |   EXPRESION TK_MAYOR_IGUAL EXPRESION {$$ = new Relacional($1,$3,$2,0,0);}    
            |   EXPRESION TK_MENOR_IGUAL EXPRESION {$$ = new Relacional($1,$3,$2,0,0);}    
            |   EXPRESION TK_IGUAL_IGUAL EXPRESION {$$ = new Relacional($1,$3,$2,0,0);}    
            |   EXPRESION TK_DISTINTO EXPRESION {$$ = new Relacional($1,$3,$2,0,0);}
            |   EXPRESION TK_AND EXPRESION {$$ = new Logica($1,$3,$2,0,0);}
            |   EXPRESION TK_OR EXPRESION {$$ = new Logica($1,$3,$2,0,0);}
            |   TK_NOT EXPRESION {$$ = new Logica($2,null,$1,0,0);}
            |   EXPRESION TK_INTERROGACION EXPRESION TK_DOS_PUNTOS EXPRESION
                        { $$ = new Ternario(new Tipo(tipos.BOOLEAN),$1,$3,$5);}
            |   TK_CADENA   {$$ = new Primitivo(new Tipo(tipos.STRING), $1.replace(/\"/g,"").replace(/\'/g,""),_$.first_line, _$.first_column);}
            |   TK_NUMERO   {$$ = new Primitivo(new Tipo(tipos.NUMBER), Number($1),_$.first_line, _$.first_column);}        
            |   TK_NUMERO   {$$ = new Primitivo(new Tipo(tipos.NUMBER), Number($1),_$.first_line, _$.first_column);}        
            |   TK_ID       { $$ = new Identificador($1, _$.first_line, _$.first_column); }
            |   LLAMADA_FUNCION_EXP {$$  = $1;}
            |   INC_DEC {$$ = $1;}
            |   TK_P_ABRE EXPRESION TK_P_CIERRA {$$ = $2;}         
;   


