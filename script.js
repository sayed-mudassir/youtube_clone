const BASE_URL = "https://www.googleapis.com/youtube/v3";
const video_http = "https://www.googleapis.com/youtube/v3/videos?";
const channel_http = "https://www.googleapis.com/youtube/v3/channels?";

const body = document.getElementById("body");


const API_KEY = "AIzaSyCu4znECfXCutH07IzgcdbEFoSyzUqkpG0";

async function searchVideos(searchQuery, maxResult, typeOfDetails) {
  body.innerHTML=``;
  try {
    const response = await fetch(
      BASE_URL +
        "/search" +
        `?key=${API_KEY}
        &part=${typeOfDetails}
        &q=${searchQuery}
        &maxResults=${maxResult}`
    );
    const data = await response.json();
    data.items.forEach((item) => {
      item.id = item.id.videoId;
      getChannelIcon(item);
    });
  } catch (e) {
    console.log(e);
  }
}
// searchVideos("a", 1, "snippet");

async function fetchVideoStats(vidId, typeOfDetails) {
  try {
    const response = await fetch(
      BASE_URL +
        "/videos" +
        `?key=${API_KEY}
        &part=${typeOfDetails}
        &id=${vidId}`
    );
    const data = await response.json();
    console.log(data);
  } catch (e) {
    console.log(e);
  }
}
// fetchVideoStats("uV50UfcIT68","contentDetails")
// // to get duration of videos in pt format pt is a period of time
// fetchVideoStats("uV50UfcIT68","statistics")
// // to get the views count, likes count,

async function fetchChannelLogo(channelId) {
  try {
    const response = await fetch(
      BASE_URL +
        "/channels" +
        `?key=${API_KEY}
          &part=snippet
          &id=${channelId}`
    );
    const data = await response.json();
    console.log(data);
  } catch (e) {
    console.log(e);
  }
}
// fetchChannelLogo("UCt2JXOLNxqry7B_4rRZME3Q")
async function getComments(vidId) {
  try {
    const response = await fetch(
      BASE_URL +
        "/comments" +
        `?key=${API_KEY}
          &videoId=${vidId}
          &part=snippet`
    );
    const data = await response.json();
    console.log(data);
  } catch (e) {
    console.log(e);
  }
}
// getComments("OFMIJXUYI-E")
// getComments("uV50UfcIT68")

async function fetchVideo() {
  body.innerHTML=``;
  try {
    const response = await fetch(
      video_http +
        new URLSearchParams({
          key: API_KEY,
          part: "snippet",
          chart: "mostPopular",
          maxResults: 50,
          regionCode: "IN",
        })
    );
    const data = await response.json();
    data.items.forEach((item) => {
      getChannelIcon(item);
    });
  } catch (e) {
    console.log(e);
  }
}
async function getChannelIcon(video_data) {
  try {
    const response = await fetch(
      channel_http +
        new URLSearchParams({
          key: API_KEY,
          part: "snippet",
          id: video_data.snippet.channelId,
        })
    );
    const data = await response.json();
    video_data.channelThumbnail = data.items[0].snippet.thumbnails.default.url;
    makeVideoCard(video_data)
  } catch (e) {
    console.log(e);
  }
}

const makeVideoCard = (data) => {
  const videoContainer = document.createElement("div");
  videoContainer.innerHTML = `
  <div class="video" onclick="location.href = 'https://youtube.com/watch?v=${data.id}'">
      <img src="${data.snippet.thumbnails.high.url}" class="thumbnail" alt="">
      <div class="content">
          <img src="${data.channelThumbnail}" class="channel-icon" alt="">
          <div class="info">
              <h4 class="title">${data.snippet.title}</h4>
              <p class="channel-name">${data.snippet.channelTitle}</p>
          </div>
      </div>
  </div>
  `;
  body.appendChild(videoContainer);
};

fetchVideo();
