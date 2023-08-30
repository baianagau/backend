import EnumErrors from "./enum.js";
export default (error, req, res, next) => {
    
    if (error.type) {
       
            const validErrorTypes = Object.values(EnumErrors).map(enumError => enumError.type);
            if (validErrorTypes.includes(error.type)) {
                return res.status(error.statusCode || 400).send({
                    status: 0,
                    errorObject: {
                        type: error.type,
                        name: error.name,
                        message: error.message,
                        recievedParams: error.recievedParams
                        }
                });
            }
        }
 
    //<default> Unhandled Internal Server Error
    res.status(error.statusCode || 500).send({
        status: 0,
        errorObject: {
            type: 999,
            name: 'Unhandled Internal Server Error',
            message: error.message
            }
        });
};