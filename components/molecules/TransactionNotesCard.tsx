import { useState, useEffect } from "react";
import { FileText, Edit, Save, X } from "lucide-react";
import Button from "@/components/atoms/Button";
import { Transaction } from "@/types/transactions";

interface TransactionNotesCardProps {
  transaction: Transaction;
  onSaveNotes: (notes: string) => Promise<void>;
}

export default function TransactionNotesCard({
  transaction,
  onSaveNotes,
}: TransactionNotesCardProps) {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editedNotes, setEditedNotes] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  // Initialize notes when transaction loads
  useEffect(() => {
    if (transaction?.additionalNotes) {
      setEditedNotes(transaction.additionalNotes);
    }
  }, [transaction]);

  const handleStartEditingNotes = () => {
    setIsEditingNotes(true);
    setEditedNotes(transaction?.additionalNotes || "");
  };

  const handleCancelEditingNotes = () => {
    setIsEditingNotes(false);
    setEditedNotes(transaction?.additionalNotes || "");
  };

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    try {
      await onSaveNotes(editedNotes);
      setIsEditingNotes(false);
    } catch (error) {
      // Error is handled by parent component
    } finally {
      setIsSavingNotes(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Notes</h3>
        </div>
        {!isEditingNotes && (
          <Button variant="outline" size="sm" onClick={handleStartEditingNotes}>
            <Edit className="w-4 h-4" />
          </Button>
        )}
      </div>

      {isEditingNotes ? (
        <div className="bg-muted/30 rounded-lg p-4 space-y-3">
          <textarea
            value={editedNotes}
            onChange={(e) => setEditedNotes(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            rows={4}
            placeholder="Add notes about this transaction..."
            disabled={isSavingNotes}
          />
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancelEditingNotes}
              disabled={isSavingNotes}
            >
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSaveNotes}
              disabled={isSavingNotes}
            >
              <Save className="w-4 h-4 mr-1" />
              {isSavingNotes ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-muted/30 rounded-lg p-4">
          {transaction.additionalNotes ? (
            <p className="text-sm text-foreground whitespace-pre-wrap">
              {transaction.additionalNotes}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              No notes added yet. Click the edit button to add notes.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
