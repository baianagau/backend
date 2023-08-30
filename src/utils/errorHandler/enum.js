const EnumErrors = {
    ROUTING_ERROR: {
        type: 1,
        statusCode: 404
    },
    INVALID_TYPES_ERROR: {
        type: 2,
        statusCode: 400
    },
    INVALID_FIELDS_VALUE_ERROR: {
        type: 3,
        statusCode: 400
    },
    INVALID_BODY_STRUCTURE_ERROR: {
        type: 4,
        statusCode: 400
    },
    NOT_FOUND_ENTITY_ID_ERROR: {
        type: 5,
        statusCode: 404
    },
    UNIQUE_KEY_VIOLATION_ERROR: {
        type: 6,
        statusCode: 400
    },    
    INVALID_PROGRAM_DATA_ERROR: {
        type: 7,
        statusCode: 500
    }, 
    BUSSINESS_TRANSACTION_ERROR: {
        type: 8,
        statusCode: 500
    },   
    DATABASE_ERROR: {
        type: 9,
        statusCode: 500
    }
};

export default EnumErrors;