import React, { useEffect, useState } from "react";
import "./App.css";
import socialAbi from "../../backend/build/contracts/SocialMediaPlatform.json";
import tokenAbi from "../../backend/build/contracts/TrophyToken.json";
import { TronWeb } from "tronweb"; // Import TronWeb
import axios from "axios";

function App() {
  const [account, setAccount] = useState(null);
  const [state, setState] = useState({
    socialContract: null,
    tokenContract: null,
  });
  const [isTronLinkInstalled, setIsTronLinkInstalled] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [PImage, setPImage] = useState(null);
  const [pfs, setPfs] = useState("");
  const [postContent, setPostContent] = useState(""); // For the post content (e.g., image URL, IPFS hash, etc.)
  const [caption, setCaption] = useState(""); // For the caption
  const [posts, setPosts] = useState([]);
  const [tweet, setTweet] = useState("");
  const [tweets, setTweets] = useState([]);
  const [tokens, setTokens] = useState(0);

  useEffect(() => {
    const checkTronLink = async () => {
      const socialAddress = "THxr1x85JhjAg2mzbLAbvigCy5WB2ZEx2B";
      const tokenAddress = "TM1kXYBjH56kyNmBhRbn2Sb9rdqQ9taEvm";
      const socialABI = socialAbi.abi;
      const tokenABI = tokenAbi.abi;

      if (window.tronWeb && window.tronWeb.ready) {
        setIsTronLinkInstalled(true);
        setAccount(window.tronWeb.defaultAddress.base58);

        const socialContract = tronWeb.contract(socialABI, socialAddress);
        // console.log(socialContract)
        const tokenContract = tronWeb.contract(tokenABI, tokenAddress);

        setState((prevState) => ({
          ...prevState,
          socialContract: socialContract,
          tokenContract: tokenContract,
        }));
        setTimeout(checkTronLink, 1000);

        // await fetchTokenBalance(account)
      }

      setLoading(false);
    };

    // fetchAllPosts()
    // fetchAllTweets()

    checkTronLink();
  }, []);

  useEffect(() => {
    if (state.socialContract) {
      loadMyProfiles();
    }
  }, [state]);

  const handleProfileChange = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (typeof file !== "undefined") {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: `35cb1bf7be19d2a8fa0d`,
            pinata_secret_api_key: `2c2e9e43bca7a619154cb48e8b060c5643ea6220d0b7c9deb565fa491b3b3a50`,
            "Content-Type": "multipart/form-data",
          },
        });
        console.log(res);
        const resData = await res.data;
        setPImage(`https://ipfs.io/ipfs/${resData.IpfsHash}`);
      } catch (error) {
        window.alert(error);
      }
    }
  };
  const submitProfile = async (e) => {
    e.preventDefault();
    if (!PImage || !username) return;
    try {
      const data = JSON.stringify({ PImage, username, bio });
      console.log(data);
      const res = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        data: data,
        headers: {
          pinata_api_key: `35cb1bf7be19d2a8fa0d`,
          pinata_secret_api_key: `2c2e9e43bca7a619154cb48e8b060c5643ea6220d0b7c9deb565fa491b3b3a50`,
          "Content-Type": "application/json",
        },
      });
      const resData = await res.data;
      console.log(resData);
      const ipfsMetadataUrl = `https://ipfs.io/ipfs/${resData.IpfsHash}`;
      const tx = await state.socialContract.mintProfile(ipfsMetadataUrl).send({
        from: account,
      });

      if (tx) {
        console.log("Transaction successful:", tx);
        window.alert("Posted successfully!");
      } else {
        window.alert("Transaction failed.");
      }
      setLoading(true);
    } catch (error) {
      window.alert("minting error : ", error);
    }
  };
  const loadMyProfiles = async () => {
    try {
      console.log({
        contract: state.socialContract,
      });
      // Call the smart contract's viewAllProfiles function
      const profiles = await state.socialContract.viewAllProfiles().call()
      console.log({ contractProfiles: profiles });
      // viewAllProfiles().call({
      //   from: account, // Your connected account
      // });
      const pfs = await Promise.all(
        profiles.map(async (i) => {
          const uri = await contract.tokenURI(i);
          console.log(uri);
          const response = await fetch(uri);
          console.log(response);
          const metadata = await response.json();
          console.log(metadata);
          return {
            id: i,
            username: metadata.username,
            PImage: metadata.PImage,
            bio: metadata.bio,
          };
        })
      );
      setPfs(pfs);
      console.log(pfs);
    } catch (error) {
      console.error("Error fetching profiles:", error);
    }
  };
  const handlePImageChange = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (typeof file !== "undefined") {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: `35cb1bf7be19d2a8fa0d`,
            pinata_secret_api_key: `2c2e9e43bca7a619154cb48e8b060c5643ea6220d0b7c9deb565fa491b3b3a50`,
            "Content-Type": "multipart/form-data",
          },
        });
        console.log(res);
        const resData = await res.data;
        setPostContent(`https://ipfs.io/ipfs/${resData.IpfsHash}`);
      } catch (error) {
        window.alert(error);
      }
    }
  };
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!postContent || !caption) return;
    try {
      const data = JSON.stringify({ postContent, caption });
      console.log(data);
      const res = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        data: data,
        headers: {
          pinata_api_key: `35cb1bf7be19d2a8fa0d`,
          pinata_secret_api_key: `2c2e9e43bca7a619154cb48e8b060c5643ea6220d0b7c9deb565fa491b3b3a50`,
          "Content-Type": "application/json",
        },
      });
      const resData = await res.data;
      console.log(resData);
      const ipfsMetadataUrl = `https://ipfs.io/ipfs/${resData.IpfsHash}`;
      console.log(state.socialContract);
      const tx = await state.socialContract.createPost(ipfsMetadataUrl).send({
        from: account,
      });

      if (tx) {
        console.log("Transaction successful:", tx);
        window.alert("Posted successfully!");
      } else {
        window.alert("Transaction failed.");
      }
      setLoading(true);
    } catch (error) {
      window.alert("minting error : ", error);
    }
  };

  // const fetchAllPosts = async () => {
  //   setLoading(true); // Set loading state to true while fetching
  //   try {
  //     // Ensure the contract is initialized and available
  //     if (!state.socialContract) {
  //       console.error("Contract not initialized.");
  //       return;
  //     }

  //     // Call the viewAllPosts function from the contract
  //     const postsArray = await state.socialContract.methods.viewAllPosts().call({
  //       from: account,
  //     });

  //     // Log the retrieved posts
  //     console.log("Fetched posts:", postsArray);

  //     // Set the retrieved posts to state
  //     setPosts(postsArray); // Assuming setPosts is a state setter for posts array

  //     setLoading(false); // Set loading state to false after fetching
  //   } catch (error) {
  //     console.error("Error fetching posts:", error);
  //     setLoading(false); // Ensure loading is turned off in case of an error
  //   }
  // };
  const handleTweetSubmit = async (e) => {
    e.preventDefault();
    const tx = await state.socialContract.uploadTweet(tweet).send({
      from: account,
    });
    if (tx) {
      console.log("Transaction successful:", tx);
      window.alert("Tweetes successfully!");
    } else {
      window.alert("Transaction failed.");
    }
    setLoading(true);
  };

  const fetchAllTweets = async () => {
    setLoading(true); // Set loading state to true while fetching
    try {
      // Call the viewAllTweets function from the contract
      const tweetsArray = await state.socialContract.viewAllTweets().call();

      // Log the retrieved tweets
      console.log("Fetched tweets:", tweetsArray);

      // Set the retrieved tweets to state
      setTweets(tweetsArray); // Assuming setTweets is a state setter for tweets array
      console.log(tweets);

      setLoading(false); // Set loading state to false after fetching
    } catch (error) {
      console.error(error);
      setLoading(false); // Ensure loading is turned off in case of an error
    }
  };

  const mintTokens = async () => {
    try {
      const tx = await state.socialContract
        .mintTokensForEventCompletion(account, 100)
        .send();

      alert("Tokens minted successfully!");
      await fetchTokenBalance(account);
    } catch (error) {
      console.log(error);
      alert("Failed to mint tokens.");
    }
  };

  const fetchTokenBalance = async (account) => {
    try {
      console.log(state.tokenContract);
      const balance = await state.tokenContract.balanceOf(account).call(); // Replace with your method to get balance
      setTokens(balance.toString()); // Adjust if your balance is in another format
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App">
      {loading ? (
        <p>Loading...</p>
      ) : isTronLinkInstalled ? (
        <div>
          <h3>Connected Account:</h3>
          <p>{account}</p>
          <div>
            <h1>Mint Tokens</h1>
            <button onClick={mintTokens}>Mint Tokens</button>
            <p>Account: {account}</p>
            <p>Token Balance: {tokens}</p>
          </div>
          <h2 className="text-2xl font-bold mb-4">Create Your Profile</h2>
          <form onSubmit={submitProfile} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username:
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-700"
              >
                Bio:
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="profileImage"
                className="block text-sm font-medium text-gray-700"
              >
                Profile Image:
              </label>
              <input
                type="file"
                id="profileImage"
                onChange={handleProfileChange}
                accept="image/*"
                className="mt-1 block w-full text-sm text-gray-500 border border-gray-300 rounded-md focus:ring focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition"
            >
              Create Profile
            </button>
          </form>
          <div className="flex justify-center items-center h-screen">
            <form
              className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md"
              onSubmit={handlePostSubmit}
            >
              <h1 className="text-2xl font-bold mb-6 text-center">
                Upload a Post
              </h1>

              {/* Post Image */}
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="postImage"
                >
                  Post Image
                </label>
                <input
                  id="postImage"
                  type="file"
                  accept="image/*"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                  onChange={handlePImageChange}
                  required
                />
              </div>

              {/* Caption */}
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="caption"
                >
                  Caption
                </label>
                <textarea
                  id="caption"
                  placeholder="Enter your caption here"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  required
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-600 transition duration-200"
                  disabled={loading}
                >
                  {loading ? "Uploading..." : "Upload Post"}
                </button>
              </div>
            </form>
          </div>
          <div className="flex justify-center items-center h-screen">
            <form
              className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md"
              onSubmit={handleTweetSubmit}
            >
              <h1 className="text-2xl font-bold mb-6 text-center">
                Upload a Tweet
              </h1>

              {/* Caption */}
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="caption"
                >
                  Tweet
                </label>
                <textarea
                  id="caption"
                  placeholder="Enter your caption here"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                  value={tweet}
                  onChange={(e) => setTweet(e.target.value)}
                  required
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-600 transition duration-200"
                  disabled={loading}
                >
                  {loading ? "Uploading..." : "Upload Tweet"}
                </button>
              </div>
            </form>
          </div>
          {loading ? (
            <p>Loading tweets...</p>
          ) : (
            tweets.map((tweet, index) => (
              <div key={index} className="tweet">
                {/* <p>{tweet.contentURI}</p> {/* Adjust based on how you structure the tweet */}
                {/* <p>Posted by: {tweet.owner}</p>
                        Add any additional functionalities here, like a like button */}
              </div>
            ))
          )}
        </div>
      ) : (
        <p>Please install TronLink to continue.</p>
      )}
    </div>
  );
}

export default App;
