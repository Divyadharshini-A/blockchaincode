import { useState } from "react";
import { ethers } from "ethers";
// Import ABI Code to interact with smart contract
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json";
import "./App.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// The contract address
const greeterAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
  // Property Variables
  const diffToast = () =>{
    toast.success("Transaction Success!",{
      position:"top-center"
    });
  }
  const [message, setMessage] = useState("");
  const [currentGreeting, setCurrentGreeting] = useState("");

  // Helper Functions

  // Requests access to the user's Meta Mask Account
  // https://metamask.io/
  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  // Fetches the current value store in greeting
  async function fetchGreeting() {
    // If MetaMask exists
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        greeterAddress,
        Greeter.abi,
        provider
      );
      try {
        // Call Greeter.greet() and display current greeting in `console`
        /* 
          function greet() public view returns (string memory) {
            return greeting;
          }
        */
        const data = await contract.greet();
        console.log("data: ", data);
        setCurrentGreeting(data);
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  }

  

  // Sets the greeting from input text box
  async function setGreeting() {
    if (!message) return;

    // If MetaMask exists
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Create contract with signer
      /*
        function setGreeting(string memory _greeting) public {
          console.log("Changing greeting from '%s' to '%s'", greeting, _greeting);
          greeting = _greeting;
        } 
      */
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
      const transaction = await contract.setGreeting(message);

      setMessage("");
      await transaction.wait();
      fetchGreeting();
    }
  }

  // Return
  return (
    <div className="App">
      <div className="App-header">
        {/* DESCRIPTION  */}
        <div className="description">
          <h1>Pharmcy Stock Supply chain</h1>
          <p>Enter the required details to check the availability of medicines</p>
        </div>
        
        {/* BUTTONS - Fetch and Set */}
        <label>Product Id
        <input
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          placeholder="product id"
          style={{position:"relative",left:"35px",width:"240px"}}
        />
        </label>
        <br/>
        <label>Product name 
        <input type = "text" name = "product" placeholder="product name" />
        
        </label>
         <br/>
        <label>Manufacturer
        <input type = "text" name = "manu" placeholder = "Manufacturer"/>
        </label>
        <br/>
         <label>Product Type
         <select name="prod" id="pro" style={{position:"relative",left:"10px",width : "230px",height: "40px",borderRadius:"10px"}}>
        <option value ="select">Type</option>
        <option value="liquid">Liquid</option>
        <option value="php">Tablets</option>
        <option value="java">Suppositories</option>
        <option value="golang">Drops</option>
        <option value="java">Inhalers</option>
        <option value="golang">Injection</option>
        </select>

         </label>
         <br/>
         <label> Upload your file
            <input type ="file"></input>
         </label>
        <div className="custom-buttons">
        

          <br/>
          <button onClick={setGreeting} style={{ backgroundColor: "darkblue" ,borderRadius:"10px",width:"400px",fontFamily: 'Poppins'}}>
           Transaction
          </button>
          <br/>
         <button style={{ backgroundColor: "green" ,borderRadius:"10px",width:"400px" ,fontFamily: 'Poppins' }} onClick = {diffToast}>
           Submit
          </button>
          <ToastContainer/>

        </div>
        {/* INPUT TEXT - String  */}
       
        {/* Current Value stored on Blockchain */}
        <h2 className="greeting"> {currentGreeting}</h2>
      </div>
    </div>
  );
}

export default App;