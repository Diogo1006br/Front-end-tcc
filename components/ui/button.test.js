import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Componente Button", () => {
  it("deve renderizar o botão padrão", () => {
    render(<Button>Botão</Button>);
    expect(screen.getByText("Botão")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveClass(
      "bg-primary text-primary-foreground hover:bg-primary/90"
    );
  });

  it("deve renderizar com a variante 'destructive'", () => {
    render(<Button variant="destructive">Excluir</Button>);
    expect(screen.getByText("Excluir")).toHaveClass(
      "bg-destructive text-destructive-foreground hover:bg-destructive/90"
    );
  });

  it("deve renderizar com tamanho 'lg'", () => {
    render(<Button size="lg">Grande</Button>);
    expect(screen.getByText("Grande")).toHaveClass("h-11 rounded-md px-8");
  });
});
