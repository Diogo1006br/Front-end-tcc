import { render, screen } from "@testing-library/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

describe("Componente Tabs", () => {
  it("deve renderizar corretamente as abas", () => {
    render(
      <Tabs>
        <TabsList>
          <TabsTrigger value="tab1">Aba 1</TabsTrigger>
          <TabsTrigger value="tab2">Aba 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Conteúdo da Aba 1</TabsContent>
      </Tabs>
    );

    expect(screen.getByText("Aba 1")).toBeInTheDocument();
    expect(screen.queryByText("Conteúdo da Aba 1")).not.toBeInTheDocument();
  });
});
