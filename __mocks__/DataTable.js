jest.mock("@/components/ui/DataTable", () => ({
    DataTable: ({ columns, data }) => (
      <div data-testid="data-table">
        Mocked DataTable
        <div>{JSON.stringify(columns)}</div>
        <div>{JSON.stringify(data)}</div>
      </div>
    ),
  }));
  