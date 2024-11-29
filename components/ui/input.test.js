import { render, screen, fireEvent } from "@testing-library/react";
import { Input } from "@/components/ui/input";

describe("Componente Input", () => {
  it("deve atualizar o valor do input ao digitar", () => {
    render(<Input placeholder="Digite aqui" />);
    const input = screen.getByPlaceholderText("Digite aqui");

    fireEvent.change(input, { target: { value: "Teste" } });
    expect(input).toHaveValue("Teste");
  });
});
