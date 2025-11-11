"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Edit } from "lucide-react";

export default function UpdatePriceAlertDialog({ alertId, currentPrice, onUpdate }: {
  alertId: string;
  currentPrice: number;
  onUpdate: (id: string, newPrice: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [newPrice, setNewPrice] = useState<string>(currentPrice.toString());

  const handleSubmit = () => {
    const parsed = parseFloat(newPrice);
    if (!isNaN(parsed)) {
      onUpdate(alertId, parsed);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="cursor-pointer-foreground cursor-pointer hover:text-foreground"
        >
          <div title="Update Price">
            <Edit className="w-4 h-4" />
          </div>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Target Price</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <label className="block text-sm font-medium text-muted-foreground">
            New Target Price (USD)
          </label>
          <Input
            type="text"
            value={newPrice}
            onChange={(e) => {
              const val = e.target.value;
              if (/^[0-9]*\.?[0-9]*$/.test(val)) setNewPrice(val);
            }}
            placeholder="Enter new target price"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" className="cursor-pointer" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-primary cursor-pointer text-primary-foreground hover:opacity-90">
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
