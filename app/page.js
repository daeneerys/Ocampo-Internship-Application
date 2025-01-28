/*Create a NextJS application that renders a button with text "Connect with MetaMask"

This button should open the MetaMask browser extension and let the user connect to the app using his MetaMask wallet.

Once connected, the application should also query the user's balance and display it.

Bonus (Optional): Perform the balance inquiry using a backend API. You may use Next JS API or any backend programming language.

Submit via GitHub public repository

*/

"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Image from "next/image";

export default function Home() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("Ethers:", ethers);
      if (typeof window.ethereum !== "undefined") {
        const ethProvider = new ethers.BrowserProvider(window.ethereum);
        setProvider(ethProvider);
      } else {
        alert("Please install MetaMask!");
      }
    }
  }, []);

  const connectMetaMask = async () => {
    if (!provider) return;

    try {
      // Request accounts from MetaMask
      const accounts = await provider.send("eth_requestAccounts", []);
      const account = accounts[0];
      setAccount(account);

      // Query the balance of the connected account
      const balance = await provider.getBalance(account);
      setBalance(ethers.formatEther(balance));
    } catch (err) {
      console.error("Error connecting to MetaMask:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-6 max-w-md w-full text-center">
        <Image
          src="/images/metamask_img.png"
          alt="Metamask"
          width={200}
          height={200}
          className="rounded-lg shadow-lg mx-auto block" // Center the image
          priority // Loads this image with high priority for LCP
        />
        <h1 className="text-2xl mt-8 font-bold text-gray-800 mb-4">
          MetaMask Integration
        </h1>
        <button
          onClick={connectMetaMask}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          {account
            ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}`
            : "Connect with MetaMask"}
        </button>
        {balance && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <p className="text-gray-600 font-medium">Balance:</p>
            <p className="text-lg font-bold text-gray-800">{balance} ETH</p>
          </div>
        )}
      </div>
    </div>
  );
}
