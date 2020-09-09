
/* description: Parses end executes mathematical expressions. */
%{
    const {Imprimir} = require('./Instrucciones/Imprimir');
    const {Tipo, tipos} = require('./AST/Tipo'); 
    const {Arbol} = require('./AST/Arbol'); 
    const {Primitivo} = require('./Expresiones/Primitivo');
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

INIT    :   RAIZ EOF {$$ = new Arbol($1); return $$;}
;

RAIZ    :   RAIZ CONT_RAIZ { $$ = $1; $$.push($2);}
        |   CONT_RAIZ {$$ = [$1];}   
;

CONT_RAIZ   :   IMPRIMIR {$$ = $1;}
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

EXPRESION   :   EXPRESION TK_MAS EXPRESION   
            |   TK_CADENA   {$$ = new Primitivo(new Tipo(tipos.STRING), $1.replace(/\"/g,"").replace(/\'/g,""),0,0);}
;   