import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  errorMessage: string;
  onClose: () => void;
  onConfirm: (projectName: string) => void;
}

const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({ isOpen, errorMessage, onClose, onConfirm }) => {
  const [projectName, setProjectName] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setProjectName("");
    }
  }, [isOpen]);

  const handleConfirm = () => {
    onConfirm(projectName);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogDescription className="text-red-600">Caso delete, todos os itens relacionados serão excluidos:</DialogDescription>
        <Input
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="mt-2 mb-4"
        />
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button variant="destructive" onClick={handleConfirm}>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
