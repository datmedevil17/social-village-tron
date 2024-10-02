// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./TrophyToken.sol";

contract SocialMediaPlatform is ERC721URIStorage {

    uint256 private nextTokenId = 1;

    TrophyToken public trophyToken;

    mapping(address => uint256) public profiles;

    struct Content {
        address owner;
        string contentURI;
        uint256 tipsReceived;
    }

    struct Comment {
        address commenter;
        string commentText;
    }

    mapping(uint256 => Content) public posts;
    mapping(uint256 => Content) public tweets;
    mapping(uint256 => Content) public songs;

    mapping(uint256 => Comment[]) public postComments;
    mapping(uint256 => Comment[]) public tweetComments;

    event ProfileMinted(address indexed user, uint256 tokenId);
    event ProfileSet(address indexed user, uint256 tokenId);
    event PostCreated(address indexed user, uint256 tokenId);
    event TweetCreated(address indexed user, uint256 tokenId);
    event SongUploaded(address indexed user, uint256 tokenId);
    event TrophiesEarned(address indexed user, uint256 amount);
    event PostTipped(address indexed tipper, uint256 indexed postId, uint256 amount);
    event TweetTipped(address indexed tipper, uint256 indexed tweetId, uint256 amount);
    event PostCommented(address indexed commenter, uint256 indexed postId, string comment);
    event TweetCommented(address indexed commenter, uint256 indexed tweetId, string comment);

    constructor(TrophyToken _trophyToken) ERC721("SocialMediaNFT", "SMNFT") {
        trophyToken = _trophyToken;
    }

    function mintProfile(string calldata profileURI) external {
        uint256 newProfileId = nextTokenId++;
        _mint(msg.sender, newProfileId);
        _setTokenURI(newProfileId, profileURI);

        profiles[msg.sender] = newProfileId;

        emit ProfileMinted(msg.sender, newProfileId);
        emit ProfileSet(msg.sender, newProfileId);
    }

    function setProfile(uint256 _id) external {
        require(ownerOf(_id) == msg.sender, "Must own the NFT you want to set as your profile.");
        profiles[msg.sender] = _id;

        emit ProfileSet(msg.sender, _id);
    }

    function createPost(string calldata postURI) external {
        uint256 newPostId = nextTokenId++;
        _mint(msg.sender, newPostId);
        _setTokenURI(newPostId, postURI);

        posts[newPostId] = Content(msg.sender, postURI, 0);

        emit PostCreated(msg.sender, newPostId);
    }

    function createTweet(string calldata tweetURI) external {
        uint256 newTweetId = nextTokenId++;
        _mint(msg.sender, newTweetId);
        _setTokenURI(newTweetId, tweetURI);

        tweets[newTweetId] = Content(msg.sender, tweetURI, 0);

        emit TweetCreated(msg.sender, newTweetId);
    }

    function uploadSong(string calldata songURI) external {
        uint256 newSongId = nextTokenId++;
        _mint(msg.sender, newSongId);
        _setTokenURI(newSongId, songURI);

        songs[newSongId] = Content(msg.sender, songURI, 0);

        emit SongUploaded(msg.sender, newSongId);
    }

    function earnTrophies(address user, uint256 amount) external {
        trophyToken.mintTrophies(user, amount);
        emit TrophiesEarned(user, amount);
    }

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

    // Adding a comment to a post
    function commentOnPost(uint256 postId, string calldata commentText) external {
        require(posts[postId].owner != address(0), "Post does not exist.");

        postComments[postId].push(Comment(msg.sender, commentText));

        emit PostCommented(msg.sender, postId, commentText);
    }

    // Adding a comment to a tweet
    function commentOnTweet(uint256 tweetId, string calldata commentText) external {
        require(tweets[tweetId].owner != address(0), "Tweet does not exist.");

        tweetComments[tweetId].push(Comment(msg.sender, commentText));

        emit TweetCommented(msg.sender, tweetId, commentText);
    }

    function viewProfile(address user) external view returns (uint256) {
        return profiles[user];
    }

    function viewPost(uint256 postId) external view returns (Content memory) {
        return posts[postId];
    }

    function viewTweet(uint256 tweetId) external view returns (Content memory) {
        return tweets[tweetId];
    }

    function viewSong(uint256 songId) external view returns (Content memory) {
        return songs[songId];
    }

    // View comments on a post
    function viewPostComments(uint256 postId) external view returns (Comment[] memory) {
        return postComments[postId];
    }

    // View comments on a tweet
    function viewTweetComments(uint256 tweetId) external view returns (Comment[] memory) {
        return tweetComments[tweetId];
    }
}
