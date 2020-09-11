enum tipos{
    NUMBER,
    STRING,
    BOOLEAN,
    VOID,
    ANY
}

class Tipo{
    type: tipos;
    constructor(type: tipos){
        this.type = type;
    }
}

export {tipos, Tipo};