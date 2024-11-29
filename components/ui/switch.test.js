import { render, screen, fireEvent } from "@testing-library/react";
import { Switch } from "@/components/ui/switch";

describe("Componente Switch", () => {
  it("deve alternar o estado ao clicar", () => {
    render(<Switch />);
    const switchElement = screen.getByRole("switch");

    fireEvent.click(switchElement);
    expect(switchElement).toHaveAttribute("data-state", "checked");
  });
});
