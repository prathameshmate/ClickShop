const initialState: any = [];

const productsReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'add_Product':
      return [...action.payload];

    default:
      return state;
  }
};

export default productsReducer;
