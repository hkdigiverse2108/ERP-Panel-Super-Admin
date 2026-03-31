import { PAGE_TITLE, ROUTES } from "../../../Constants";
import { Link } from "react-router-dom";

const Specials = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">{PAGE_TITLE.INVENTORY.SPECIALS.BASE}</h1>
        <Link to={ROUTES.SPECIALS.ADD_EDIT} className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
          Add Special Item
        </Link>
      </div>

      <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden text-black">
        <table className="w-full text-left">
          <thead className="bg-muted text-muted-foreground uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-4">Item Name</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr className="hover:bg-muted/50 transition-colors">
              <td className="px-6 py-4 font-medium">KitKat Large</td>
              <td className="px-6 py-4 text-sm font-semibold text-primary">₹30</td>
              <td className="px-6 py-4 text-xs text-muted-foreground line-clamp-1 max-w-[200px]">Special offer for this month</td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 bg-success/20 text-success text-[10px] font-bold rounded-full uppercase">Active</span>
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  <button className="text-primary hover:underline text-sm font-medium">Edit</button>
                  <button className="text-destructive hover:underline text-sm font-medium">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Specials;
