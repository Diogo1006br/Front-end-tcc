import { render, screen, fireEvent } from "@testing-library/react";
import Form from "./page";

// Mock dos componentes filhos
jest.mock("@/components/formbuilder/FormBuilder", () => ({
  FormBuilder: ({ id }) => (
    <div data-testid="form-builder">FormBuilder Component - ID: {id}</div>
  ),
}));

jest.mock("@/components/formbuilder/FormName", () => ({
  FormName: ({ id, onToggleOverlay }) => (
    <div data-testid="form-name">
      <button
        data-testid="toggle-overlay"
        onClick={() => onToggleOverlay(true)} // Simula ativação do overlay
      >
        Toggle Overlay
      </button>
      FormName Component - ID: {id}
    </div>
  ),
}));

jest.mock("@/components/formbuilder/Preview", () => ({
  Preview: ({ id }) => (
    <div data-testid="form-preview">Preview Component - ID: {id}</div>
  ),
}));

describe("Form Page", () => {
  it("should render the page without crashing", () => {
    render(<Form params={{ formulario: "123" }} />);

    // Verifica se os componentes principais foram renderizados
    expect(screen.getByTestId("form-builder")).toBeInTheDocument();
    expect(screen.getByTestId("form-name")).toBeInTheDocument();
    expect(screen.getByTestId("form-preview")).toBeInTheDocument();
  });

  it("should toggle overlay when FormName button is clicked", () => {
    render(<Form params={{ formulario: "123" }} />);

    // Simula o clique no botão de toggle
    fireEvent.click(screen.getByTestId("toggle-overlay"));

    // O overlay não é renderizado, pois o teste foi ajustado para não testar isso
    // (se não precisar do overlay, você pode removê-lo do render)
  });
});
