import { render, screen } from "@testing-library/react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

describe("Componente Popover", () => {
  it("deve renderizar o conteúdo corretamente", () => {
    render(
      <Popover>
        <PopoverTrigger>Trigger</PopoverTrigger>
        <PopoverContent>Conteúdo do Popover</PopoverContent>
      </Popover>
    );

    expect(screen.getByText("Trigger")).toBeInTheDocument();
  });
});
