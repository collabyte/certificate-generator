const NameComponent = ({ name }: { name: string }) => {
  if (!name) return null;
  if (/^\s+$/.test(name)) return null;
  return <div className="w-fit inline-block p-1 bg-gray-400 m-1">{name}</div>;
};

export default NameComponent;
