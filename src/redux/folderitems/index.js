import { folderItemsActionTypes } from './folderitems.types';

const initialState = {
    loading: false,
    error: '', 
    data: []
}

const folderItemsReducer = (state = initialState, { type, payload }) => {
    switch(type) {
        case folderItemsActionTypes.FETCH_ITEMS_REQUEST:
            return {
                ...state,
                loading: true
            }
        case folderItemsActionTypes.FETCH_ITEMS_SUCCESS:
            return {
                ...state,
                data: payload,
                loading: false,
                error: ''
            }
        case folderItemsActionTypes.FETCH_ITEMS_FAILURE:
            return {
                ...state,
                data: [], 
                loading: false,
                error: payload
            }
        default:
            return state;
    }
}

export default folderItemsReducer