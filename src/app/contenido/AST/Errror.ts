class Errror{
    tipo: string;
    desc: string;
    linea: number;
    columna:number;
    
    constructor(tipo: string, desc: string, linea: number, columna: number) {
        this.tipo = tipo;
        this.desc = desc;
        this.linea = linea;
        this.columna = columna;
    }
}
export {Errror};