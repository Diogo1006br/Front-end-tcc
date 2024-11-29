import { render, screen } from "@testing-library/react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

describe("Componente Dialog", () => {
  it("deve renderizar corretamente o Dialog com título e descrição", () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Título do Dialog</DialogTitle>
          <DialogDescription>Descrição do Dialog</DialogDescription>
        </DialogContent>
      </Dialog>
    );
    expect(screen.getByText("Open Dialog")).toBeInTheDocument();
    expect(screen.queryByText("Título do Dialog")).not.toBeInTheDocument();
  });
});
