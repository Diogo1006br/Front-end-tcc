import { render, screen } from "@testing-library/react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

describe("Componente Tooltip", () => {
  it("deve renderizar corretamente o Tooltip", () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover aqui</TooltipTrigger>
          <TooltipContent>Conteúdo do Tooltip</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    expect(screen.getByText("Hover aqui")).toBeInTheDocument();
    expect(screen.queryByText("Conteúdo do Tooltip")).not.toBeInTheDocument();
  });
});
