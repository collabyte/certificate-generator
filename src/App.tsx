import { Button } from "@/components/ui/button";
function App() {
  function handleClick() {
    console.log("Button clicked");
  }
  return (
    <>
      <Button onClick={handleClick}>Click me</Button>
    </>
  );
}

export default App;
