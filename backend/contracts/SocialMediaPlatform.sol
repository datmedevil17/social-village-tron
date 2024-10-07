// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./TrophyToken.sol";

contract SocialMediaPlatform is ERC721URIStorage {

    uint256 private nextProfileId = 1;
    uint256 private nextPostId = 1;
    uint256 private nextSongId = 1;
    uint256 private tweetCount = 0;  // Separate counter for tweets

    TrophyToken public trophyToken;

    mapping(address => uint256) public profiles;

    struct Content {
        uint256 id;
        address owner;
        string contentURI;
        uint256 tipsReceived;
    }

    struct Comment {
        address commenter;
        string commentText;
    }

    mapping(uint256 => Content) public posts;
    mapping(uint256 => Content) public songs;
    mapping(uint256 => Content) public tweets;  // Separate mapping for tweets

    mapping(uint256 => Comment[]) public postComments;
    mapping(uint256 => Comment[]) public tweetComments;

    event ProfileMinted(address indexed user, uint256 tokenId);
    event ProfileSet(address indexed user, uint256 tokenId);
    event PostCreated(address indexed user, uint256 tokenId);
    event TweetCreated(uint256 id, string contentHash, uint256 tipsReceived, address owner);
    event SongUploaded(address indexed user, uint256 tokenId);
    event TrophiesEarned(address indexed user, uint256 amount);
    event PostTipped(address indexed tipper, uint256 indexed postId, uint256 amount);
    event TweetTipped(address indexed tipper, uint256 indexed tweetId, uint256 amount);
    event PostCommented(address indexed commenter, uint256 indexed postId, string comment);
    event TweetCommented(address indexed commenter, uint256 indexed tweetId, string comment);

    constructor(TrophyToken _trophyToken) ERC721("SocialMediaNFT", "SMNFT") {
        trophyToken = _trophyToken;
    }

    // Mint a new profile (NFT-based)
    function mintProfile(string calldata profileURI) external {
        uint256 newProfileId = nextProfileId++;
        _mint(msg.sender, newProfileId);
        _setTokenURI(newProfileId, profileURI);

        profiles[msg.sender] = newProfileId;

        emit ProfileMinted(msg.sender, newProfileId);
        emit ProfileSet(msg.sender, newProfileId);
    }

    // Set a specific profile as the current profile (NFT-based)
    function setProfile(uint256 _id) external {
        require(ownerOf(_id) == msg.sender, "Must own the NFT you want to set as your profile.");
        profiles[msg.sender] = _id;

        emit ProfileSet(msg.sender, _id);
    }

    // View a specific profile by address
    function viewProfile(address user) external view returns (uint256) {
        return profiles[user];
    }

    // View all profiles (returns an array of token IDs)
    function viewAllProfiles() external view returns (uint256[] memory) {
        uint256 totalSupply = nextProfileId - 1;
        uint256[] memory allProfiles = new uint256[](totalSupply);
        uint256 counter = 0;

        for (uint256 i = 1; i <= totalSupply; i++) {
            allProfiles[counter] = i;
            counter++;
        }

        return allProfiles;
    }

    // Create a new post (NFT-based)
    function createPost(string calldata postURI) external {
        uint256 newPostId = nextPostId++;
        _mint(msg.sender, newPostId);
        _setTokenURI(newPostId, postURI);

        posts[newPostId] = Content(newPostId, msg.sender, postURI, 0);

        emit PostCreated(msg.sender, newPostId);
    }

    // View a specific post
    function viewPost(uint256 postId) external view returns (Content memory) {
        return posts[postId];
    }

    // View all posts
    function viewAllPosts() external view returns (Content[] memory) {
        Content[] memory allPosts = new Content[](nextPostId - 1);
        uint256 counter = 0;

        for (uint256 i = 1; i < nextPostId; i++) {
            allPosts[counter] = posts[i];
            counter++;
        }

        return allPosts;
    }

    // Upload a song (NFT-based)
    function uploadSong(string calldata songURI) external {
        uint256 newSongId = nextSongId++;
        _mint(msg.sender, newSongId);
        _setTokenURI(newSongId, songURI);

        songs[newSongId] = Content(newSongId, msg.sender, songURI, 0);

        emit SongUploaded(msg.sender, newSongId);
    }

    // View a specific song
    function viewSong(uint256 songId) external view returns (Content memory) {
        return songs[songId];
    }

    // View all songs
    function viewAllSongs() external view returns (Content[] memory) {
        Content[] memory allSongs = new Content[](nextSongId - 1);
        uint256 counter = 0;

        for (uint256 i = 1; i < nextSongId; i++) {
            allSongs[counter] = songs[i];
            counter++;
        }

        return allSongs;
    }

    // Upload a tweet (Non-NFT-based)
    function uploadTweet(string memory _tweetHash) external {
        require(balanceOf(msg.sender) > 0, "Must own an NFT to tweet");
        require(bytes(_tweetHash).length > 0, "Cannot pass empty hash");

        tweetCount++;
        tweets[tweetCount] = Content(tweetCount, msg.sender, _tweetHash, 0);

        emit TweetCreated(tweetCount, _tweetHash, 0, msg.sender);
    }

    // View a specific tweet (Non-NFT-based)
    function viewTweet(uint256 tweetId) external view returns (Content memory) {
        return tweets[tweetId];
    }

    // View all tweets (Non-NFT-based)
    function viewAllTweets() external view returns (Content[] memory) {
        Content[] memory allTweets = new Content[](tweetCount);
        for (uint256 i = 1; i <= tweetCount; i++) {
            allTweets[i - 1] = tweets[i];
        }
        return allTweets;
    }


    // Tipping functionality for posts
    function tipPost(uint256 postId) external payable {
        require(posts[postId].owner != address(0), "Post does not exist.");
        require(msg.value > 0, "Tip amount must be greater than zero.");

        posts[postId].tipsReceived += msg.value;
        payable(posts[postId].owner).transfer(msg.value);

        emit PostTipped(msg.sender, postId, msg.value);
    }

    // Tipping functionality for tweets
    function tipTweet(uint256 tweetId) external payable {
        require(tweets[tweetId].owner != address(0), "Tweet does not exist.");
        require(msg.value > 0, "Tip amount must be greater than zero.");

        tweets[tweetId].tipsReceived += msg.value;
        payable(tweets[tweetId].owner).transfer(msg.value);

        emit TweetTipped(msg.sender, tweetId, msg.value);
    }

    // Mint ERC20 tokens for event completion
    function mintTokensForEventCompletion(address user, uint256 amount) external {
        // Mint ERC20 tokens using the trophyToken contract instance
        trophyToken.mintTrophies(user, amount);

        // Emit an event to log token minting
        emit TrophiesEarned(user, amount);
    }
}
