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
export const reset_Cart = () => {
  return {
    type: 'reset_Cart',
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
export const reset_Wishlist = () => {
  return {
    type: 'reset_Wishlist',
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
export const reset_Address = () => {
  return {
    type: 'reset_Address',
  };
};

// product
export const add_Product = (item: any) => {
  return {
    type: 'add_Product',
    payload: item,
  };
};
