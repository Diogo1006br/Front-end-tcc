import { render, screen } from "@testing-library/react";
import { ToastProvider, Toast, ToastViewport, ToastTitle, ToastDescription } from "@/components/ui/toast";

describe("Componente Toast", () => {
  it("deve renderizar um toast com título e descrição", () => {
    render(
      <ToastProvider>
        <Toast>
          <ToastTitle>Título</ToastTitle>
          <ToastDescription>Descrição</ToastDescription>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );

    expect(screen.getByText("Título")).toBeInTheDocument();
    expect(screen.getByText("Descrição")).toBeInTheDocument();
  });
});
