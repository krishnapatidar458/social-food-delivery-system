import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { decreaseQuantity, increaseQuantity } from "../../redux/cartSlice";

const CartPage = () => {
  const { cartItems } = useSelector((store) => store.cart);
  const dispatch = useDispatch();

  const subtotal = cartItems.reduce((total, item) => {
    return total + item.quantity * item.price;
  }, 0);

  const taxRate = 0.07;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="h5"
        sx={{ mb: 2, fontWeight: 600, textAlign: "center" }}
      >
        Your Cart Summary
      </Typography>

      <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
        <Table sx={{ minWidth: 600 }} aria-label="cart table">
          <TableHead>
            <TableRow>
              <TableCell align="center" colSpan={3}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Orders
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle1" fontWeight="bold">
                  Price
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Name</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Qty.</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Unit Price</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Total</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell align="right">
                    <button
                      onClick={() =>
                        dispatch(decreaseQuantity({ _id: item._id }))
                      }
                      className="bg-red-200 px-2 rounded-md text-lg"
                    >
                      -
                    </button> 
                    { item.quantity } 
                    <button 
                      onClick={() =>
                        dispatch(increaseQuantity({ _id: item._id }))
                      }
                      className="bg-green-200 px-2 rounded-md text-lg"
                    >
                      +
                    </button>
                  </TableCell>
                  <TableCell align="right">{item.price}</TableCell>
                  <TableCell align="right">
                    {item.quantity * item.price}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No items in cart
                </TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell rowSpan={3} />
              <TableCell colSpan={2}>
                <strong>Subtotal</strong>
              </TableCell>
              <TableCell align="right">{subtotal.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>
                <strong>Tax (7%)</strong>
              </TableCell>
              <TableCell align="right">{tax.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>
                <strong>Grand Total</strong>
              </TableCell>
              <TableCell align="right">
                <strong>{total.toFixed(2)}</strong>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CartPage;
