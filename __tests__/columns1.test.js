import { columns } from "../app/sistema/[...ativo]/columns";

describe("Columns Configuration", () => {
  it("should contain the correct columns", () => {
    expect(columns).toBeDefined();
    expect(columns.length).toBeGreaterThan(0);

    // Use as chaves reais definidas no seu array de colunas
    const columnNames = columns.map((col) => col.accessorKey);
    expect(columnNames).toContain("elementName"); // Ajuste para chaves reais
    expect(columnNames).toContain("form");
  });
});
