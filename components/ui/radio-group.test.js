import { render, screen, fireEvent } from "@testing-library/react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

describe("Componente RadioGroup", () => {
  it("deve permitir a seleção de um item", () => {
    render(
      <RadioGroup>
        <RadioGroupItem value="item1" aria-label="Item 1" />
        <RadioGroupItem value="item2" aria-label="Item 2" />
      </RadioGroup>
    );

    const radio = screen.getByRole("radio", { name: "Item 1" });
    fireEvent.click(radio);
    expect(radio).toBeChecked();
  });
});
