import NameTag from "@/components/webview/NameTag";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const NamesList = ({ names }: { names: string[] }) => {
  return (
    <>
      <ScrollArea className="w-full p-1 h-24 m-border ">
        <div className="w-full space-y-2">
          {names.map(
            (name: string, index: number) => (
              console.log(name), (<NameTag key={index} name={name} />)
            )
          )}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </>
  );
};

export default NamesList;
