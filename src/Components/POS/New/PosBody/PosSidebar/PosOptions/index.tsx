import { AccountBalanceWallet, CardGiftcard, Description, Pause, Payments, ReceiptLong } from "@mui/icons-material";
import PaymentIcon from "@mui/icons-material/Payment";
import { type FC, type JSX } from "react";
import { useAppDispatch } from "../../../../../../Store/hooks";
import { setHoldBillDrawer } from "../../../../../../Store/Slices/DrawerSlice";
import { setAddPaymentModal, setCashControlModal, setCreditNoteModal, setOrderModal, setPaymentListModal, setRedeemLoyaltyModal } from "../../../../../../Store/Slices/ModalSlice";
import HoldBill from "./HoldBill";
import PaymentList from "./PaymentList";
import AddPayment from "./AddPayment";
import RedeemLoyalty from "./RedeemLoyalty";
import CreditNotes from "./CreditNotes";
import OrderList from "./OrderList";
import CashControl from "./CashControl";

const ActionItem: FC<{ icon: JSX.Element; label: string; onClick?: () => void }> = ({ icon, label, onClick }) => (
  <div onClick={onClick} className="flex flex-col items-center justify-center py-3 px-0.5 text-gray-700 dark:text-gray-400 odd:bg-gray-200 dark:odd:bg-gray-800 hover:bg-gray-100 hover:dark:bg-gray-700 cursor-pointer">
    <div className="text-lg">{icon}</div>
    <div className="text-xs text-center mt-1">{label}</div>
  </div>
);

const PosOption = () => {
  const dispatch = useAppDispatch();

  return (
    <>
      <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-3 border border-gray-300 bg-white dark:bg-gray-dark dark:border-gray-700 overflow-hidden rounded-md">
        <ActionItem icon={<Pause />} label="Hold Bill" onClick={() => dispatch(setHoldBillDrawer())} />
        <ActionItem icon={<Payments />} label="Payments" onClick={() => dispatch(setPaymentListModal())} />
        <ActionItem icon={<CardGiftcard />} label="Redeem Loyalty" onClick={() => dispatch(setRedeemLoyaltyModal())} />
        <ActionItem icon={<PaymentIcon />} label="Add Payment" onClick={() => dispatch(setAddPaymentModal())} />
        <ActionItem icon={<Description />} label="Credit Notes" onClick={() => dispatch(setCreditNoteModal())} />
        <ActionItem icon={<ReceiptLong />} label="Orders" onClick={() => dispatch(setOrderModal())} />
        <ActionItem icon={<AccountBalanceWallet />} label="Cash Control" onClick={() => dispatch(setCashControlModal())}/>
      </div>
      <HoldBill />
      <PaymentList />
      <RedeemLoyalty />
      <AddPayment />
      <CreditNotes />
      <OrderList />
      <CashControl />
    </>
  );
};

export default PosOption;
