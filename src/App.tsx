import { Button } from "@/components/ui/button";

import NamesList from "@/components/webview/NamesList";

function App() {
  function handleClick() {
    console.log("Button clicked");
  }
  return (
    <>
      {/* accpet pdf */}
      <label htmlFor="file">Upload PDF</label>
      <input type="file" accept="application/pdf" />
      <NamesList />
      <Button onClick={handleClick}>Generate PDF</Button>
    </>
  );
}

export default App;
