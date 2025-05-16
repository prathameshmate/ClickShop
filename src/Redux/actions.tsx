//cart
export const add_To_Cart = (item: any) => {
  return {
    type: 'add_To_Cart',
    payload: item,
  };
};
export const remove_From_Cart = (id: any) => {
  return {
    type: 'remove_From_Cart',
    payload: id,
  };
};

//Wishlist
export const add_To_Wishlist = (item: any) => {
  return {
    type: 'add_To_Wishlist',
    payload: item,
  };
};
export const remove_From_Wishlist = (id: any) => {
  return {
    type: 'remove_From_Wishlist',
    payload: id,
  };
};

//address
export const add_Address = (item: any) => {
  return {
    type: 'add_Address',
    payload: item,
  };
};
export const delete_Address = (id: any) => {
  return {
    type: 'delete_Address',
    payload: id,
  };
};

// product
export const add_Product = (item: any) => {
  return {
    type: 'add_Product',
    payload: item,
  };
};
