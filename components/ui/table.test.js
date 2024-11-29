import { render, screen } from "@testing-library/react";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";

describe("Componente Table", () => {
  it("deve renderizar corretamente a tabela", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cabeçalho</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Dados</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(screen.getByText("Cabeçalho")).toBeInTheDocument();
    expect(screen.getByText("Dados")).toBeInTheDocument();
  });
});
