import { render, screen } from "@testing-library/react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

describe("Componente DropdownMenu", () => {
  it("deve renderizar corretamente o menu dropdown", () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Opção 1</DropdownMenuItem>
          <DropdownMenuItem>Opção 2</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    expect(screen.getByText("Menu")).toBeInTheDocument();
    expect(screen.queryByText("Opção 1")).not.toBeInTheDocument();
  });
});
