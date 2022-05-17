let initialState = {
    auth: false,
}

function reducer(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case "USER_LOGIN" : 
            return {
                ...state, auth: true};
        case "USER_LOGOUT" :
            return {
                ...state, auth: false};
        default: 
            return state
    }
}

export default reducer;