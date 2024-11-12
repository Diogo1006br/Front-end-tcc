import { useState } from 'react';
import { Button } from "@/components/ui/button"; 
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"; 
import { Input } from '@/components/ui/input'; 
import { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose } from '@/components/ui/toast'; 
import { Trash2 } from 'lucide-react'; 
import api from "@/Modules/Auth";

export function NewListSheet({ setHasChanged, hasChanged }) {
  const [newListFormData, setNewListFormData] = useState({
    listName: '',
    items: [{ id: Date.now(), number: 1, description: '' }],
  });

  const [toastMessage, setToastMessage] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleAddItem = () => {
    const newItemNumber = newListFormData.items.length + 1;
    setNewListFormData({
      ...newListFormData,
      items: [...newListFormData.items, { id: Date.now(), number: newItemNumber, description: '' }],
    });
  };

  const handleItemChange = (id, value) => {
    const updatedItems = newListFormData.items.map(item => 
      item.id === id ? { ...item, description: value } : item
    );
    setNewListFormData({ ...newListFormData, items: updatedItems });
  };

  const handleRemoveItem = (id) => {
    const updatedItems = newListFormData.items.filter(item => item.id !== id);
    const reindexedItems = updatedItems.map((item, index) => ({
      ...item,
      number: index + 1,
    }));
    setNewListFormData({ ...newListFormData, items: reindexedItems });
  };

  const handleSaveOptions = async () => {
    const postData = {
      name: newListFormData.listName,
      list: newListFormData.items.reduce((acc, item) => {
        acc[item.description] = item.description;
        return acc;
      }, {}),
    };

    // Salvar no localStorage
    localStorage.setItem('projectData', JSON.stringify(postData));

    try {
      const response = await api.post('dropboxanswers/', JSON.stringify(postData), {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        setToastMessage({
          variant: 'success',
          title: 'Lista criada!',
          description: 'A nova lista foi salva com sucesso.',
        });
        setHasChanged(!hasChanged); // Atualiza o estado para refletir que a lista foi alterada
        setIsSheetOpen(false); // Fecha a folha
      } else {
        setToastMessage({
          variant: 'destructive',
          title: 'Erro!',
          description: 'Não foi possível salvar a lista.',
        });
      }
    } catch (error) {
      console.error('Erro ao fazer a requisição:', error);
      setToastMessage({
        variant: 'destructive',
        title: 'Erro!',
        description: 'Ocorreu um erro ao salvar a lista.',
      });
    }
  };

  return (
    <ToastProvider>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button className="mb-2 mr-8">Nova Lista</Button>
        </SheetTrigger>
        <SheetContent className="bg-white text-black dark:text-white">
          <form onSubmit={(e) => { e.preventDefault(); handleSaveOptions(); }}>
            <SheetHeader>
              <SheetTitle>Criar nova lista</SheetTitle>
              <SheetDescription>
                Crie sua nova lista preenchendo com os dados referentes
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Input
                  type="text"
                  value={newListFormData.listName}
                  onChange={(e) => setNewListFormData({ ...newListFormData, listName: e.target.value })}
                  placeholder="Nome da lista"
                  className="col-span-4 bg-gray-200 text-black"
                  required
                />
              </div>
              {newListFormData.items.map((item) => (
                <div key={item.id} className="flex w-full max-w-sm items-center space-x-2">
                  <Input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleItemChange(item.id, e.target.value)}
                    placeholder={`Item ${item.number}`}
                    className="bg-gray-200 text-black"
                    required
                  />
                  <Button type="button" variant="destructive" onClick={() => handleRemoveItem(item.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <div className="container py-10 ml-9">
                <Button className="mb-2" type="button" onClick={handleAddItem}>
                  Adicionar Item
                </Button>
                <Button className="ml-4 mt-2" onClick={handleSaveOptions}>
            Salvar
            </Button>
              </div>
            </div>
            
          </form>
          {toastMessage && (
            <Toast className={toastMessage.variant === 'destructive' ? 'bg-red-600' : 'bg-green-600'}>
              <ToastTitle>{toastMessage.title}</ToastTitle>
              <ToastDescription>{toastMessage.description}</ToastDescription>
              <ToastClose />
            </Toast>
          )}
        </SheetContent>
      </Sheet>
      <ToastViewport />
    </ToastProvider>
  );
}
