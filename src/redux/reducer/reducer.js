let initialState = {
    auth: false,
    modalState: false,
    modalAuth: false,
}

function reducer(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case "USER_LOGIN" : 
            return {...state, auth: true};
        case "USER_LOGOUT" :
            return {...state, auth: false};
        case "MODAL_OPEN" : 
            return {...state, modalState: true}
        case "MODAL_CLOSE" :
            return {...state, modalState: false}
        case "MODAL_LOGIN" : 
            return {...state, modalAuth: true}
        case "MODAL_LOGOUT" :
            return {...state, modalAuth: false}
        default: return { ...state }
    }
}

export default reducer;