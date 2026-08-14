import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FinanceState {
  selectedInvoiceId: string | null;
  paymentModalOpen: boolean;
  receiptDrawerOpen: boolean;
  statusFilter: "all" | "paid" | "partial" | "overdue";
}

const initialState: FinanceState = {
  selectedInvoiceId: null,
  paymentModalOpen: false,
  receiptDrawerOpen: false,
  statusFilter: "all",
};

export const financeSlice = createSlice({
  name: "finance",
  initialState,
  reducers: {
    setSelectedInvoiceId: (state, action: PayloadAction<string | null>) => {
      state.selectedInvoiceId = action.payload;
    },
    setPaymentModalOpen: (state, action: PayloadAction<boolean>) => {
      state.paymentModalOpen = action.payload;
    },
    setReceiptDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.receiptDrawerOpen = action.payload;
    },
    setStatusFilter: (
      state,
      action: PayloadAction<"all" | "paid" | "partial" | "overdue">
    ) => {
      state.statusFilter = action.payload;
    },
  },
});

export const {
  setSelectedInvoiceId,
  setPaymentModalOpen,
  setReceiptDrawerOpen,
  setStatusFilter,
} = financeSlice.actions;

export default financeSlice.reducer;
