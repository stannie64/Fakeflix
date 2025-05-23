import { createSelector } from "reselect";

const selectFolders = state => state.folder;

export const selectFolderList = createSelector(
    [selectFolders],
    folder => folder.data
)