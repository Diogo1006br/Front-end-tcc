import { render, screen } from "@testing-library/react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

describe("Componente Alert", () => {
  it("deve renderizar o componente Alert padrão", () => {
    render(<Alert>Alerta Padrão</Alert>);

    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent("Alerta Padrão");
  });

  it("deve renderizar o alerta com a variante destrutiva", () => {
    render(<Alert variant="destructive">Alerta Destrutivo</Alert>);

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Alerta Destrutivo");
    expect(alert).toHaveClass("border-destructive/50");
  });

  it("deve renderizar o alerta com a variante de aviso", () => {
    render(<Alert variant="warning">Alerta de Aviso</Alert>);

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Alerta de Aviso");
    expect(alert).toHaveClass("text-yellow-800");
  });
});

describe("Componente AlertTitle", () => {
  it("deve renderizar o componente AlertTitle", () => {
    render(<AlertTitle>Título do Alerta</AlertTitle>);

    const title = screen.getByText("Título do Alerta");
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass("mb-1 font-medium leading-none tracking-tight");
  });
});

describe("Componente AlertDescription", () => {
  it("deve renderizar o componente AlertDescription", () => {
    render(<AlertDescription>Descrição do Alerta</AlertDescription>);

    const description = screen.getByText("Descrição do Alerta");
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass("text-sm [&_p]:leading-relaxed");
  });
});
