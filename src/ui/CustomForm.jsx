function CustomForm({ onSubmit, children }) {
  return <form className="flex w-full flex-col gap-4" onSubmit={onSubmit}>{children}</form>;
}

export default CustomForm;
