const initialState: any = [];

const addressReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'add_Address':
      return [...state, action.payload];

    case 'delete_Address':
      return state.filter((item: any, index: any) => {
        return index !== action.payload;
      });
    case 'reset_Address':
      return initialState;
    default:
      return state;
  }
};

export default addressReducer;
