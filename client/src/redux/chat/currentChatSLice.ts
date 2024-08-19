import { createSlice , PayloadAction } from "@reduxjs/toolkit";

interface CurrentChatState {
  currentChat : boolean;
}

const initialState: CurrentChatState = {
  currentChat : false,
};

export const currentChatSlice = createSlice({
    name : "currentChat",
    initialState,
    reducers : {
       setCurrentChat : (state , action : PayloadAction<boolean>)=>{
           state.currentChat = action.payload;
       }
    }
});

export const {setCurrentChat} = currentChatSlice.actions;
export default currentChatSlice.reducer;

