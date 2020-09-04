
/* description: Parses end executes mathematical expressions. */
%{
    

    import {Nodo} from './Nodo_AST.js';
    var temp = "";
    var funciones = new Array();
    /*function Nodo(nombre, tipo,hijos){
        this.nombre = nombre;
        this.tipo = tipo;
        this.hijos = hijos;

    }*/
    function Funcion(nombre,tipo, contenido){
        this.nombre = nombre;
        this.contenido = contenido;
        this.tipo = tipo;
    }

    function agregar_funcion(nombre, tipo, contenido){
        var agregado = 0;
        for(i in funciones){
            if(funciones[i].nombre == nombre){
                funciones[i].contenido += "\n" + contenido;
                agregado = 1; 
            }
        }
        if(agregado == 0){
            funciones.push(new Funcion(nombre,tipo,contenido));
        }
    }
    function recorrer_funciones(){
        for(i in funciones){
            console.log("function " + funciones[i].nombre + "():void{ \n" + funciones[i].contenido + "\n}");
        }      
    }

    function recorrer_arbol(tmp, padre){
         if(tmp != null){
            var hijos = new Array();
            hijos = tmp.hijos;
            if(tmp.tipo == "Funcion"){
                if(padre != ""){
                    padre += "_" + tmp.nombre;
                }else{
                    padre = tmp.nombre;
                }
                agregar_funcion(padre,tmp.tipo,"");
            }else if(tmp.tipo != "Raiz" && tmp.tipo != "Contenido"){
                agregar_funcion(padre,"",tmp.nombre);
            }
            for(i in hijos){
                recorrer_arbol(hijos[i], padre);
            }
         }   
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

"="                   return 'TK_TK_IGUAL';
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
['][']                return 'TK_CADENA';
"\'"([^']|{BSL})*"\'" return 'TK_CADENA';

<<EOF>>               return 'EOF';
.  {};           
/lex
/* operator associations and precedence */

%left '+' '-'
%left '*' '/'
%left '^'
%left UMINUS

%start INIT

%% /* language grammar */

INIT    :   RAIZ EOF {console.log($1);};

RAIZ    :   FUNCIONES {$$ = new Nodo("Raiz","Raiz",$1); recorrer_arbol($$,""); recorrer_funciones();};   

FUNCION     :   TK_FUNCTION TK_ID TK_P_ABRE TK_P_CIERRA TK_DOS_PUNTOS TIPO_FUNCION
                TK_LL_ABRE  TK_LL_CIERRA {$$ = new Nodo($2, "Funcion",[]);}
            |   TK_FUNCTION TK_ID TK_P_ABRE TK_P_CIERRA TK_DOS_PUNTOS TIPO_FUNCION 
                TK_LL_ABRE CONT_FUNCION  TK_LL_CIERRA {$$ = new Nodo($2,"Funcion",$8);} 
;

TIPO_FUNCION:   TK_NUMBER
            |   TK_STRING
            |   TK_VOID
            |   TK_BOOLEAN
            |   TK_ANY
;

CONT_FUNCION    :   CONT_FUNCION LIST_CONT_FUNCIONES {$$ = $1; $$.push(new Nodo("Contenido", "Contenido" , $2));}
                |   LIST_CONT_FUNCIONES {$$ = []; $$.push(new Nodo("Contenido","Contenido" , $1));}
;

LIST_CONT_FUNCIONES   :   FUNCIONES {$$ = $1;}
                      |   SENTENCIAS {$$ = $1;}
;


FUNCIONES   :   FUNCIONES FUNCION {$$ = $1; $$.push($2);}
            |   FUNCION {$$ = []; $$.push($1);}
;

SENTENCIAS  :   SENTENCIAS  CONT_SENTENCIAS {$$ = $1; $$.push($2);}
            |   CONT_SENTENCIAS {$$ = []; $$.push($1);}
;

CONT_SENTENCIAS :   TK_NUMBER {$$ = new Nodo($1, "Number", []);}
                |   TK_ID {$$ = new Nodo($1,"ID", []);}
;       
