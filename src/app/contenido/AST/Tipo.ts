enum tipos{
    NUMBER,
    STRING,
    BOOLEAN,
    VOID
}

class Tipo{
    type: tipos;

    constructor(type: tipos){
        this.type = type;
    }
}

export {tipos, Tipo};