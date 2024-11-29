import { render, screen } from "@testing-library/react";
import { Label } from "@/components/ui/label";

describe("Componente Label", () => {
  it("deve renderizar com o texto correto", () => {
    render(<Label>Texto do Label</Label>);
    expect(screen.getByText("Texto do Label")).toBeInTheDocument();
  });
});
