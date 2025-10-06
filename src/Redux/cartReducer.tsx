const initialState: any = [];

const cartReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'add_To_Cart':
      return [...state, action.payload];

    case 'remove_From_Cart':
      return state.filter((item: any, index: any) => {
        return item.id !== action.payload;
      });
    case 'reset_Cart':
      return initialState;
    default:
      return state;
  }
};

export default cartReducer;
