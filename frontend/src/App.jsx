import React, { useEffect, useState } from "react";
import "./App.css";
import socialAbi from "../../backend/build/contracts/SocialMediaPlatform.json";
import tokenAbi from "../../backend/build/contracts/TrophyToken.json";
import { TronWeb } from "tronweb"; // Import TronWeb
import axios from "axios"

function App() {
  const [account, setAccount] = useState(null);
  const [state, setState] = useState({
    socialContract: null,
    tokenContract: null,
  });
  const [isTronLinkInstalled, setIsTronLinkInstalled] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state

  // Form States
  const [profile, setProfile] = useState({ name: "", bio: "", image: null });
  const [post, setPost] = useState({ image: null, caption: "" });
  const [tweet, setTweet] = useState({ text: "" });
  const [song, setSong] = useState({ name: "", royalty: "", audio: null });
  const [content, setContent] = useState(null)
  const [profiles,setProfiles] = useState([])
  const [posts,setPosts] = useState([])
  const [tweets,setTweets] = useState([])
  const [songs,setSongs] = useState([])

  useEffect(() => {
    const checkTronLink = async () => {
      const socialAddress = "TEU5PfQKUFQPxhvn6TdAxJrWrVovvKV5DU";
      const tokenAddress = "TEkgc3mShwtG3YZKNHeCDB3PnWApKiwMAq";
      const socialABI = socialAbi.abi;
      const tokenABI = tokenAbi.abi;

      if (window.tronWeb && window.tronWeb.ready) {
        setIsTronLinkInstalled(true);
        setAccount(window.tronWeb.defaultAddress.base58);

        const socialContract = tronWeb.contract(socialABI, socialAddress);
        const tokenContract = tronWeb.contract(tokenABI, tokenAddress);

        setState((prevState) => ({
          ...prevState,
          socialContract: socialContract,
          tokenContract: tokenContract,
        }));
        setTimeout(checkTronLink, 1000);
      }

      setLoading(false);
    };
    viewProfiles();

    checkTronLink();

    
  });


  
  const uploadToIpfs = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
  
    if (!file) {
      window.alert("No file selected for upload.");
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append("file", file);
  
      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        headers: {
          pinata_api_key: `35cb1bf7be19d2a8fa0d`,
          pinata_secret_api_key: `2c2e9e43bca7a619154cb48e8b060c5643ea6220d0b7c9deb565fa491b3b3a50`,
          "Content-Type": "multipart/form-data",
        },
      });
  
      const ipfsUrl = `https://ipfs.io/ipfs/${res.data.IpfsHash}`;
      console.log("File uploaded to IPFS:", ipfsUrl);
      setContent(ipfsUrl); 
    } catch (error) {
      console.error("Error uploading file to IPFS:", error);
      window.alert("There was an error uploading the file. Please try again.");
    }
  };
  
  
  const mintProfile = async (e) => {
    e.preventDefault();
    
    if (!content || !profile.name) {
      window.alert("Profile name or content is missing.");
      return;
    }
  
    try {
      
      const profileData = JSON.stringify({
        image: content, 
        name: profile.name,
        bio: profile.bio || "", 
      });
  
      const res = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", profileData, {
        headers: {
          pinata_api_key: `35cb1bf7be19d2a8fa0d`,
          pinata_secret_api_key: `2c2e9e43bca7a619154cb48e8b060c5643ea6220d0b7c9deb565fa491b3b3a50`,
          "Content-Type": "application/json",
        },
      });
  
      const ipfsMetadataUrl = `https://ipfs.io/ipfs/${res.data.IpfsHash}`;
      console.log("Metadata uploaded to IPFS:", ipfsMetadataUrl);
  
      setLoading(true);
  
      const tx = await state.socialContract.mintProfile(ipfsMetadataUrl).send({
        from: account,
      });
  
      if (tx) {
        console.log("Transaction successful:", tx);
        window.alert("Profile minted successfully!");
        
      } else {
        window.alert("Transaction failed.");
      }
    } catch (error) {
      console.log( error);
      window.alert("There was an error minting the profile. Please try again.");
    } finally {
      setLoading(false); // Stop the loading state regardless of success/failure
    }
  };
  
  
  const selectProfile = async()=>{

  }
  const createPost = async(e)=>{
    e.preventDefault();
    if (!content || !post.caption) {
      window.alert("Caption is missing.");
      return;
    }
  
    try {
      
      const postData = JSON.stringify({
        image: content, 
        name: post.caption,
       
      });
  
      const res = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", postData, {
        headers: {
          pinata_api_key: `35cb1bf7be19d2a8fa0d`,
          pinata_secret_api_key: `2c2e9e43bca7a619154cb48e8b060c5643ea6220d0b7c9deb565fa491b3b3a50`,
          "Content-Type": "application/json",
        },
      });
  
      const ipfsMetadataUrl = `https://ipfs.io/ipfs/${res.data.IpfsHash}`;
      console.log("Metadata uploaded to IPFS:", ipfsMetadataUrl);
  
      setLoading(true);
  
      const tx = await state.socialContract.createPost(ipfsMetadataUrl).send({
        from: account,
      });
  
      if (tx) {
        console.log("Transaction successful:", tx);
        window.alert("Posted successfully!");
        
      } else {
        window.alert("Transaction failed.");
      }
    } catch (error) {
      console.log( error);
      window.alert("There was an error in creating the post. Please try again.");
    } finally {
      setLoading(false); 
    }

  }
  const createTweet = async(e)=>{
    e.preventDefault();
    if (!content) {
      window.alert("Tweet content is missing.");
      return;
    }
  
    try {
      
      const tweetData = JSON.stringify({
        text: content, 
        
      });
  
      const res = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", tweetData, {
        headers: {
          pinata_api_key: `35cb1bf7be19d2a8fa0d`,
          pinata_secret_api_key: `2c2e9e43bca7a619154cb48e8b060c5643ea6220d0b7c9deb565fa491b3b3a50`,
          "Content-Type": "application/json",
        },
      });
  
      const ipfsMetadataUrl = `https://ipfs.io/ipfs/${res.data.IpfsHash}`;
      console.log("Metadata uploaded to IPFS:", ipfsMetadataUrl);
  
      setLoading(true);
  
      const tx = await state.socialContract.mintProfile(ipfsMetadataUrl).send({
        from: account,
      });
  
      if (tx) {
        console.log("Transaction successful:", tx);
        window.alert("Profile minted successfully!");
        
      } else {
        window.alert("Transaction failed.");
      }
    } catch (error) {
      console.log( error);
      window.alert("There was an error minting the profile. Please try again.");
    } finally {
      setLoading(false); // Stop the loading state regardless of success/failure
    }

  }
  const uploadSong = async(e)=>{
    
    e.preventDefault();
    
    if (!content || !song.name) {
      window.alert("Profile name or content is missing.");
      return;
    }
  
    try {
      
      const songData = JSON.stringify({
        image: content, 
        name: song.name,
        royalty: song.royalty || "", 
      });
  
      const res = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", songData, {
        headers: {
          pinata_api_key: `35cb1bf7be19d2a8fa0d`,
          pinata_secret_api_key: `2c2e9e43bca7a619154cb48e8b060c5643ea6220d0b7c9deb565fa491b3b3a50`,
          "Content-Type": "application/json",
        },
      });
  
      const ipfsMetadataUrl = `https://ipfs.io/ipfs/${res.data.IpfsHash}`;
      console.log("Metadata uploaded to IPFS:", ipfsMetadataUrl);
  
      setLoading(true);
  
      const tx = await state.socialContract.uploadSong(ipfsMetadataUrl).send({
        from: account,
      });
  
      if (tx) {
        console.log("Transaction successful:", tx);
        window.alert("Song uploaded successfully!");
        
      } else {
        window.alert("Transaction failed.");
      }
    } catch (error) {
      console.log( error);
      window.alert("There was an error uploading. Please try again.");
    } finally {
      setLoading(false); // Stop the loading state regardless of success/failure
    }
    

  }
  const earnTrophies = async()=>{

  }
  const viewProfiles = async () => {
    try {
      const profileIds = await state.socialContract.profiles(account).call(); // Get array of profile IDs
      if (profileIds.length > 0) {
        const profilesArray = [];
  
        for (let i = 0; i < profileIds.length; i++) {
          const profileId = profileIds[i].toString(); // Convert the profile ID to string
          const profileURI = await state.socialContract.tokenURI(profileId).call(); // Get profile URI
  
          profilesArray.push({ id: profileId, uri: profileURI });
        }
  
        
        setProfiles(profilesArray);
        console.log("Profiles array:", profilesArray);
      } else {
        console.log(`No profiles found for address: ${account}`);
      }
    } catch (error) {
      console.error("Error fetching profiles:", error);
    }
  };
  
  const viewPosts = async()=>{

  }
  const viewCurrentProfile = async()=>{

  }
  const viewTweets = async()=>{

  }
  const viewSongs = async()=>{

  }
  const tipPosts = async()=>{

  }
  const tipTweet = async()=>{

  }
  const commentOnPost = async()=>{

  }
  const commentOnTweet = async()=>{

  }
  const viewPostComments = async()=>{

  }
  const viewTweetComments = async()=>{

  }



  // Handlers for form inputs
  const handleProfileChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setProfile({ ...profile, [name]: files[0] });
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handlePostChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setPost({ ...post, [name]: files[0] });
    } else {
      setPost({ ...post, [name]: value });
    }
  };

  const handleTweetChange = (e) => {
    setTweet({ ...tweet, text: e.target.value });
  };

  const handleSongChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setSong({ ...song, [name]: files[0] });
    } else {
      setSong({ ...song, [name]: value });
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

          <div className="forms-section">
            {/* Profile Form */}
            <div className="card">
              <h4>Create Profile</h4>
              <form>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={profile.name}
                  onChange={handleProfileChange}
                />
                <textarea
                  name="bio"
                  placeholder="Bio"
                  value={profile.bio}
                  onChange={handleProfileChange}
                />
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={uploadToIpfs}
                />
                <button type="button" onClick={mintProfile}>
                  Mint Profile
                </button>
              </form>
            </div>

            {/* Post Form */}
            <div className="card">
              <h4>Create Post</h4>
              <form >
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={uploadToIpfs}
                />
                <textarea
                  name="caption"
                  placeholder="Caption"
                  value={post.caption}
                  onChange={handlePostChange}
                />
                <button type="button" onClick={createPost}>
                  Create Post
                </button>
              </form>
            </div>

            {/* Tweet Form */}
            <div className="card">
              <h4>Create Tweet</h4>
              <form >
                <textarea
                  name="tweet"
                  placeholder="What's on your mind?"
                  value={tweet.text}
                  onChange={handleTweetChange && uploadToIpfs}
                  
                />
                <button type="button" onClick={createTweet}>
                  Create Tweet
                </button>
              </form>
            </div>

            {/* Song Upload Form */}
            <div className="card">
              <h4>Upload Song</h4>
              <form >
                <input
                  type="text"
                  name="name"
                  placeholder="Song Name"
                  value={song.name}
                  onChange={handleSongChange}
                />
                <input
                  type="text"
                  name="royalty"
                  placeholder="Royalty (%)"
                  value={song.royalty}
                  onChange={handleSongChange}
                />
                <input
                  type="file"
                  name="audio"
                  accept="audio/*"
                  onChange={uploadToIpfs}
                />
                <button type="button" onClick={uploadSong}>
                  Upload Song
                </button>
              </form>
            </div>
          </div>
          <div className="profiles-section">
          <h4>Your Profiles:</h4>
          {profiles.length > 0 ? (
            profiles.map((profile, index) => (
              <div key={index} className="profile-card">
                <p>Profile ID: {profile.id}</p>
                <img src={profile.uri} alt="Profile" className="profile-image" />
                {/* You can add more info about the profile here */}
              </div>
            ))
          ) : (
            <p>No profiles found.</p>
          )}
        </div>
        </div>

        


      ) : (
        <p>Please install TronLink to continue.</p>
      )}
    </div>
  );
}

export default App;
