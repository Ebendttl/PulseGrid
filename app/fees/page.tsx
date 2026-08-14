"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/store";
import { setSelectedInvoiceId, setPaymentModalOpen, setReceiptDrawerOpen, setStatusFilter } from "@/store/financeSlice";
import { apiClient } from "@/lib/apiClient";
import { Invoice, Transaction } from "@/types/domain";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { toast } from "sonner";
import {
  CreditCard,
  CheckCircle,
  AlertTriangle,
  FileText,
  DollarSign,
  Download,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

// Zod Schema for payment form
const paymentSchema = z.object({
  amount: z.number().min(1, "Payment amount must be greater than $0"),
  paymentMethod: z.enum(["Credit Card", "Bank Transfer", "Mobile Money", "Cash"]),
  reference: z.string().min(3, "Reference code required"),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

export default function FeesPage() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const { user, role } = useAppSelector((state) => state.auth);
  const { selectedInvoiceId, paymentModalOpen, receiptDrawerOpen, statusFilter } = useAppSelector(
    (state) => state.finance
  );

  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [pdfError, setPdfError] = useState(false);

  // Queries
  const { data: invoices = [], isLoading: loadingInvoices } = useQuery<Invoice[]>({
    queryKey: ["invoices"],
    queryFn: async () => (await apiClient.get("/invoices")).data,
  });

  const { data: transactions = [] } = useQuery<Transaction[]>({
    queryKey: ["transactions"],
    queryFn: async () => (await apiClient.get("/transactions")).data,
  });

  // Filter invoices for student or role
  const userInvoices = invoices.filter((inv) => {
    if (role === "student" && user?.studentId) {
      return inv.studentId === user.studentId;
    }
    if (statusFilter === "all") return true;
    return inv.status === statusFilter;
  });

  const selectedInvoice = invoices.find((i) => i.id === selectedInvoiceId);

  // Aggregates
  const totalInvoiced = userInvoices.reduce((sum, i) => sum + i.amount, 0);
  const totalPaid = userInvoices.reduce((sum, i) => sum + i.amountPaid, 0);
  const totalOutstanding = totalInvoiced - totalPaid;
  const isZeroBalance = totalOutstanding === 0;

  // React Hook Form for Payment
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: selectedInvoice ? selectedInvoice.amount - selectedInvoice.amountPaid : 100,
      paymentMethod: "Credit Card",
      reference: `PAY-${Math.floor(100000 + Math.random() * 900000)}`,
    },
  });

  // Payment Mutation
  const paymentMutation = useMutation({
    mutationFn: async (data: PaymentFormData) => {
      if (!selectedInvoice) throw new Error("No invoice selected");

      const newAmountPaid = selectedInvoice.amountPaid + data.amount;
      const newStatus =
        newAmountPaid >= selectedInvoice.amount
          ? "paid"
          : newAmountPaid > 0
          ? "partial"
          : "unpaid";

      // Update invoice
      await apiClient.patch(`/invoices/${selectedInvoice.id}`, {
        amountPaid: newAmountPaid,
        status: newStatus,
      });

      // Post transaction record
      const newTransaction: Partial<Transaction> = {
        invoiceId: selectedInvoice.id,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        date: new Date().toISOString(),
        reference: data.reference,
      };
      await apiClient.post("/transactions", newTransaction);
    },
    onSuccess: () => {
      toast.success("Payment recorded successfully.");
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      dispatch(setPaymentModalOpen(false));
      reset();
    },
    onError: () => {
      toast.error("Payment transaction failed. Please check details and try again.");
    },
  });

  const onSubmitPayment = (data: PaymentFormData) => {
    paymentMutation.mutate(data);
  };

  const handleOpenPaymentModal = (invoice: Invoice) => {
    dispatch(setSelectedInvoiceId(invoice.id));
    setValue("amount", invoice.amount - invoice.amountPaid);
    setValue("reference", `PAY-${Math.floor(100000 + Math.random() * 900000)}`);
    dispatch(setPaymentModalOpen(true));
  };

  const handleOpenReceipt = (invoice: Invoice) => {
    dispatch(setSelectedInvoiceId(invoice.id));
    setPdfError(false);
    dispatch(setReceiptDrawerOpen(true));
  };

  // PDF Export via html2pdf.js dynamically imported
  const handleDownloadPDF = async () => {
    try {
      setPdfGenerating(true);
      setPdfError(false);
      const element = document.getElementById("receipt-print-area");
      if (!element) throw new Error("Receipt element not found");

      const html2pdf = (await import("html2pdf.js")).default;
      const opt = {
        margin: 10,
        filename: `PulseGrid_Receipt_${selectedInvoice?.id || "invoice"}.pdf`,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as const },
      };

      await html2pdf().set(opt).from(element).save();
      toast.success("PDF receipt downloaded.");
    } catch {
      setPdfError(true);
      toast.error("PDF generation failed. Please use retry affordance.");
    } finally {
      setPdfGenerating(false);
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-pg-line pb-4">
          <div>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-pg-ink">
              Fees & Finance Portal
            </h1>
            <p className="text-xs text-pg-muted">
              Invoice ledger, online payment processing, and verifiable PDF receipts.
            </p>
          </div>
        </div>

        {/* Aggregate Financial Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4 border-l-4 border-l-pg-signal-blue">
            <p className="text-xs font-semibold text-pg-muted uppercase">Total Invoiced</p>
            <p className="font-mono-tabular text-2xl font-bold text-pg-ink">
              {formatCurrency(totalInvoiced)}
            </p>
          </Card>

          <Card className="p-4 border-l-4 border-l-pg-pulse-teal">
            <p className="text-xs font-semibold text-pg-muted uppercase">Total Paid</p>
            <p className="font-mono-tabular text-2xl font-bold text-pg-pulse-teal">
              {formatCurrency(totalPaid)}
            </p>
          </Card>

          <Card className={`p-4 border-l-4 ${isZeroBalance ? "border-l-pg-pulse-teal" : "border-l-pg-risk-red"}`}>
            <p className="text-xs font-semibold text-pg-muted uppercase">Balance Due</p>
            <p className={`font-mono-tabular text-2xl font-bold ${isZeroBalance ? "text-pg-pulse-teal" : "text-pg-risk-red"}`}>
              {formatCurrency(totalOutstanding)}
            </p>
          </Card>
        </div>

        {/* Edge Case 1: Zero Balance State Banner */}
        {isZeroBalance && (
          <div className="p-4 rounded-[8px] bg-pg-pulse-teal/10 border border-pg-pulse-teal/30 text-pg-pulse-teal flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 shrink-0" />
            <div>
              <h4 className="font-semibold text-sm">All fees settled — nothing due!</h4>
              <p className="text-xs opacity-90">
                Your account holds a zero balance. All semester invoices have been fully paid.
              </p>
            </div>
          </div>
        )}

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {(["all", "overdue", "partial", "paid"] as const).map((st) => (
            <Button
              key={st}
              size="sm"
              variant={statusFilter === st ? "default" : "outline"}
              onClick={() => dispatch(setStatusFilter(st))}
              className="capitalize text-xs min-h-[36px]"
            >
              {st}
            </Button>
          ))}
        </div>

        {/* Invoices List */}
        <Card className="shadow-flat">
          <CardHeader>
            <CardTitle className="text-base">Invoice Ledger</CardTitle>
            <CardDescription>Click any invoice to view receipt or post mock payment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {userInvoices.length > 0 ? (
              userInvoices.map((invoice) => {
                const isOverdue = invoice.status === "overdue";
                const isPaid = invoice.status === "paid";
                const remaining = invoice.amount - invoice.amountPaid;

                return (
                  <div
                    key={invoice.id}
                    className={`p-4 rounded-[6px] border bg-pg-paper/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                      /* Edge Case 2: Overdue items visually distinct red left border */
                      isOverdue
                        ? "border-l-4 border-l-pg-risk-red border-pg-line"
                        : "border-pg-line hover:border-pg-signal-blue/40"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-pg-ink">
                          {invoice.title}
                        </span>
                        <Badge
                          variant={
                            isPaid
                              ? "success"
                              : isOverdue
                              ? "destructive"
                              : "warning"
                          }
                          className="capitalize"
                        >
                          {invoice.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-pg-muted font-mono-tabular">
                        Student: {invoice.studentName} &bull; Due: {formatDate(invoice.dueDate)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <div className="text-right font-mono-tabular">
                        <div className="text-base font-bold text-pg-ink">
                          {formatCurrency(invoice.amount)}
                        </div>
                        {remaining > 0 && (
                          <div className="text-xs text-pg-risk-red font-semibold">
                            Due: {formatCurrency(remaining)}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {remaining > 0 && (
                          <Button
                            size="sm"
                            onClick={() => handleOpenPaymentModal(invoice)}
                            className="text-xs min-h-[44px]"
                          >
                            Pay Now
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenReceipt(invoice)}
                          className="text-xs min-h-[44px]"
                        >
                          <FileText className="h-4 w-4" />
                          <span>Receipt</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-pg-muted text-center py-8">
                No invoices found matching selected filter.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Mock Payment Dialog (Zod validated) */}
        <Dialog open={paymentModalOpen} onOpenChange={(open) => dispatch(setPaymentModalOpen(open))}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-pg-signal-blue" />
                <span>Process Payment</span>
              </DialogTitle>
              <DialogDescription>
                {selectedInvoice?.title} — Balance Due:{" "}
                <span className="font-mono-tabular font-bold text-pg-ink">
                  {selectedInvoice ? formatCurrency(selectedInvoice.amount - selectedInvoice.amountPaid) : "$0"}
                </span>
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmitPayment)} className="space-y-4 py-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-pg-ink">Amount ($)</label>
                <Input
                  type="number"
                  step="0.01"
                  {...register("amount", { valueAsNumber: true })}
                  className="font-mono-tabular"
                />
                {errors.amount && (
                  <p className="text-xs text-pg-risk-red">{errors.amount.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-pg-ink">Payment Method</label>
                <select
                  {...register("paymentMethod")}
                  className="h-11 w-full rounded-[6px] border border-pg-line bg-pg-surface px-3 py-2 text-xs font-semibold text-pg-ink focus:outline-none focus:ring-2 focus:ring-pg-signal-blue"
                >
                  <option value="Credit Card">Credit Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Mobile Money">Mobile Money</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-pg-ink">Transaction Reference</label>
                <Input {...register("reference")} className="font-mono-tabular text-xs" />
                {errors.reference && (
                  <p className="text-xs text-pg-risk-red">{errors.reference.message}</p>
                )}
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => dispatch(setPaymentModalOpen(false))}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={paymentMutation.isPending}>
                  {paymentMutation.isPending ? "Processing..." : "Confirm Payment"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Receipt PDF View Dialog */}
        <Dialog open={receiptDrawerOpen} onOpenChange={(open) => dispatch(setReceiptDrawerOpen(open))}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-pg-pulse-teal" />
                <span>Payment Receipt</span>
              </DialogTitle>
            </DialogHeader>

            {selectedInvoice ? (
              <div className="space-y-4">
                {/* Printable receipt content box */}
                <div
                  id="receipt-print-area"
                  className="p-5 rounded-[8px] border border-pg-line bg-pg-surface space-y-4 text-xs font-mono-tabular"
                >
                  <div className="border-b border-pg-line pb-3 flex justify-between items-center">
                    <div>
                      <h3 className="font-heading font-bold text-base text-pg-ink">PulseGrid SIMS</h3>
                      <p className="text-[10px] text-pg-muted">Official Payment Receipt</p>
                    </div>
                    <Badge variant={selectedInvoice.status === "paid" ? "success" : "warning"}>
                      {selectedInvoice.status.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="space-y-1 text-pg-ink">
                    <p>Receipt ID: <span className="font-semibold">{selectedInvoice.id}</span></p>
                    <p>Student: <span className="font-semibold">{selectedInvoice.studentName}</span></p>
                    <p>Item: <span className="font-semibold">{selectedInvoice.title}</span></p>
                    <p>Issued: <span>{formatDate(selectedInvoice.issuedDate)}</span></p>
                  </div>

                  <div className="border-t border-b border-pg-line py-3 space-y-1">
                    <div className="flex justify-between text-pg-muted">
                      <span>Total Amount:</span>
                      <span>{formatCurrency(selectedInvoice.amount)}</span>
                    </div>
                    <div className="flex justify-between text-pg-pulse-teal font-semibold">
                      <span>Amount Paid:</span>
                      <span>{formatCurrency(selectedInvoice.amountPaid)}</span>
                    </div>
                    <div className="flex justify-between text-pg-risk-red font-bold">
                      <span>Balance Remaining:</span>
                      <span>{formatCurrency(selectedInvoice.amount - selectedInvoice.amountPaid)}</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-pg-muted text-center italic">
                    Thank you. This receipt is digitally generated by PulseGrid System of Record.
                  </p>
                </div>

                {/* PDF Error Affordance per Section 7.3 */}
                {pdfError && (
                  <div className="p-3 rounded-[6px] bg-pg-risk-red/10 border border-pg-risk-red/30 text-pg-risk-red text-xs flex items-center justify-between">
                    <span>PDF generation failed. Please try again.</span>
                    <Button size="sm" variant="outline" onClick={handleDownloadPDF}>
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>Retry</span>
                    </Button>
                  </div>
                )}

                <Button
                  onClick={handleDownloadPDF}
                  disabled={pdfGenerating}
                  className="w-full gap-2 min-h-[44px]"
                >
                  <Download className="h-4 w-4" />
                  <span>{pdfGenerating ? "Generating PDF..." : "Download PDF Receipt"}</span>
                </Button>
              </div>
            ) : null}
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}
