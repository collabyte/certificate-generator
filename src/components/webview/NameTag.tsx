const NameTag = ({ name }: { name: string }) => {
  if (!name) return null;
  if (/^\s+$/.test(name)) return null;
  return (
    <div className="w-fit inline-block px-1 bg-gray-950 text-white rounded-sm m-2 mx-1">
      {name}
    </div>
  );
};

export default NameTag;
