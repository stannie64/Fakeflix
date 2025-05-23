import { createSelector } from "reselect";

const selectFolderItems = state => state.folderitems;

export const selectFolderItemsList = createSelector(
    [selectFolderItems],
    folderitems => folderitems.data
)