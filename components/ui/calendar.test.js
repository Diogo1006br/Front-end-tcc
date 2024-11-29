import { render, screen } from "@testing-library/react";
import { Calendar } from "@/components/ui/calendar";

describe("Componente Calendar", () => {
  it("deve renderizar o calendário", () => {
    render(<Calendar />);
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("deve exibir o botão de navegação", () => {
    render(<Calendar />);
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });
});
