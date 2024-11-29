import { render, screen } from "@testing-library/react";
import Form from "../app/sistema/formularios/FormEdit/[formulario]/page";

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
});
