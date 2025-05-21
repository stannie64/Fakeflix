import { folderItemsActionTypes } from "./folderitems.types";
import { getFolderItems } from "../../firebase/firebaseUtils";

export const fetchFolderItemsRequest = () => ({
    type: folderItemsActionTypes.FETCH_ITEMS_REQUEST,
});

export const fetchFolderItemsSuccess = (folderitems) => ({
    type: folderItemsActionTypes.FETCH_ITEMS_SUCCESS,
    payload: folderitems,
});

export const fetchFolderItemsFailure = error => ({
    type: folderItemsActionTypes.FETCH_ITEMS_FAILURE,
    payload: error,
});

export const fetchFolderItemsAsync = (folderList) => {
    return async(dispatch) => {
        dispatch(fetchFolderItemsRequest());
        try {
            const res = await getFolderItems(folderList);
            dispatch(fetchFolderItemsSuccess(res));
        } catch (error) {
            const errorMessage = error.message;
            dispatch(fetchFolderItemsFailure(errorMessage));
        }
    };
};