import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        userInfo: {
            id: null,
            email: "",
            firstName: "",
            lastName: "",
            isLoggedIn: false,
            albumQuizTaken: false,
        },
        albumJourney: {}
    },
    reducers: {
        updateId: (state, action) => {
            state.userInfo.id = action.payload;
        },
        updateEmail: (state, action) => {
            state.userInfo.email = action.payload;
        },
        updateFirstName: (state, action) => {
            state.userInfo.firstName = action.payload;
        },
        updateLastName: (state, action) => {
            state.userInfo.lastName = action.payload;
        },
        updateIsLoggedIn: (state, action) => {
            state.userInfo.isLoggedIn = action.payload;
        },
        updateAlbumQuizTaken: (state, action) => {
            state.userInfo.albumQuizTaken = action.payload;
        },
        updateAll: (state, action) => {
            state.userInfo = { ...state.userInfo, ...action.payload };
        },
    }
})

export const { updateAll, updateId, updateEmail, updateFirstName, updateLastName, updateIsLoggedIn, updateAlbumQuizTaken } = userSlice.actions
export default userSlice.reducer