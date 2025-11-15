interface IAuth{
    userId:string;
};

declare global{
    namespace Express{
        interface Request{
            auth:IAuth
        }
    }
};

export {};