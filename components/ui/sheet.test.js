import { render, screen } from "@testing-library/react";
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";

describe("Componente Sheet", () => {
  it("deve renderizar corretamente o Sheet com título e descrição", () => {
    render(
      <Sheet>
        <SheetTrigger>Abrir</SheetTrigger>
        <SheetContent>
          <SheetTitle>Título do Sheet</SheetTitle>
          <SheetDescription>Descrição do Sheet</SheetDescription>
        </SheetContent>
      </Sheet>
    );

    expect(screen.getByText("Abrir")).toBeInTheDocument();
  });
});
