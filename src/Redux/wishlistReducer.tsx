const initialState: any = [];

const wishlistReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'add_To_Wishlist':
      return [...state, action.payload];

    case 'remove_From_Wishlist':
      return state.filter((item: any, index: any) => {
        return item.id !== action.payload;
      });
    case 'reset_Wishlist':
      return initialState;
    default:
      return state;
  }
};

export default wishlistReducer;
