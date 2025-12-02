import  { createContext, useContext } from "react";

const TableContext = createContext(null);

function Table({ children, columns }) {
  return (
    <TableContext.Provider value={{ columns }}>
      <div className="rounded-lg text-sm overflow-hidden">{children}</div>
    </TableContext.Provider>
  );
}

function Header({ children }) {
  const { columns } = useContext(TableContext);
  return (
    <div
      role="row"
      style={{ display: "grid", gridTemplateColumns: columns }}
      className="gap-6 items-center text-black/60 font-medium p-3 border-b text-left capitalize"
    >
      {children}
    </div>
  );
}

function Row({ children }) {
  const { columns } = useContext(TableContext);
  return (
    <div
      role="row"
      style={{ display: "grid", gridTemplateColumns: columns }}
      className="gap-6 truncate items-center p-3 text-center  text-xs py-4 ring-1 ring-gray-300 "
    >
      {children}
    </div>
  );
}

function Body({ data, render }) {
  if (!data?.length)
    return (
      <p className="text-center font-medium text-xs  my-6">
        No Data Found
      </p>
    );
  return (
    <section className="my-1">
      {data.map((item, index) => render(item, index))}
    </section>
  );
}

function Footer({ children }) {
  return (
    <footer
      className={`bg-gray-100 flex justify-center p-3 ${
        !children ? "hidden" : ""
      }`}
    >
      {children}
    </footer>
  );
}

Table.Header = Header;
Table.Row = Row;
Table.Body = Body;
Table.Footer = Footer;

export default Table;
