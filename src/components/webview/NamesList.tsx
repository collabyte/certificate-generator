import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import NameComponent from "@/components/ui/NameComponent";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const NamesList = () => {
  const [names, setNames] = useState<string[]>([]);

  return (
    <div>
      <Textarea
        placeholder="Paste the list of names"
        onChange={(event) => {
          const temporaryNameList = event.target.value;
          const temporaryName = temporaryNameList.split("\n");
          setNames(temporaryName.map((name) => name.trim()));
        }}
      />

      <ScrollArea className="w-screen h-24 m-border">
        <div className="w-screen space-y-2">
          {names.map(
            (name, index) => (
              console.log(name), (<NameComponent key={index} name={name} />)
            )
          )}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
};

export default NamesList;
