import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/ui/badge";

describe("Componente Badge", () => {
  it("deve renderizar o Badge com o texto padrão", () => {
    render(<Badge>Texto Padrão</Badge>);

    const badge = screen.getByText("Texto Padrão");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass(
      "border-transparent bg-primary text-primary-foreground hover:bg-primary/80"
    );
  });

  it("deve renderizar o Badge com a variante 'secondary'", () => {
    render(<Badge variant="secondary">Texto Secundário</Badge>);

    const badge = screen.getByText("Texto Secundário");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass(
      "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
    );
  });

  it("deve renderizar o Badge com a variante 'destructive'", () => {
    render(<Badge variant="destructive">Texto Destrutivo</Badge>);

    const badge = screen.getByText("Texto Destrutivo");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass(
      "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80"
    );
  });

  it("deve renderizar o Badge com a variante 'outline'", () => {
    render(<Badge variant="outline">Texto Outline</Badge>);

    const badge = screen.getByText("Texto Outline");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("text-foreground");
  });

  it("deve adicionar classes personalizadas", () => {
    render(
      <Badge className="custom-class">Badge com Classe Personalizada</Badge>
    );

    const badge = screen.getByText("Badge com Classe Personalizada");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("custom-class");
  });
});
